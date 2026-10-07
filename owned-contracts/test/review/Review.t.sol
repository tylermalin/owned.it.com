// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseTest} from "../Base.t.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {StoreFactory} from "../../src/StoreFactory.sol";
import {CreatorStore} from "../../src/CreatorStore.sol";
import {MockUSDC} from "../mocks/MockUSDC.sol";

/// USDC-like token with a blacklist on from/to/msg.sender, as FiatTokenV2 does.
contract BlacklistUSDC is MockUSDC {
    mapping(address => bool) public blacklisted;

    function setBlacklisted(address a, bool b) external {
        blacklisted[a] = b;
    }

    function _update(address from, address to, uint256 v) internal override {
        require(!blacklisted[from] && !blacklisted[to] && !blacklisted[msg.sender], "Blacklistable: blacklisted");
        super._update(from, to, v);
    }
}

contract FakeFactory {
    function priceCap() external pure returns (uint256) {
        return type(uint256).max;
    }

    function feeRecipient() external view returns (address) {
        return address(this);
    }
}

contract OtherToken is ERC20 {
    constructor() ERC20("Other", "OTH") {
        _mint(msg.sender, 1_000e18);
    }
}

/// Regression tests for the first review. Each test reproduces the original attack
/// and asserts the fix holds.
contract ReviewTest is BaseTest {
    CreatorStore.Permit none;

    /// M-1a fixed: an unapproved address (the buyer's alt wallet) earns nothing.
    function test_fix_selfReferralViaAltAddress_paysNothing() public {
        uint256 id = _addProduct(PRICE, 0, 5_000);
        address buyerAlt = makeAddr("buyerAlt");
        uint256 before = usdc.balanceOf(buyer);
        _buy(buyer, id, buyerAlt);
        assertEq(store.referralBalance(buyerAlt), 0);
        assertEq(before - usdc.balanceOf(buyer), PRICE, "buyer pays full price");
        assertEq(store.creatorBalance(), PRICE - (PRICE * FEE_BPS) / 10_000);
    }

    /// M-1a residual: an approved referrer still cannot refer their own purchase.
    function test_fix_approvedReferrerCannotSelfRefer() public {
        uint256 id = _addProduct(PRICE, 0, 5_000);
        _approveReferrer(buyer);
        _buy(buyer, id, buyer);
        assertEq(store.referralBalance(buyer), 0);
    }

    /// M-1b fixed: the store itself (and zero, and the owner) can never be approved as a referrer.
    function test_fix_cannotApproveStoreOwnerOrZero() public {
        vm.startPrank(creator);
        vm.expectRevert(CreatorStore.InvalidReferrer.selector);
        store.setReferrer(address(store), true);
        vm.expectRevert(CreatorStore.InvalidReferrer.selector);
        store.setReferrer(creator, true);
        vm.expectRevert(CreatorStore.InvalidReferrer.selector);
        store.setReferrer(address(0), true);
        vm.stopPrank();

        uint256 id = _addProduct(PRICE, 0, 5_000);
        _buy(buyer, id, address(store));
        assertEq(store.referralBalance(address(store)), 0);
        assertEq(store.totalReferralOwed(), 0);
    }

    /// M-1c fixed: voucher purchases never pay a referral share.
    function test_fix_voucherPaysNoReferral() public {
        uint256 id = _addProduct(PRICE, 0, 5_000);
        _approveReferrer(referrer);
        CreatorStore.Voucher memory v = CreatorStore.Voucher({
            productId: id, price: 20e6, buyer: buyer, expiry: uint64(block.timestamp + 1), nonce: 7
        });
        bytes memory sig = _signVoucher(creatorKey, v);
        vm.startPrank(buyer);
        usdc.approve(address(store), 20e6);
        store.purchaseWithVoucher(v, sig, none);
        vm.stopPrank();
        assertEq(store.totalReferralOwed(), 0);
        assertEq(store.creatorBalance(), 20e6 - (uint256(20e6) * FEE_BPS) / 10_000);
    }

    /// Referrer approval can be revoked; later sales stop paying them.
    function test_fix_revokedReferrerStopsEarning() public {
        uint256 id = _addProduct(PRICE, 0, 2_000);
        _approveReferrer(referrer);
        _buy(buyer, id, referrer);
        uint256 earned = store.referralBalance(referrer);
        assertGt(earned, 0);
        vm.prank(creator);
        store.setReferrer(referrer, false);
        _buy(buyer, id, referrer);
        assertEq(store.referralBalance(referrer), earned);
        // already-earned balance stays withdrawable
        vm.prank(referrer);
        store.withdrawReferral(referrer);
        assertEq(usdc.balanceOf(referrer), earned);
    }

    /// M-2 fixed: a blacklisted fee recipient is rotated in the factory; every store pays the new one.
    function test_fix_blacklistedFeeRecipient_rotatesAndRecovers() public {
        BlacklistUSDC b = new BlacklistUSDC();
        StoreFactory f = new StoreFactory(IERC20(address(b)), feeRecipient, FEE_BPS, CAP, platformOwner);
        vm.prank(creator);
        CreatorStore s = CreatorStore(f.createStore("S", "S"));
        vm.prank(creator);
        uint256 id = s.addProduct(_in(PRICE, 0, 0, 0, "ipfs://x"));
        b.mint(buyer, PRICE);
        vm.startPrank(buyer);
        b.approve(address(s), PRICE);
        s.purchase(id, PRICE, address(0), none);
        vm.stopPrank();

        b.setBlacklisted(feeRecipient, true);
        vm.prank(feeRecipient);
        vm.expectRevert(bytes("Blacklistable: blacklisted"));
        s.withdrawPlatform();

        address safe2 = makeAddr("safe2");
        vm.prank(feeRecipient); // the blacklisted recipient can still propose its successor
        f.proposeFeeRecipient(safe2);
        vm.prank(safe2);
        f.acceptFeeRecipient();
        assertEq(s.feeRecipient(), safe2);

        vm.prank(feeRecipient);
        vm.expectRevert(CreatorStore.NotFeeRecipient.selector);
        s.withdrawPlatform();

        vm.prank(safe2);
        s.withdrawPlatform();
        assertEq(b.balanceOf(safe2), (PRICE * FEE_BPS) / 10_000);
    }

    /// M-2: a lost recipient key is recoverable by the factory owner; strangers cannot propose.
    function test_fix_feeRecipientRotationAccessControl() public {
        address next = makeAddr("next");
        vm.prank(stranger);
        vm.expectRevert(StoreFactory.NotAuthorized.selector);
        factory.proposeFeeRecipient(next);

        vm.prank(platformOwner);
        factory.proposeFeeRecipient(next);
        vm.prank(stranger);
        vm.expectRevert(StoreFactory.NotAuthorized.selector);
        factory.acceptFeeRecipient();
        assertEq(factory.feeRecipient(), feeRecipient); // unchanged until accepted

        vm.prank(next);
        factory.acceptFeeRecipient();
        assertEq(factory.feeRecipient(), next);
        assertEq(factory.pendingFeeRecipient(), address(0));
    }

    /// L fixed: receipts keep the metadata version they were sold under.
    function test_fix_receiptsKeepTheirMetadata() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        uint256 t1 = _buy(buyer, id, address(0));
        vm.prank(creator);
        store.updateProduct(id, _in(PRICE, 0, 0, 0, "ipfs://v2"));
        uint256 t2 = _buy(buyer, id, address(0));
        assertEq(store.tokenURI(t1), "ipfs://meta");
        assertEq(store.tokenURI(t2), "ipfs://v2");
        assertEq(store.getProduct(id).version, 2);

        // a price-only update does not create a new version
        vm.prank(creator);
        store.updateProduct(id, _in(PRICE + 1, 0, 0, 0, "ipfs://v2"));
        assertEq(store.getProduct(id).version, 2);
    }

    /// L fixed: a per-wallet limit stops one address from draining a free limited product.
    function test_fix_perWalletLimit() public {
        vm.prank(creator);
        uint256 id = store.addProduct(_in(0, 100, 2, 0, "ipfs://free"));
        vm.startPrank(stranger);
        store.purchase(id, 0, address(0), none);
        store.purchase(id, 0, address(0), none);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.WalletLimitReached.selector, id));
        store.purchase(id, 0, address(0), none);
        vm.stopPrank();
        vm.prank(buyer);
        store.purchase(id, 0, address(0), none); // others can still claim
        assertEq(store.getProduct(id).sold, 3);
    }

    /// L fixed: vouchers die when ownership changes, even if it later returns to the same key.
    function test_fix_voucherDoesNotReviveWhenOwnershipReturns() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Voucher memory v = CreatorStore.Voucher({
            productId: id, price: 0, buyer: address(0), expiry: uint64(block.timestamp + 365 days), nonce: 1
        });
        bytes memory sig = _signVoucher(creatorKey, v);
        address other = makeAddr("other");
        vm.prank(creator);
        store.transferOwnership(other);
        vm.prank(other);
        store.acceptOwnership();
        vm.prank(other);
        store.transferOwnership(creator);
        vm.prank(creator);
        store.acceptOwnership();

        vm.prank(stranger);
        vm.expectRevert(CreatorStore.VoucherInvalidSignature.selector);
        store.purchaseWithVoucher(v, sig, none);

        // a fresh voucher signed in the new epoch works
        bytes memory fresh = _signVoucher(creatorKey, v);
        vm.prank(stranger);
        store.purchaseWithVoucher(v, fresh, none);
        assertEq(store.balanceOf(stranger), 1);
    }

    /// I (documented, not preventable): spoofed clones exist but are never `isStore`.
    function test_spoofedCloneIsNotAStore() public {
        FakeFactory ff = new FakeFactory();
        address spoof = Clones.clone(factory.implementation());
        vm.prank(address(ff));
        CreatorStore(spoof).initialize(stranger, IERC20(address(usdc)), 0, "Fake", "F");
        assertFalse(factory.isStore(spoof));
        assertTrue(factory.isStore(address(store)));
    }

    /// I fixed: unsolicited USDC is sweepable by the creator, and never touches owed balances.
    function test_fix_sweepExcessUsdc() public {
        uint256 id = _addProduct(PRICE, 0, 2_000);
        _approveReferrer(referrer);
        _buy(buyer, id, referrer);
        usdc.mint(address(store), 7e6);
        assertEq(store.excessUsdc(), 7e6);

        vm.prank(stranger);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, stranger));
        store.sweepExcess(stranger);

        address dest = makeAddr("dest");
        vm.prank(creator);
        store.sweepExcess(dest);
        assertEq(usdc.balanceOf(dest), 7e6);
        assertEq(store.excessUsdc(), 0);
        assertEq(
            usdc.balanceOf(address(store)), store.creatorBalance() + store.platformBalance() + store.totalReferralOwed()
        );

        vm.prank(creator);
        vm.expectRevert(CreatorStore.NothingToWithdraw.selector);
        store.sweepExcess(dest);
    }

    function test_fix_rescueOtherTokens() public {
        OtherToken t = new OtherToken();
        t.transfer(address(store), 5e18);
        vm.startPrank(creator);
        vm.expectRevert(CreatorStore.UseSweepForUsdc.selector);
        store.rescueToken(IERC20(address(usdc)), creator);
        store.rescueToken(IERC20(address(t)), creator);
        vm.stopPrank();
        assertEq(t.balanceOf(creator), 5e18);
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
