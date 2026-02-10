// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title CreatorStore
 * @notice Crypto-native creator commerce contract for OWNED platform
 * @dev Each creator deploys their own permissionless store instance
 * 
 * WHY 3% FEE: Platform sustainability without subscriptions. Creators keep 97%.
 * WHY NFTs: Onchain proof of purchase, composable, portable, censorship-resistant.
 * WHY USDC: Stable value, widely held, low friction for crypto-native users.
 */
contract CreatorStore is ERC721, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Constants
    uint256 public constant PLATFORM_FEE_BASIS_POINTS = 300; // 3%
    uint256 public constant BASIS_POINTS_DIVISOR = 10000;

    // USDC contract
    IERC20 public immutable usdcToken;
    
    // Platform fee address
    address public immutable platformFeeAddress;

    // Product structure
    struct Product {
        uint256 price;        // Price in USDC (6 decimals)
        string ipfsHash;      // IPFS hash for product metadata
        uint256 maxSupply;    // Maximum supply (0 = unlimited)
        uint256 sold;         // Number sold
        bool active;          // Product is active
    }

    // State variables
    mapping(uint256 => Product) public products;
    mapping(uint256 => uint256) public tokenIdToProductId;
    uint256 public nextTokenId = 1;
    
    // Balances
    uint256 public creatorBalance;
    uint256 public platformBalance;

    // Events
    event ProductAdded(
        uint256 indexed productId,
        uint256 price,
        string ipfsHash,
        uint256 maxSupply
    );
    
    event ProductPurchased(
        uint256 indexed productId,
        address indexed buyer,
        uint256 tokenId,
        uint256 price
    );
    
    event CreatorWithdrawal(address indexed creator, uint256 amount);
    event PlatformWithdrawal(address indexed platform, uint256 amount);

    /**
     * @notice Initialize a new creator store
     * @param _usdcAddress USDC token contract address
     * @param _platformFeeAddress Address to receive platform fees
     * @param _storeName Name for the store's NFTs
     * @param _storeSymbol Symbol for the store's NFTs
     */
    constructor(
        address _usdcAddress,
        address _platformFeeAddress,
        string memory _storeName,
        string memory _storeSymbol
    ) ERC721(_storeName, _storeSymbol) Ownable(msg.sender) {
        require(_usdcAddress != address(0), "Invalid USDC address");
        require(_platformFeeAddress != address(0), "Invalid platform fee address");
        
        usdcToken = IERC20(_usdcAddress);
        platformFeeAddress = _platformFeeAddress;
    }

    /**
     * @notice Add a new product to the store
     * @param _productId Unique product identifier
     * @param _priceInUSDC Price in USDC (with 6 decimals, e.g., 50000000 = 50 USDC)
     * @param _ipfsHash IPFS hash for product metadata/content
     * @param _maxSupply Maximum supply (0 for unlimited)
     */
    function addProduct(
        uint256 _productId,
        uint256 _priceInUSDC,
        string memory _ipfsHash,
        uint256 _maxSupply
    ) external onlyOwner {
        require(_priceInUSDC > 0, "Price must be greater than 0");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(!products[_productId].active, "Product ID already exists");
        
        products[_productId] = Product({
            price: _priceInUSDC,
            ipfsHash: _ipfsHash,
            maxSupply: _maxSupply,
            sold: 0,
            active: true
        });

        emit ProductAdded(_productId, _priceInUSDC, _ipfsHash, _maxSupply);
    }

    /**
     * @notice Purchase a product with USDC, receive NFT as proof
     * @param _productId Product to purchase
     */
    function purchaseProduct(uint256 _productId) external nonReentrant {
        Product storage product = products[_productId];
        
        require(product.active, "Product does not exist or is inactive");
        require(
            product.maxSupply == 0 || product.sold < product.maxSupply,
            "Product sold out"
        );

        uint256 price = product.price;
        
        // Calculate fee split: 97% creator, 3% platform
        uint256 platformFee = (price * PLATFORM_FEE_BASIS_POINTS) / BASIS_POINTS_DIVISOR;
        uint256 creatorAmount = price - platformFee;

        // Update balances BEFORE external calls (checks-effects-interactions)
        creatorBalance += creatorAmount;
        platformBalance += platformFee;
        product.sold += 1;

        // Mint NFT to buyer
        uint256 tokenId = nextTokenId;
        nextTokenId += 1;
        tokenIdToProductId[tokenId] = _productId;
        _safeMint(msg.sender, tokenId);

        // Transfer USDC from buyer (must have approved this contract first)
        usdcToken.safeTransferFrom(msg.sender, address(this), price);

        emit ProductPurchased(_productId, msg.sender, tokenId, price);
    }

    /**
     * @notice Creator withdraws their accumulated balance
     */
    function withdrawCreatorFunds() external onlyOwner nonReentrant {
        uint256 amount = creatorBalance;
        require(amount > 0, "No funds to withdraw");

        creatorBalance = 0;
        usdcToken.safeTransfer(owner(), amount);

        emit CreatorWithdrawal(owner(), amount);
    }

    /**
     * @notice Platform withdraws accumulated fees
     */
    function withdrawPlatformFees() external nonReentrant {
        require(msg.sender == platformFeeAddress, "Only platform can withdraw fees");
        
        uint256 amount = platformBalance;
        require(amount > 0, "No fees to withdraw");

        platformBalance = 0;
        usdcToken.safeTransfer(platformFeeAddress, amount);

        emit PlatformWithdrawal(platformFeeAddress, amount);
    }

    /**
     * @notice Get product details
     * @param _productId Product ID to query
     * @return Product struct
     */
    function getProduct(uint256 _productId) external view returns (Product memory) {
        return products[_productId];
    }

    /**
     * @notice Get product ID for a given token
     * @param _tokenId Token ID to query
     * @return Product ID
     */
    function getProductIdForToken(uint256 _tokenId) external view returns (uint256) {
        return tokenIdToProductId[_tokenId];
    }

    /**
     * @notice Get creator's withdrawable balance
     * @return Balance in USDC
     */
    function getCreatorBalance() external view returns (uint256) {
        return creatorBalance;
    }

    /**
     * @notice Get platform's withdrawable balance
     * @return Balance in USDC
     */
    function getPlatformBalance() external view returns (uint256) {
        return platformBalance;
    }

    /**
     * @notice Returns IPFS gateway URL for token metadata
     * @param _tokenId Token ID
     * @return IPFS gateway URL
     */
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        _requireOwned(_tokenId);
        
        uint256 productId = tokenIdToProductId[_tokenId];
        Product memory product = products[productId];
        
        return string(abi.encodePacked("https://ipfs.io/ipfs/", product.ipfsHash));
    }
}
