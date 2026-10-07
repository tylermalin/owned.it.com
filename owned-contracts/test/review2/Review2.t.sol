// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseTest} from "../Base.t.sol";
import {StoreFactory} from "../../src/StoreFactory.sol";
import {CreatorStore} from "../../src/CreatorStore.sol";
import {MockSmartWallet} from "../mocks/MockSmartWallet.sol";

/// Second independent review. M-1 and L-2 are now regression tests; the rest confirm properties hold.
contract Review2Test is BaseTest {
    CreatorStore.Permit none;

    function _accruePlatform() internal returns (uint256 fee) {
        uint256 id = _addProduct(PRICE, 0, 0);
        _buy(buyer, id, address(0));
        fee = (PRICE * FEE_BPS) / 10_000;
    }

    /// M-1 fixed: a compromised fee-recipient key has no rotation power, so the owner's
    /// recovery always completes and later fees go to the new address.
    function test_fix_M1_ownerRecoversFromCompromisedRecipient() public {
        _accruePlatform();
        address safe = makeAddr("safe");
        address attacker = feeRecipient; // key compromised

        vm.prank(attacker);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", attacker));
        factory.proposeFeeRecipient(attacker);

        vm.prank(platformOwner);
        factory.proposeFeeRecipient(safe);
        vm.prank(safe);
        factory.acceptFeeRecipient();
        assertEq(factory.feeRecipient(), safe);

        vm.prank(attacker);
        vm.expectRevert(CreatorStore.NotFeeRecipient.selector);
        store.withdrawPlatform();
        vm.prank(safe);
        store.withdrawPlatform();
    }

    /// L-2 fixed: the factory cannot be renounced.
    function test_fix_L2_factoryRenounceDisabled() public {
        vm.prank(platformOwner);
        vm.expectRevert(StoreFactory.RenounceDisabled.selector);
        factory.renounceOwnership();
    }

    /// L-1 (intended, documented): the factory owner can rotate the fee recipient. It only ever
    /// redirects platform money, never creator or referral balances.
    function test_ownerRotationOnlyMovesPlatformMoney() public {
        uint256 id = _addProduct(PRICE, 0, 2_000);
        _approveReferrer(referrer);
        _buy(buyer, id, referrer);
        uint256 creatorOwed = store.creatorBalance();
        uint256 refOwed = store.referralBalance(referrer);
        vm.prank(platformOwner);
        factory.proposeFeeRecipient(platformOwner);
        vm.prank(platformOwner);
        factory.acceptFeeRecipient();
        assertEq(store.feeRecipient(), platformOwner);
        assertEq(store.creatorBalance(), creatorOwed);
        assertEq(store.referralBalance(referrer), refOwed);
        vm.prank(platformOwner);
        vm.expectRevert();
        store.withdrawCreator(platformOwner);
    }

    /// Confirms: URI A -> B -> A creates a new version (3) and old receipts stay frozen.
    function test_ok_uriABA_versionsMonotonic() public {
        uint256 id = _addProduct(PRICE, 0, 0); // v1 = ipfs://meta
        uint256 t1 = _buy(buyer, id, address(0));
        vm.prank(creator);
        store.updateProduct(id, _in(PRICE, 0, 0, 0, "ipfs://B"));
        uint256 t2 = _buy(buyer, id, address(0));
        vm.prank(creator);
        store.updateProduct(id, _in(PRICE, 0, 0, 0, "ipfs://meta"));
        uint256 t3 = _buy(buyer, id, address(0));
        assertEq(store.getProduct(id).version, 3);
        assertEq(store.tokenURI(t1), "ipfs://meta");
        assertEq(store.tokenURI(t2), "ipfs://B");
        assertEq(store.tokenURI(t3), "ipfs://meta");
    }

    /// Confirms: a 1271 wallet owning two stores cannot have a voucher replayed across them.
    function test_ok_1271VoucherNotReplayableAcrossStores() public {
        MockSmartWallet w = new MockSmartWallet(creator);
        vm.prank(address(w));
        CreatorStore a = CreatorStore(factory.createStore("A", "A"));
        vm.prank(address(w));
        CreatorStore b = CreatorStore(factory.createStore("B", "B"));
        vm.startPrank(address(w));
        uint256 ida = a.addProduct(_in(PRICE, 0, 0, 0, "ipfs://a"));
        uint256 idb = b.addProduct(_in(PRICE, 0, 0, 0, "ipfs://b"));
        vm.stopPrank();
        assertEq(ida, idb);
        CreatorStore.Voucher memory v = CreatorStore.Voucher({
            productId: ida, price: 0, buyer: address(0), expiry: uint64(block.timestamp + 1 days), nonce: 1
        });
        (uint8 vv, bytes32 r, bytes32 s) = vm.sign(creatorKey, a.voucherDigest(v));
        bytes memory sig = abi.encodePacked(r, s, vv);
        vm.prank(stranger);
        vm.expectRevert(CreatorStore.VoucherInvalidSignature.selector);
        b.purchaseWithVoucher(v, sig, none);
        vm.prank(stranger);
        a.purchaseWithVoucher(v, sig, none);
        assertEq(a.balanceOf(stranger), 1);
    }

    /// Confirms: a cancelled voucher cannot be redeemed, and vouchers stay valid while a
    /// transfer is merely pending (epoch bumps only on accept).
    function test_ok_cancelAndPendingTransfer() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Voucher memory v = CreatorStore.Voucher({
            productId: id, price: 0, buyer: address(0), expiry: uint64(block.timestamp + 1 days), nonce: 9
        });
        bytes memory sig = _signVoucher(creatorKey, v);
        vm.prank(creator);
        store.transferOwnership(stranger); // pending only
        vm.prank(buyer);
        store.purchaseWithVoucher(v, sig, none); // still valid in this epoch

        v.nonce = 10;
        sig = _signVoucher(creatorKey, v);
        vm.prank(creator);
        store.cancelVoucher(10);
        vm.prank(buyer);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.VoucherUsed.selector, 10));
        store.purchaseWithVoucher(v, sig, none);
    }

    /// Confirms: the implementation cannot be initialized and a clone cannot be re-initialized.
    function test_ok_initializers() public {
        CreatorStore impl = CreatorStore(factory.implementation());
        vm.expectRevert();
        impl.initialize(stranger, usdc, 0, "x", "x");
        vm.expectRevert();
        store.initialize(stranger, usdc, 0, "x", "x");
    }
}
