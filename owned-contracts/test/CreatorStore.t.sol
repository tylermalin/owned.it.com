// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CreatorStore.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC contract for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC with 6 decimals
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract CreatorStoreTest is Test {
    CreatorStore public store;
    MockUSDC public usdc;
    
    address public creator = address(0x1);
    address public platform = address(0x2);
    address public buyer = address(0x3);
    
    uint256 constant PRODUCT_PRICE = 50 * 10**6; // 50 USDC
    uint256 constant PRODUCT_ID = 1;
    string constant IPFS_HASH = "QmTestHash123";
    uint256 constant MAX_SUPPLY = 100;

    function setUp() public {
        // Deploy mock USDC
        usdc = new MockUSDC();
        
        // Deploy CreatorStore as creator
        vm.prank(creator);
        store = new CreatorStore(
            address(usdc),
            platform,
            "OWNED Store",
            "OWNED"
        );
        
        // Give buyer some USDC
        usdc.mint(buyer, 1000 * 10**6); // 1000 USDC
    }

    function testAddProduct() public {
        vm.prank(creator);
        
        vm.expectEmit(true, false, false, true);
        emit CreatorStore.ProductAdded(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        CreatorStore.Product memory product = store.getProduct(PRODUCT_ID);
        assertEq(product.price, PRODUCT_PRICE);
        assertEq(product.ipfsHash, IPFS_HASH);
        assertEq(product.maxSupply, MAX_SUPPLY);
        assertEq(product.sold, 0);
        assertTrue(product.active);
    }

    function testPurchase() public {
        // Add product
        vm.prank(creator);
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        // Buyer approves USDC spending
        vm.prank(buyer);
        usdc.approve(address(store), PRODUCT_PRICE);
        
        // Calculate expected split
        uint256 platformFee = (PRODUCT_PRICE * 300) / 10000; // 3%
        uint256 creatorAmount = PRODUCT_PRICE - platformFee;
        
        // Purchase product
        vm.prank(buyer);
        vm.expectEmit(true, true, false, true);
        emit CreatorStore.ProductPurchased(PRODUCT_ID, buyer, 1, PRODUCT_PRICE);
        
        store.purchaseProduct(PRODUCT_ID);
        
        // Verify NFT minted to buyer
        assertEq(store.ownerOf(1), buyer);
        assertEq(store.getProductIdForToken(1), PRODUCT_ID);
        
        // Verify balances
        assertEq(store.getCreatorBalance(), creatorAmount);
        assertEq(store.getPlatformBalance(), platformFee);
        
        // Verify product sold count
        CreatorStore.Product memory product = store.getProduct(PRODUCT_ID);
        assertEq(product.sold, 1);
    }

    function testPurchaseSoldOut() public {
        // Add product with maxSupply = 1
        vm.prank(creator);
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, 1);
        
        // First purchase (should succeed)
        vm.prank(buyer);
        usdc.approve(address(store), PRODUCT_PRICE * 2);
        vm.prank(buyer);
        store.purchaseProduct(PRODUCT_ID);
        
        // Second purchase (should fail - sold out)
        vm.prank(buyer);
        vm.expectRevert("Product sold out");
        store.purchaseProduct(PRODUCT_ID);
    }

    function testWithdrawCreator() public {
        // Add and purchase product
        vm.prank(creator);
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        vm.prank(buyer);
        usdc.approve(address(store), PRODUCT_PRICE);
        vm.prank(buyer);
        store.purchaseProduct(PRODUCT_ID);
        
        uint256 creatorBalanceBefore = usdc.balanceOf(creator);
        uint256 expectedAmount = store.getCreatorBalance();
        
        // Creator withdraws
        vm.prank(creator);
        vm.expectEmit(true, false, false, true);
        emit CreatorStore.CreatorWithdrawal(creator, expectedAmount);
        
        store.withdrawCreatorFunds();
        
        // Verify USDC transferred
        assertEq(usdc.balanceOf(creator), creatorBalanceBefore + expectedAmount);
        assertEq(store.getCreatorBalance(), 0);
    }

    function testWithdrawPlatform() public {
        // Add and purchase product
        vm.prank(creator);
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        vm.prank(buyer);
        usdc.approve(address(store), PRODUCT_PRICE);
        vm.prank(buyer);
        store.purchaseProduct(PRODUCT_ID);
        
        uint256 platformBalanceBefore = usdc.balanceOf(platform);
        uint256 expectedAmount = store.getPlatformBalance();
        
        // Platform withdraws
        vm.prank(platform);
        vm.expectEmit(true, false, false, true);
        emit CreatorStore.PlatformWithdrawal(platform, expectedAmount);
        
        store.withdrawPlatformFees();
        
        // Verify USDC transferred
        assertEq(usdc.balanceOf(platform), platformBalanceBefore + expectedAmount);
        assertEq(store.getPlatformBalance(), 0);
    }

    function testUnauthorizedWithdraw() public {
        // Add and purchase product
        vm.prank(creator);
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        vm.prank(buyer);
        usdc.approve(address(store), PRODUCT_PRICE);
        vm.prank(buyer);
        store.purchaseProduct(PRODUCT_ID);
        
        // Non-owner tries to withdraw creator funds
        vm.prank(buyer);
        vm.expectRevert();
        store.withdrawCreatorFunds();
        
        // Non-platform tries to withdraw platform fees
        vm.prank(buyer);
        vm.expectRevert("Only platform can withdraw fees");
        store.withdrawPlatformFees();
    }

    function testInsufficientApproval() public {
        // Add product
        vm.prank(creator);
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        // Buyer doesn't approve (or approves insufficient amount)
        vm.prank(buyer);
        usdc.approve(address(store), PRODUCT_PRICE - 1);
        
        // Purchase should fail
        vm.prank(buyer);
        vm.expectRevert();
        store.purchaseProduct(PRODUCT_ID);
    }

    function testTokenURI() public {
        // Add product
        vm.prank(creator);
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        // Purchase product
        vm.prank(buyer);
        usdc.approve(address(store), PRODUCT_PRICE);
        vm.prank(buyer);
        store.purchaseProduct(PRODUCT_ID);
        
        // Verify tokenURI
        string memory expectedURI = string(abi.encodePacked("https://ipfs.io/ipfs/", IPFS_HASH));
        assertEq(store.tokenURI(1), expectedURI);
    }

    function testProductDoesNotExist() public {
        // Try to purchase non-existent product
        vm.prank(buyer);
        vm.expectRevert("Product does not exist or is inactive");
        store.purchaseProduct(999);
    }

    function testAddProductOnlyOwner() public {
        // Non-owner tries to add product
        vm.prank(buyer);
        vm.expectRevert();
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
    }

    function testDuplicateProductId() public {
        // Add product
        vm.prank(creator);
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE, IPFS_HASH, MAX_SUPPLY);
        
        // Try to add product with same ID (should fail)
        vm.prank(creator);
        vm.expectRevert("Product ID already exists");
        store.addProduct(PRODUCT_ID, PRODUCT_PRICE * 2, "QmDifferentHash", MAX_SUPPLY * 2);
    }
}
