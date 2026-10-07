// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseTest} from "../Base.t.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {StoreFactory} from "../../src/StoreFactory.sol";
import {CreatorStore} from "../../src/CreatorStore.sol";
import {MockUSDC} from "../mocks/MockUSDC.sol";

/// USDC-like token with a blacklist on from/to/msg.sender, as FiatTokenV2 does.
contract BlacklistUSDC is MockUSDC {
    mapping(address => bool) public blacklisted;
    function setBlacklisted(address a, bool b) external { blacklisted[a] = b; }
    function _update(address from, address to, uint256 v) internal override {
        require(!blacklisted[from] && !blacklisted[to] && !blacklisted[msg.sender], "Blacklistable: blacklisted");
        super._update(from, to, v);
    }
}

contract FakeFactory {
    function priceCap() external pure returns (uint256) { return type(uint256).max; }
}

contract ReviewTest is BaseTest {
    CreatorStore.Permit none;

    /// M-1a: buyer routes the referral cut to their own second address = permissionless discount.
    function test_review_selfReferralViaAltAddress_isDiscount() public {
        uint256 id = _addProduct(PRICE, 0, 5_000); // creator enables 50% referrals
        address buyerAlt = makeAddr("buyerAlt");
        uint256 before = usdc.balanceOf(buyer);
        _buy(buyer, id, buyerAlt);
        vm.prank(buyerAlt);
        store.withdrawReferral(buyer);
        uint256 netCost = before - usdc.balanceOf(buyer);
        assertEq(netCost, PRICE / 2, "buyer paid only half");
        assertEq(store.creatorBalance(), PRICE - PRICE * 300 / 10_000 - PRICE / 2);
    }

    /// M-1b: buyer burns the creator's share into an unclaimable address at zero extra cost.
    function test_review_referralToStoreItself_locksCreatorRevenue() public {
        uint256 id = _addProduct(PRICE, 0, 5_000);
        _buy(buyer, id, address(store));
        assertEq(store.referralBalance(address(store)), PRICE / 2, "half of sale stranded forever");
        // nobody can ever withdraw it: the store cannot call itself
    }

    /// M-1c: referral stacks on top of a creator-signed discount voucher.
    function test_review_referralStacksOnVoucher() public {
        uint256 id = _addProduct(PRICE, 0, 5_000);
        CreatorStore.Voucher memory v =
            CreatorStore.Voucher({productId: id, price: 20e6, buyer: buyer, expiry: uint64(block.timestamp + 1), nonce: 7});
        bytes memory sig = _signVoucher(creatorKey, v);
        address buyerAlt = makeAddr("buyerAlt2");
        vm.startPrank(buyer);
        usdc.approve(address(store), 20e6);
        store.purchaseWithVoucher(v, sig, buyerAlt, none);
        vm.stopPrank();
        assertEq(store.referralBalance(buyerAlt), 10e6);
        assertEq(store.creatorBalance(), 20e6 - 0.6e6 - 10e6); // creator nets 9.4 on a 20 voucher
    }

    /// M-2: blacklisted (or lost-key) fee recipient strands platform fees in every store, with no rotation path.
    function test_review_blacklistedFeeRecipient_platformFeesStranded() public {
        BlacklistUSDC b = new BlacklistUSDC();
        StoreFactory f = new StoreFactory(IERC20(address(b)), feeRecipient, FEE_BPS, CAP, platformOwner);
        vm.prank(creator);
        CreatorStore s = CreatorStore(f.createStore("S", "S"));
        vm.prank(creator);
        uint256 id = s.addProduct(PRICE, 0, 0, "ipfs://x");
        b.mint(buyer, PRICE);
        vm.startPrank(buyer);
        b.approve(address(s), PRICE);
        s.purchase(id, PRICE, address(0), none);
        vm.stopPrank();

        b.setBlacklisted(feeRecipient, true);
        // purchases still work (good: fee is pulled, not pushed)
        b.mint(buyer, PRICE);
        vm.startPrank(buyer);
        b.approve(address(s), PRICE);
        s.purchase(id, PRICE, address(0), none);
        vm.stopPrank();
        // creator still withdraws (good)
        vm.prank(creator);
        s.withdrawCreator(creator);
        // platform cannot: transfer target is hardcoded to feeRecipient
        vm.prank(feeRecipient);
        vm.expectRevert(bytes("Blacklistable: blacklisted"));
        s.withdrawPlatform();
        assertEq(s.platformBalance(), 2 * PRICE * FEE_BPS / 10_000);
    }

    /// L: updateProduct rewrites tokenURI of receipts already sold.
    function test_review_updateProduct_rewritesExistingReceiptURI() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        uint256 tokenId = _buy(buyer, id, address(0));
        assertEq(store.tokenURI(tokenId), "ipfs://meta");
        vm.prank(creator);
        store.updateProduct(id, PRICE, 0, 0, "ipfs://something-else");
        assertEq(store.tokenURI(tokenId), "ipfs://something-else");
    }

    /// L: free limited product can be fully drained by one address in one block.
    function test_review_freeLimitedProduct_singleWalletDrainsSupply() public {
        uint256 id = _addProduct(0, 100, 0);
        vm.startPrank(stranger);
        for (uint256 i; i < 100; i++) store.purchase(id, 0, address(0), none);
        vm.stopPrank();
        assertEq(store.balanceOf(stranger), 100);
        vm.prank(buyer);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.SoldOut.selector, id));
        store.purchase(id, 0, address(0), none);
    }

    /// L: vouchers signed by an earlier owner revive if ownership returns to that key.
    function test_review_voucherRevivesWhenOwnershipReturns() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Voucher memory v =
            CreatorStore.Voucher({productId: id, price: 0, buyer: address(0), expiry: uint64(block.timestamp + 365 days), nonce: 1});
        bytes memory sig = _signVoucher(creatorKey, v);
        address other = makeAddr("other");
        vm.prank(creator); store.transferOwnership(other);
        vm.prank(other); store.acceptOwnership();
        vm.prank(stranger);
        vm.expectRevert(CreatorStore.VoucherInvalidSignature.selector);
        store.purchaseWithVoucher(v, sig, address(0), none);
        vm.prank(other); store.transferOwnership(creator);
        vm.prank(creator); store.acceptOwnership();
        vm.prank(stranger);
        store.purchaseWithVoucher(v, sig, address(0), none); // old voucher works again
    }

    /// I: anyone can clone the implementation with a fake factory (no cap, 0% fee) and emit identical events.
    function test_review_spoofStoreFromImplementation() public {
        FakeFactory ff = new FakeFactory();
        address spoof = Clones.clone(factory.implementation());
        vm.prank(address(ff));
        CreatorStore(spoof).initialize(stranger, IERC20(address(usdc)), stranger, 0, "Fake", "F");
        vm.prank(stranger);
        CreatorStore(spoof).addProduct(1_000_000e6, 0, 0, "ipfs://fake"); // above real cap
        assertFalse(factory.isStore(spoof));
        assertEq(CreatorStore(spoof).feeBps(), 0);
    }

    /// I: unsolicited USDC sent to a store is unrecoverable.
    function test_review_unsolicitedUSDC_stuck() public {
        usdc.mint(address(store), 1e6);
        assertEq(store.creatorBalance() + store.platformBalance(), 0);
        // no sweep function exists
    }

    /// Sanity: fee + max referral never exceed price, fuzzed at the edges.
    function testFuzz_review_splitNeverExceedsPrice(uint256 price, uint16 fee, uint16 ref) public pure {
        price = bound(price, 0, type(uint256).max / 10_000);
        fee = uint16(bound(fee, 0, 1_000));
        ref = uint16(bound(ref, 0, 5_000));
        uint256 a = price * fee / 10_000;
        uint256 r = price * ref / 10_000;
        assertLe(a + r, price);
    }
}
