// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {StoreFactory} from "../src/StoreFactory.sol";
import {CreatorStore} from "../src/CreatorStore.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";

abstract contract BaseTest is Test {
    uint16 internal constant FEE_BPS = 300;
    uint256 internal constant CAP = 500e6; // $500
    uint256 internal constant PRICE = 50e6; // $50

    MockUSDC internal usdc;
    StoreFactory internal factory;
    CreatorStore internal store;

    address internal platformOwner = makeAddr("platformOwner");
    address internal feeRecipient = makeAddr("feeRecipient");
    address internal creator;
    uint256 internal creatorKey;
    address internal buyer;
    uint256 internal buyerKey;
    address internal referrer = makeAddr("referrer");
    address internal stranger = makeAddr("stranger");

    function setUp() public virtual {
        (creator, creatorKey) = makeAddrAndKey("creator");
        (buyer, buyerKey) = makeAddrAndKey("buyer");

        usdc = new MockUSDC();
        factory = new StoreFactory(IERC20(address(usdc)), feeRecipient, FEE_BPS, CAP, platformOwner);

        vm.prank(creator);
        store = CreatorStore(factory.createStore("Creator Store", "CRTR"));

        usdc.mint(buyer, 10_000e6);
    }

    function _noPermit() internal pure returns (CreatorStore.Permit memory p) {}

    function _in(uint256 price, uint64 maxSupply, uint32 maxPerWallet, uint16 referralBps, string memory uri)
        internal
        pure
        returns (CreatorStore.ProductInput memory)
    {
        return CreatorStore.ProductInput({
            price: price, maxSupply: maxSupply, maxPerWallet: maxPerWallet, referralBps: referralBps, uri: uri
        });
    }

    function _addProduct(uint256 price, uint64 maxSupply, uint16 referralBps) internal returns (uint256 id) {
        vm.prank(creator);
        id = store.addProduct(_in(price, maxSupply, 0, referralBps, "ipfs://meta"));
    }

    function _approveReferrer(address r) internal {
        vm.prank(creator);
        store.setReferrer(r, true);
    }

    function _buy(address who, uint256 productId, address ref) internal returns (uint256 tokenId) {
        uint256 price = store.getProduct(productId).price;
        vm.startPrank(who);
        usdc.approve(address(store), price);
        tokenId = store.purchase(productId, price, ref, _noPermit());
        vm.stopPrank();
    }

    function _signVoucher(uint256 key, CreatorStore.Voucher memory v) internal view returns (bytes memory) {
        bytes32 digest = store.voucherDigest(v);
        (uint8 vv, bytes32 r, bytes32 s) = vm.sign(key, digest);
        return abi.encodePacked(r, s, vv);
    }

    function _permit(uint256 ownerKey, address owner, uint256 value, uint256 deadline)
        internal
        view
        returns (CreatorStore.Permit memory p)
    {
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                address(store),
                value,
                usdc.nonces(owner),
                deadline
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", usdc.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, digest);
        p = CreatorStore.Permit({value: value, deadline: deadline, v: v, r: r, s: s});
    }
}
