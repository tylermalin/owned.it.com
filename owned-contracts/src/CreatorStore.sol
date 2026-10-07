// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {ReentrancyGuardTransient} from "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

interface IStoreFactory {
    function priceCap() external view returns (uint256);
    function feeRecipient() external view returns (address);
}

/// @title CreatorStore (v2)
/// @notice One store per creator, deployed as a minimal clone by StoreFactory.
///         The creator owns the store. The platform fee rate is fixed at creation and
///         cannot be changed by anyone. Every purchase mints an ERC-721 receipt.
/// @dev    Pull-based accounting. Invariant:
///         usdc.balanceOf(this) >= creatorBalance + platformBalance + totalReferralOwed.
///         Anything above that is unsolicited and only the creator can sweep it.
///         Trust only stores the factory created (StoreFactory.isStore / StoreCreated):
///         anyone can clone the implementation and initialize it with a fake factory.
contract CreatorStore is
    Initializable,
    ERC721Upgradeable,
    Ownable2StepUpgradeable,
    PausableUpgradeable,
    EIP712Upgradeable,
    ReentrancyGuardTransient
{
    using SafeERC20 for IERC20;

    // ---------------------------------------------------------------------
    // Constants
    // ---------------------------------------------------------------------

    uint256 public constant BPS = 10_000;
    uint16 public constant MAX_FEE_BPS = 1_000; // 10% hard ceiling, checked at init
    uint16 public constant MAX_REFERRAL_BPS = 5_000; // 50% of a sale

    /// @dev `epoch` binds a voucher to the ownership period it was signed in.
    bytes32 public constant VOUCHER_TYPEHASH = keccak256(
        "Voucher(uint256 productId,uint256 price,address buyer,uint64 expiry,uint256 nonce,uint256 epoch)"
    );

    // ---------------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------------

    /// @notice What a creator sets when adding or updating a product.
    struct ProductInput {
        uint256 price; // USDC, 6 decimals. 0 = free claim.
        uint64 maxSupply; // 0 = unlimited
        uint32 maxPerWallet; // 0 = unlimited
        uint16 referralBps; // share paid to an approved referrer, 0 = none
        string uri; // public metadata URI. Never the deliverable.
    }

    struct Product {
        uint256 price;
        uint64 maxSupply;
        uint64 sold;
        uint32 maxPerWallet;
        uint32 version; // metadata version, bumped when the URI changes
        uint16 referralBps;
        bool active;
    }

    struct ProductView {
        uint256 price;
        uint64 maxSupply;
        uint64 sold;
        uint32 maxPerWallet;
        uint32 version;
        uint16 referralBps;
        bool active;
        string uri; // current URI
    }

    /// @notice A creator-signed price override for one product. `buyer == address(0)` means anyone.
    struct Voucher {
        uint256 productId;
        uint256 price;
        address buyer;
        uint64 expiry;
        uint256 nonce;
    }

    /// @notice Optional EIP-2612 permit. Pass deadline == 0 to skip and rely on an existing allowance.
    struct Permit {
        uint256 value;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    // ---------------------------------------------------------------------
    // Storage
    // ---------------------------------------------------------------------

    IERC20 public usdc;
    address public factory;
    uint16 public feeBps;

    uint256 public nextProductId; // first product id is 1
    uint256 public nextTokenId; // first token id is 1
    uint256 public ownerEpoch; // bumps on every ownership change

    mapping(uint256 productId => Product) private _products;
    mapping(uint256 productId => mapping(uint32 version => string)) private _uris;
    mapping(uint256 productId => mapping(address buyer => uint256)) public purchasedBy;

    mapping(uint256 tokenId => uint256 productId) public productOf;
    mapping(uint256 tokenId => uint32 version) public versionOf;

    uint256 public creatorBalance;
    uint256 public platformBalance;
    uint256 public totalReferralOwed;
    mapping(address referrer => uint256) public referralBalance;
    mapping(address referrer => bool) public approvedReferrer;

    mapping(uint256 nonce => bool) public voucherNonceUsed;

    // ---------------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------------

    event ProductAdded(uint256 indexed productId, ProductInput input);
    event ProductUpdated(uint256 indexed productId, ProductInput input, uint32 version);
    event ProductActiveSet(uint256 indexed productId, bool active);
    event ReferrerSet(address indexed referrer, bool approved);
    event Purchased(
        uint256 indexed productId,
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 price,
        uint256 platformFee,
        address referrer,
        uint256 referralAmount
    );
    event VoucherRedeemed(uint256 indexed nonce, uint256 indexed productId, address indexed buyer, uint256 price);
    event VoucherCancelled(uint256 indexed nonce);
    event CreatorWithdrawal(address indexed to, uint256 amount);
    event PlatformWithdrawal(address indexed to, uint256 amount);
    event ReferralWithdrawal(address indexed referrer, address indexed to, uint256 amount);
    event ExcessSwept(address indexed to, uint256 amount);
    event TokenRescued(address indexed token, address indexed to, uint256 amount);

    // ---------------------------------------------------------------------
    // Errors
    // ---------------------------------------------------------------------

    error ZeroAddress();
    error FeeTooHigh();
    error ReferralTooHigh();
    error PriceAboveCap(uint256 price, uint256 cap);
    error EmptyUri();
    error UnknownProduct(uint256 productId);
    error ProductInactive(uint256 productId);
    error SoldOut(uint256 productId);
    error WalletLimitReached(uint256 productId);
    error MaxSupplyBelowSold(uint64 maxSupply, uint64 sold);
    error PriceAboveMax(uint256 price, uint256 maxPrice);
    error VoucherExpired();
    error VoucherWrongBuyer();
    error VoucherUsed(uint256 nonce);
    error VoucherInvalidSignature();
    error VoucherAboveListPrice();
    error InvalidReferrer();
    error NothingToWithdraw();
    error NotFeeRecipient();
    error RenounceDisabled();
    error UseSweepForUsdc();

    // ---------------------------------------------------------------------
    // Init
    // ---------------------------------------------------------------------

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Called once by the factory right after cloning.
    function initialize(address owner_, IERC20 usdc_, uint16 feeBps_, string calldata name_, string calldata symbol_)
        external
        initializer
    {
        if (owner_ == address(0) || address(usdc_) == address(0)) revert ZeroAddress();
        if (feeBps_ > MAX_FEE_BPS) revert FeeTooHigh();

        __ERC721_init(name_, symbol_);
        __Ownable_init(owner_);
        __Pausable_init();
        __EIP712_init("OWNED CreatorStore", "2");

        usdc = usdc_;
        factory = msg.sender;
        feeBps = feeBps_;
        nextProductId = 1;
        nextTokenId = 1;
    }

    // ---------------------------------------------------------------------
    // Creator: catalog
    // ---------------------------------------------------------------------

    function addProduct(ProductInput calldata input) external onlyOwner returns (uint256 productId) {
        _checkInput(input);
        productId = nextProductId++;
        _products[productId] = Product({
            price: input.price,
            maxSupply: input.maxSupply,
            sold: 0,
            maxPerWallet: input.maxPerWallet,
            version: 1,
            referralBps: input.referralBps,
            active: true
        });
        _uris[productId][1] = input.uri;
        emit ProductAdded(productId, input);
    }

    /// @notice Changes apply to future purchases only. Receipts already sold keep the metadata they were sold with.
    function updateProduct(uint256 productId, ProductInput calldata input) external onlyOwner {
        Product storage p = _existing(productId);
        _checkInput(input);
        if (input.maxSupply != 0 && input.maxSupply < p.sold) revert MaxSupplyBelowSold(input.maxSupply, p.sold);
        p.price = input.price;
        p.maxSupply = input.maxSupply;
        p.maxPerWallet = input.maxPerWallet;
        p.referralBps = input.referralBps;
        if (keccak256(bytes(input.uri)) != keccak256(bytes(_uris[productId][p.version]))) {
            p.version += 1;
            _uris[productId][p.version] = input.uri;
        }
        emit ProductUpdated(productId, input, p.version);
    }

    function setProductActive(uint256 productId, bool active) external onlyOwner {
        _existing(productId).active = active;
        emit ProductActiveSet(productId, active);
    }

    /// @notice Only approved referrers earn referral shares. This stops buyers from paying
    ///         the referral cut to themselves (a free discount) or burning it to a dead address.
    function setReferrer(address referrer, bool approved) external onlyOwner {
        if (referrer == address(0) || referrer == address(this) || referrer == owner()) revert InvalidReferrer();
        approvedReferrer[referrer] = approved;
        emit ReferrerSet(referrer, approved);
    }

    /// @notice Stops all new purchases. Withdrawals keep working.
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function cancelVoucher(uint256 nonce) external onlyOwner {
        if (voucherNonceUsed[nonce]) revert VoucherUsed(nonce);
        voucherNonceUsed[nonce] = true;
        emit VoucherCancelled(nonce);
    }

    // ---------------------------------------------------------------------
    // Buyers
    // ---------------------------------------------------------------------

    /// @param maxPrice Reverts if the list price is above this. Protects buyers from a price change
    ///        landing between their signature and their transaction.
    /// @param referrer Optional. Paid only if approved by the creator, not the buyer, and the product pays referrals.
    function purchase(uint256 productId, uint256 maxPrice, address referrer, Permit calldata permit)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 tokenId)
    {
        uint256 price = _existing(productId).price;
        if (price > maxPrice) revert PriceAboveMax(price, maxPrice);
        _maybePermit(permit);
        tokenId = _purchase(productId, price, referrer);
    }

    /// @notice Buy at a price the store owner signed. Used for discounts, gifts (price 0) and private offers.
    ///         Voucher sales never pay a referral share, so discounts cannot stack.
    function purchaseWithVoucher(Voucher calldata voucher, bytes calldata signature, Permit calldata permit)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 tokenId)
    {
        if (voucher.expiry < block.timestamp) revert VoucherExpired();
        if (voucher.buyer != address(0) && voucher.buyer != msg.sender) revert VoucherWrongBuyer();
        if (voucherNonceUsed[voucher.nonce]) revert VoucherUsed(voucher.nonce);
        if (voucher.price > _existing(voucher.productId).price) revert VoucherAboveListPrice();

        if (!SignatureChecker.isValidSignatureNow(owner(), _voucherDigest(voucher), signature)) {
            revert VoucherInvalidSignature();
        }

        voucherNonceUsed[voucher.nonce] = true;
        emit VoucherRedeemed(voucher.nonce, voucher.productId, msg.sender, voucher.price);

        _maybePermit(permit);
        tokenId = _purchase(voucher.productId, voucher.price, address(0));
    }

    // ---------------------------------------------------------------------
    // Withdrawals (never paused)
    // ---------------------------------------------------------------------

    function withdrawCreator(address to) external onlyOwner nonReentrant {
        if (to == address(0)) revert ZeroAddress();
        uint256 amount = creatorBalance;
        if (amount == 0) revert NothingToWithdraw();
        creatorBalance = 0;
        usdc.safeTransfer(to, amount);
        emit CreatorWithdrawal(to, amount);
    }

    /// @notice Pays the platform balance to whoever the factory currently names as fee recipient.
    ///         The factory can rotate that address if it is lost or blacklisted.
    function withdrawPlatform() external nonReentrant {
        address recipient = IStoreFactory(factory).feeRecipient();
        if (msg.sender != recipient) revert NotFeeRecipient();
        uint256 amount = platformBalance;
        if (amount == 0) revert NothingToWithdraw();
        platformBalance = 0;
        usdc.safeTransfer(recipient, amount);
        emit PlatformWithdrawal(recipient, amount);
    }

    function withdrawReferral(address to) external nonReentrant {
        if (to == address(0)) revert ZeroAddress();
        uint256 amount = referralBalance[msg.sender];
        if (amount == 0) revert NothingToWithdraw();
        referralBalance[msg.sender] = 0;
        totalReferralOwed -= amount;
        usdc.safeTransfer(to, amount);
        emit ReferralWithdrawal(msg.sender, to, amount);
    }

    /// @notice Send USDC that arrived outside a purchase (owed to nobody) to the creator's chosen address.
    function sweepExcess(address to) external onlyOwner nonReentrant {
        if (to == address(0)) revert ZeroAddress();
        uint256 excess = excessUsdc();
        if (excess == 0) revert NothingToWithdraw();
        usdc.safeTransfer(to, excess);
        emit ExcessSwept(to, excess);
    }

    /// @notice Recover any token other than USDC sent here by mistake.
    function rescueToken(IERC20 token, address to) external onlyOwner nonReentrant {
        if (address(token) == address(usdc)) revert UseSweepForUsdc();
        if (to == address(0)) revert ZeroAddress();
        uint256 amount = token.balanceOf(address(this));
        if (amount == 0) revert NothingToWithdraw();
        token.safeTransfer(to, amount);
        emit TokenRescued(address(token), to, amount);
    }

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------

    function getProduct(uint256 productId) external view returns (ProductView memory v) {
        Product storage p = _products[productId];
        v = ProductView({
            price: p.price,
            maxSupply: p.maxSupply,
            sold: p.sold,
            maxPerWallet: p.maxPerWallet,
            version: p.version,
            referralBps: p.referralBps,
            active: p.active,
            uri: _uris[productId][p.version]
        });
    }

    /// @notice Metadata of a receipt, frozen at the version it was sold under.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _uris[productOf[tokenId]][versionOf[tokenId]];
    }

    function feeRecipient() external view returns (address) {
        return IStoreFactory(factory).feeRecipient();
    }

    /// @notice USDC held beyond what is owed to the creator, platform and referrers.
    function excessUsdc() public view returns (uint256) {
        uint256 held = usdc.balanceOf(address(this));
        uint256 owed = creatorBalance + platformBalance + totalReferralOwed;
        return held > owed ? held - owed : 0;
    }

    /// @notice EIP-712 digest the current owner signs to issue a voucher.
    function voucherDigest(Voucher calldata voucher) external view returns (bytes32) {
        return _voucherDigest(voucher);
    }

    // ---------------------------------------------------------------------
    // Ownership
    // ---------------------------------------------------------------------

    /// @dev Renouncing would strand the creator balance forever.
    function renounceOwnership() public pure override {
        revert RenounceDisabled();
    }

    /// @dev Every ownership change starts a new voucher epoch, so vouchers signed by an
    ///      earlier owner stay dead even if ownership later returns to that key.
    function _transferOwnership(address newOwner) internal override {
        super._transferOwnership(newOwner);
        ownerEpoch += 1;
    }

    // ---------------------------------------------------------------------
    // Internal
    // ---------------------------------------------------------------------

    function _purchase(uint256 productId, uint256 price, address referrer) internal returns (uint256 tokenId) {
        Product storage p = _products[productId];
        if (!p.active) revert ProductInactive(productId);
        if (p.maxSupply != 0 && p.sold >= p.maxSupply) revert SoldOut(productId);
        if (p.maxPerWallet != 0 && purchasedBy[productId][msg.sender] >= p.maxPerWallet) {
            revert WalletLimitReached(productId);
        }

        // Effects
        p.sold += 1;
        purchasedBy[productId][msg.sender] += 1;

        uint256 fee = (price * feeBps) / BPS;
        uint256 referralAmount;
        if (p.referralBps != 0 && referrer != msg.sender && approvedReferrer[referrer]) {
            referralAmount = (price * p.referralBps) / BPS;
            referralBalance[referrer] += referralAmount;
            totalReferralOwed += referralAmount;
        } else {
            referrer = address(0);
        }
        platformBalance += fee;
        creatorBalance += price - fee - referralAmount;

        tokenId = nextTokenId++;
        productOf[tokenId] = productId;
        versionOf[tokenId] = p.version;

        // Interactions: take payment first, then mint. _mint does not call the receiver.
        if (price != 0) usdc.safeTransferFrom(msg.sender, address(this), price);
        _mint(msg.sender, tokenId);

        emit Purchased(productId, msg.sender, tokenId, price, fee, referrer, referralAmount);
    }

    function _voucherDigest(Voucher calldata voucher) internal view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    VOUCHER_TYPEHASH,
                    voucher.productId,
                    voucher.price,
                    voucher.buyer,
                    voucher.expiry,
                    voucher.nonce,
                    ownerEpoch
                )
            )
        );
    }

    /// @dev A failed permit is ignored on purpose: someone may have front-run the same permit.
    ///      If the allowance is still short, transferFrom reverts with a clear error.
    function _maybePermit(Permit calldata permit) internal {
        if (permit.deadline == 0) return;
        try IERC20Permit(address(usdc)).permit(
            msg.sender, address(this), permit.value, permit.deadline, permit.v, permit.r, permit.s
        ) {} catch {}
    }

    function _existing(uint256 productId) internal view returns (Product storage p) {
        if (productId == 0 || productId >= nextProductId) revert UnknownProduct(productId);
        p = _products[productId];
    }

    function _checkInput(ProductInput calldata input) internal view {
        if (bytes(input.uri).length == 0) revert EmptyUri();
        if (input.referralBps > MAX_REFERRAL_BPS) revert ReferralTooHigh();
        uint256 cap = IStoreFactory(factory).priceCap();
        if (input.price > cap) revert PriceAboveCap(input.price, cap);
    }
}
