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
}

/// @title CreatorStore (v2)
/// @notice One store per creator, deployed as a minimal clone by StoreFactory.
///         The creator owns the store. The platform fee is fixed at creation and
///         cannot be changed by anyone. Every purchase mints an ERC-721 receipt.
/// @dev    Funds are accounted with pull-based balances. Invariant:
///         usdc.balanceOf(this) >= creatorBalance + platformBalance + sum(referralBalance).
///         The platform has no power over a store beyond collecting its fee.
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

    bytes32 public constant VOUCHER_TYPEHASH =
        keccak256("Voucher(uint256 productId,uint256 price,address buyer,uint64 expiry,uint256 nonce)");

    // ---------------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------------

    struct Product {
        uint256 price; // USDC, 6 decimals. 0 = free claim.
        uint64 maxSupply; // 0 = unlimited
        uint64 sold;
        uint16 referralBps; // share of price paid to a referrer, 0 = no referrals
        bool active;
        string uri; // public metadata URI (title, description, image). Never the deliverable.
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
    address public feeRecipient;
    uint16 public feeBps;

    uint256 public nextProductId; // first product id is 1
    uint256 public nextTokenId; // first token id is 1

    mapping(uint256 productId => Product) private _products;
    mapping(uint256 tokenId => uint256 productId) public productOf;

    uint256 public creatorBalance;
    uint256 public platformBalance;
    mapping(address referrer => uint256) public referralBalance;

    mapping(uint256 nonce => bool) public voucherNonceUsed;

    // ---------------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------------

    event ProductAdded(uint256 indexed productId, uint256 price, uint64 maxSupply, uint16 referralBps, string uri);
    event ProductUpdated(uint256 indexed productId, uint256 price, uint64 maxSupply, uint16 referralBps, string uri);
    event ProductActiveSet(uint256 indexed productId, bool active);
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
    error MaxSupplyBelowSold(uint64 maxSupply, uint64 sold);
    error PriceAboveMax(uint256 price, uint256 maxPrice);
    error VoucherExpired();
    error VoucherWrongBuyer();
    error VoucherUsed(uint256 nonce);
    error VoucherInvalidSignature();
    error VoucherAboveListPrice();
    error NothingToWithdraw();
    error NotFeeRecipient();
    error RenounceDisabled();

    // ---------------------------------------------------------------------
    // Init
    // ---------------------------------------------------------------------

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Called once by the factory right after cloning.
    function initialize(
        address owner_,
        IERC20 usdc_,
        address feeRecipient_,
        uint16 feeBps_,
        string calldata name_,
        string calldata symbol_
    ) external initializer {
        if (owner_ == address(0) || address(usdc_) == address(0) || feeRecipient_ == address(0)) revert ZeroAddress();
        if (feeBps_ > MAX_FEE_BPS) revert FeeTooHigh();

        __ERC721_init(name_, symbol_);
        __Ownable_init(owner_);
        __Pausable_init();
        __EIP712_init("OWNED CreatorStore", "2");

        usdc = usdc_;
        factory = msg.sender;
        feeRecipient = feeRecipient_;
        feeBps = feeBps_;
        nextProductId = 1;
        nextTokenId = 1;
    }

    // ---------------------------------------------------------------------
    // Creator: catalog
    // ---------------------------------------------------------------------

    function addProduct(uint256 price, uint64 maxSupply, uint16 referralBps, string calldata uri)
        external
        onlyOwner
        returns (uint256 productId)
    {
        _checkProductParams(price, referralBps, uri);
        productId = nextProductId++;
        _products[productId] = Product({
            price: price,
            maxSupply: maxSupply,
            sold: 0,
            referralBps: referralBps,
            active: true,
            uri: uri
        });
        emit ProductAdded(productId, price, maxSupply, referralBps, uri);
    }

    /// @notice Changes apply to future purchases only. Existing receipts keep pointing at this product.
    function updateProduct(uint256 productId, uint256 price, uint64 maxSupply, uint16 referralBps, string calldata uri)
        external
        onlyOwner
    {
        Product storage p = _existing(productId);
        _checkProductParams(price, referralBps, uri);
        if (maxSupply != 0 && maxSupply < p.sold) revert MaxSupplyBelowSold(maxSupply, p.sold);
        p.price = price;
        p.maxSupply = maxSupply;
        p.referralBps = referralBps;
        p.uri = uri;
        emit ProductUpdated(productId, price, maxSupply, referralBps, uri);
    }

    function setProductActive(uint256 productId, bool active) external onlyOwner {
        _existing(productId).active = active;
        emit ProductActiveSet(productId, active);
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
    /// @param referrer Optional. Ignored if it is the buyer, the store owner, or the product pays no referrals.
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
    function purchaseWithVoucher(
        Voucher calldata voucher,
        bytes calldata signature,
        address referrer,
        Permit calldata permit
    ) external nonReentrant whenNotPaused returns (uint256 tokenId) {
        if (voucher.expiry < block.timestamp) revert VoucherExpired();
        if (voucher.buyer != address(0) && voucher.buyer != msg.sender) revert VoucherWrongBuyer();
        if (voucherNonceUsed[voucher.nonce]) revert VoucherUsed(voucher.nonce);
        if (voucher.price > _existing(voucher.productId).price) revert VoucherAboveListPrice();

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    VOUCHER_TYPEHASH, voucher.productId, voucher.price, voucher.buyer, voucher.expiry, voucher.nonce
                )
            )
        );
        if (!SignatureChecker.isValidSignatureNow(owner(), digest, signature)) revert VoucherInvalidSignature();

        voucherNonceUsed[voucher.nonce] = true;
        emit VoucherRedeemed(voucher.nonce, voucher.productId, msg.sender, voucher.price);

        _maybePermit(permit);
        tokenId = _purchase(voucher.productId, voucher.price, referrer);
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

    function withdrawPlatform() external nonReentrant {
        if (msg.sender != feeRecipient) revert NotFeeRecipient();
        uint256 amount = platformBalance;
        if (amount == 0) revert NothingToWithdraw();
        platformBalance = 0;
        usdc.safeTransfer(feeRecipient, amount);
        emit PlatformWithdrawal(feeRecipient, amount);
    }

    function withdrawReferral(address to) external nonReentrant {
        if (to == address(0)) revert ZeroAddress();
        uint256 amount = referralBalance[msg.sender];
        if (amount == 0) revert NothingToWithdraw();
        referralBalance[msg.sender] = 0;
        usdc.safeTransfer(to, amount);
        emit ReferralWithdrawal(msg.sender, to, amount);
    }

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------

    function getProduct(uint256 productId) external view returns (Product memory) {
        return _products[productId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _products[productOf[tokenId]].uri;
    }

    /// @notice EIP-712 digest a creator signs to issue a voucher. Exposed for frontends and tests.
    function voucherDigest(Voucher calldata voucher) external view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    VOUCHER_TYPEHASH, voucher.productId, voucher.price, voucher.buyer, voucher.expiry, voucher.nonce
                )
            )
        );
    }

    // ---------------------------------------------------------------------
    // Ownership
    // ---------------------------------------------------------------------

    /// @dev Renouncing would strand the creator balance forever.
    function renounceOwnership() public pure override {
        revert RenounceDisabled();
    }

    // ---------------------------------------------------------------------
    // Internal
    // ---------------------------------------------------------------------

    function _purchase(uint256 productId, uint256 price, address referrer) internal returns (uint256 tokenId) {
        Product storage p = _products[productId];
        if (!p.active) revert ProductInactive(productId);
        if (p.maxSupply != 0 && p.sold >= p.maxSupply) revert SoldOut(productId);

        // Effects
        p.sold += 1;

        uint256 fee = (price * feeBps) / BPS;
        uint256 referralAmount;
        if (p.referralBps != 0 && referrer != address(0) && referrer != msg.sender && referrer != owner()) {
            referralAmount = (price * p.referralBps) / BPS;
            referralBalance[referrer] += referralAmount;
        } else {
            referrer = address(0);
        }
        platformBalance += fee;
        creatorBalance += price - fee - referralAmount;

        tokenId = nextTokenId++;
        productOf[tokenId] = productId;

        // Interactions: take payment first, then mint. _mint does not call the receiver.
        if (price != 0) usdc.safeTransferFrom(msg.sender, address(this), price);
        _mint(msg.sender, tokenId);

        emit Purchased(productId, msg.sender, tokenId, price, fee, referrer, referralAmount);
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

    function _checkProductParams(uint256 price, uint16 referralBps, string calldata uri) internal view {
        if (bytes(uri).length == 0) revert EmptyUri();
        if (referralBps > MAX_REFERRAL_BPS) revert ReferralTooHigh();
        uint256 cap = IStoreFactory(factory).priceCap();
        if (price > cap) revert PriceAboveCap(price, cap);
    }
}
