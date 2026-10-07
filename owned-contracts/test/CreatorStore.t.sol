// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {BaseTest} from "./Base.t.sol";
import {CreatorStore} from "../src/CreatorStore.sol";
import {MockSmartWallet} from "./mocks/MockSmartWallet.sol";

contract CreatorStoreTest is BaseTest {
    // ------------------------------------------------------------------
    // Catalog
    // ------------------------------------------------------------------

    function test_addProduct_assignsSequentialIds() public {
        assertEq(_addProduct(PRICE, 0, 0), 1);
        assertEq(_addProduct(PRICE, 0, 0), 2);
        assertEq(store.nextProductId(), 3);
        CreatorStore.ProductView memory p = store.getProduct(1);
        assertEq(p.price, PRICE);
        assertTrue(p.active);
        assertEq(p.uri, "ipfs://meta");
    }

    function test_addProduct_onlyOwner() public {
        vm.prank(stranger);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, stranger));
        store.addProduct(_in(PRICE, 0, 0, 0, "ipfs://x"));
    }

    function test_addProduct_validations() public {
        vm.startPrank(creator);
        vm.expectRevert(CreatorStore.EmptyUri.selector);
        store.addProduct(_in(PRICE, 0, 0, 0, ""));
        vm.expectRevert(CreatorStore.ReferralTooHigh.selector);
        store.addProduct(_in(PRICE, 0, 0, 5_001, "ipfs://x"));
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.PriceAboveCap.selector, CAP + 1, CAP));
        store.addProduct(_in(CAP + 1, 0, 0, 0, "ipfs://x"));
        store.addProduct(_in(CAP, 0, 0, 5_000, "ipfs://x")); // edges allowed
        vm.stopPrank();
    }

    function test_updateProduct_changesFuturePriceOnly() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        uint256 t1 = _buy(buyer, id, address(0));

        vm.prank(creator);
        store.updateProduct(id, _in(80e6, 0, 0, 0, "ipfs://v2"));

        assertEq(store.getProduct(id).price, 80e6);
        assertEq(store.tokenURI(t1), "ipfs://meta"); // receipts keep the metadata they were sold with
        uint256 before = usdc.balanceOf(buyer);
        _buy(buyer, id, address(0));
        assertEq(before - usdc.balanceOf(buyer), 80e6);
    }

    function test_updateProduct_unknownReverts() public {
        vm.prank(creator);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.UnknownProduct.selector, 7));
        store.updateProduct(7, _in(PRICE, 0, 0, 0, "ipfs://x"));
    }

    function test_updateProduct_maxSupplyCannotDropBelowSold() public {
        uint256 id = _addProduct(PRICE, 10, 0);
        _buy(buyer, id, address(0));
        _buy(buyer, id, address(0));
        vm.prank(creator);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.MaxSupplyBelowSold.selector, 1, 2));
        store.updateProduct(id, _in(PRICE, 1, 0, 0, "ipfs://x"));
        vm.prank(creator);
        store.updateProduct(id, _in(PRICE, 2, 0, 0, "ipfs://x")); // equal is fine, now sold out
        vm.startPrank(buyer);
        usdc.approve(address(store), PRICE);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.SoldOut.selector, id));
        store.purchase(id, PRICE, address(0), _noPermit());
        vm.stopPrank();
    }

    function test_setProductActive_blocksAndRestoresSales() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        vm.prank(creator);
        store.setProductActive(id, false);

        vm.startPrank(buyer);
        usdc.approve(address(store), PRICE);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.ProductInactive.selector, id));
        store.purchase(id, PRICE, address(0), _noPermit());
        vm.stopPrank();

        vm.prank(creator);
        store.setProductActive(id, true);
        _buy(buyer, id, address(0));
    }

    // ------------------------------------------------------------------
    // Purchases
    // ------------------------------------------------------------------

    function test_purchase_splitsAndMints() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        uint256 tokenId = _buy(buyer, id, address(0));

        assertEq(tokenId, 1);
        assertEq(store.ownerOf(tokenId), buyer);
        assertEq(store.productOf(tokenId), id);
        assertEq(store.tokenURI(tokenId), "ipfs://meta");
        assertEq(store.getProduct(id).sold, 1);

        uint256 fee = (PRICE * FEE_BPS) / 10_000; // $1.50
        assertEq(store.platformBalance(), fee);
        assertEq(store.creatorBalance(), PRICE - fee);
        assertEq(usdc.balanceOf(address(store)), PRICE);
    }

    function test_purchase_unknownProductReverts() public {
        vm.startPrank(buyer);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.UnknownProduct.selector, 0));
        store.purchase(0, PRICE, address(0), _noPermit());
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.UnknownProduct.selector, 1));
        store.purchase(1, PRICE, address(0), _noPermit());
        vm.stopPrank();
    }

    function test_purchase_maxPriceProtectsBuyer() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        vm.prank(buyer);
        usdc.approve(address(store), type(uint256).max);

        vm.prank(creator);
        store.updateProduct(id, _in(90e6, 0, 0, 0, "ipfs://x")); // price raised after buyer approved

        vm.prank(buyer);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.PriceAboveMax.selector, 90e6, PRICE));
        store.purchase(id, PRICE, address(0), _noPermit());
    }

    function test_purchase_respectsMaxSupply() public {
        uint256 id = _addProduct(PRICE, 1, 0);
        _buy(buyer, id, address(0));
        vm.startPrank(buyer);
        usdc.approve(address(store), PRICE);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.SoldOut.selector, id));
        store.purchase(id, PRICE, address(0), _noPermit());
        vm.stopPrank();
    }

    function test_purchase_insufficientAllowanceReverts() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        vm.startPrank(buyer);
        usdc.approve(address(store), PRICE - 1);
        vm.expectRevert(
            abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, address(store), PRICE - 1, PRICE)
        );
        store.purchase(id, PRICE, address(0), _noPermit());
        vm.stopPrank();
        assertEq(store.getProduct(id).sold, 0);
    }

    function test_purchase_freeProductNeedsNoFunds() public {
        uint256 id = _addProduct(0, 0, 0);
        vm.prank(stranger); // holds no USDC
        uint256 tokenId = store.purchase(id, 0, address(0), _noPermit());
        assertEq(store.ownerOf(tokenId), stranger);
        assertEq(store.creatorBalance(), 0);
        assertEq(store.platformBalance(), 0);
    }

    function test_purchase_withPermitInOneTransaction() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Permit memory p = _permit(buyerKey, buyer, PRICE, block.timestamp + 1 hours);
        assertEq(usdc.allowance(buyer, address(store)), 0);
        vm.prank(buyer);
        uint256 tokenId = store.purchase(id, PRICE, address(0), p);
        assertEq(store.ownerOf(tokenId), buyer);
    }

    function test_purchase_frontRunPermitStillSucceeds() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Permit memory p = _permit(buyerKey, buyer, PRICE, block.timestamp + 1 hours);
        // attacker submits the same permit first
        usdc.permit(buyer, address(store), p.value, p.deadline, p.v, p.r, p.s);
        vm.prank(buyer);
        store.purchase(id, PRICE, address(0), p);
        assertEq(store.balanceOf(buyer), 1);
    }

    function test_pause_blocksPurchasesButNotWithdrawals() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        _buy(buyer, id, address(0));

        vm.prank(creator);
        store.pause();

        vm.startPrank(buyer);
        usdc.approve(address(store), PRICE);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        store.purchase(id, PRICE, address(0), _noPermit());
        vm.stopPrank();

        vm.prank(creator);
        store.withdrawCreator(creator);
        vm.prank(feeRecipient);
        store.withdrawPlatform();

        vm.prank(stranger);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, stranger));
        store.unpause();
    }

    // ------------------------------------------------------------------
    // Referrals
    // ------------------------------------------------------------------

    function test_referral_paidWhenValid() public {
        uint256 id = _addProduct(PRICE, 0, 2_000); // 20%
        _approveReferrer(referrer);
        _buy(buyer, id, referrer);
        uint256 fee = (PRICE * FEE_BPS) / 10_000;
        uint256 ref = (PRICE * 2_000) / 10_000;
        assertEq(store.referralBalance(referrer), ref);
        assertEq(store.creatorBalance(), PRICE - fee - ref);

        vm.prank(referrer);
        store.withdrawReferral(referrer);
        assertEq(usdc.balanceOf(referrer), ref);
        assertEq(store.referralBalance(referrer), 0);
    }

    function test_referral_ignoredForSelfOwnerZeroOrDisabled() public {
        uint256 withRef = _addProduct(PRICE, 0, 2_000);
        uint256 noRef = _addProduct(PRICE, 0, 0);
        _approveReferrer(referrer);
        _approveReferrer(buyer); // approved, but still cannot refer their own purchase
        _buy(buyer, withRef, buyer); // self
        _buy(buyer, withRef, creator); // store owner, never approvable
        _buy(buyer, withRef, stranger); // not approved
        _buy(buyer, withRef, address(0)); // none
        _buy(buyer, noRef, referrer); // product pays no referrals
        assertEq(store.referralBalance(buyer), 0);
        assertEq(store.referralBalance(creator), 0);
        assertEq(store.referralBalance(referrer), 0);
        uint256 fee = (PRICE * FEE_BPS) / 10_000;
        assertEq(store.creatorBalance(), 5 * (PRICE - fee));
    }

    // ------------------------------------------------------------------
    // Vouchers
    // ------------------------------------------------------------------

    function _voucher(uint256 id, uint256 price, address who, uint256 nonce)
        internal
        view
        returns (CreatorStore.Voucher memory)
    {
        return CreatorStore.Voucher({
            productId: id, price: price, buyer: who, expiry: uint64(block.timestamp + 1 days), nonce: nonce
        });
    }

    function test_voucher_discountedPurchase() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Voucher memory v = _voucher(id, 40e6, address(0), 1);
        bytes memory sig = _signVoucher(creatorKey, v);

        vm.startPrank(buyer);
        usdc.approve(address(store), 40e6);
        uint256 before = usdc.balanceOf(buyer);
        store.purchaseWithVoucher(v, sig, _noPermit());
        vm.stopPrank();

        assertEq(before - usdc.balanceOf(buyer), 40e6);
        assertTrue(store.voucherNonceUsed(1));
        assertEq(store.platformBalance(), (uint256(40e6) * FEE_BPS) / 10_000);
    }

    function test_voucher_freeGift() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Voucher memory v = _voucher(id, 0, stranger, 2);
        bytes memory sig = _signVoucher(creatorKey, v);
        vm.prank(stranger);
        uint256 tokenId = store.purchaseWithVoucher(v, sig, _noPermit());
        assertEq(store.ownerOf(tokenId), stranger);
    }

    function test_voucher_cannotBeReused() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Voucher memory v = _voucher(id, 10e6, address(0), 3);
        bytes memory sig = _signVoucher(creatorKey, v);
        vm.startPrank(buyer);
        usdc.approve(address(store), 20e6);
        store.purchaseWithVoucher(v, sig, _noPermit());
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.VoucherUsed.selector, 3));
        store.purchaseWithVoucher(v, sig, _noPermit());
        vm.stopPrank();
    }

    function test_voucher_rejections() public {
        uint256 id = _addProduct(PRICE, 0, 0);

        // signed by someone other than the owner
        CreatorStore.Voucher memory v = _voucher(id, 10e6, address(0), 4);
        bytes memory bad = _signVoucher(buyerKey, v);
        vm.prank(buyer);
        vm.expectRevert(CreatorStore.VoucherInvalidSignature.selector);
        store.purchaseWithVoucher(v, bad, _noPermit());

        // tampered price
        bytes memory good = _signVoucher(creatorKey, v);
        v.price = 1;
        vm.prank(buyer);
        vm.expectRevert(CreatorStore.VoucherInvalidSignature.selector);
        store.purchaseWithVoucher(v, good, _noPermit());

        // wrong buyer
        CreatorStore.Voucher memory v2 = _voucher(id, 10e6, stranger, 5);
        bytes memory sig2 = _signVoucher(creatorKey, v2);
        vm.prank(buyer);
        vm.expectRevert(CreatorStore.VoucherWrongBuyer.selector);
        store.purchaseWithVoucher(v2, sig2, _noPermit());

        // expired
        CreatorStore.Voucher memory v3 = _voucher(id, 10e6, address(0), 6);
        bytes memory sig3 = _signVoucher(creatorKey, v3);
        vm.warp(block.timestamp + 2 days);
        vm.prank(buyer);
        vm.expectRevert(CreatorStore.VoucherExpired.selector);
        store.purchaseWithVoucher(v3, sig3, _noPermit());
    }

    function test_voucher_cannotExceedListPrice() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Voucher memory v = _voucher(id, PRICE + 1, address(0), 7);
        bytes memory sig = _signVoucher(creatorKey, v);
        vm.prank(buyer);
        vm.expectRevert(CreatorStore.VoucherAboveListPrice.selector);
        store.purchaseWithVoucher(v, sig, _noPermit());
    }

    function test_voucher_cancelled() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        CreatorStore.Voucher memory v = _voucher(id, 10e6, address(0), 8);
        bytes memory sig = _signVoucher(creatorKey, v);
        vm.prank(creator);
        store.cancelVoucher(8);
        vm.prank(buyer);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.VoucherUsed.selector, 8));
        store.purchaseWithVoucher(v, sig, _noPermit());
    }

    function test_voucher_smartWalletOwner() public {
        // creator moves the store to a smart wallet (ERC-1271), then signs as its signer
        MockSmartWallet wallet = new MockSmartWallet(creator);
        vm.prank(creator);
        store.transferOwnership(address(wallet));
        vm.prank(creator);
        wallet.execute(address(store), abi.encodeCall(store.acceptOwnership, ()));
        assertEq(store.owner(), address(wallet));

        vm.prank(creator);
        bytes memory ret = wallet.execute(
            address(store), abi.encodeCall(store.addProduct, (_in(PRICE, 0, 0, 0, "ipfs://sw")))
        );
        uint256 id = abi.decode(ret, (uint256));

        CreatorStore.Voucher memory v = _voucher(id, 5e6, address(0), 9);
        bytes memory sig = _signVoucher(creatorKey, v);
        vm.startPrank(buyer);
        usdc.approve(address(store), 5e6);
        store.purchaseWithVoucher(v, sig, _noPermit());
        vm.stopPrank();
        assertEq(store.balanceOf(buyer), 1);
    }

    // ------------------------------------------------------------------
    // Withdrawals and ownership
    // ------------------------------------------------------------------

    function test_withdrawCreator() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        _buy(buyer, id, address(0));
        uint256 owed = store.creatorBalance();

        address payout = makeAddr("payout");
        vm.prank(creator);
        store.withdrawCreator(payout);
        assertEq(usdc.balanceOf(payout), owed);
        assertEq(store.creatorBalance(), 0);

        vm.prank(creator);
        vm.expectRevert(CreatorStore.NothingToWithdraw.selector);
        store.withdrawCreator(payout);
        vm.prank(creator);
        vm.expectRevert(CreatorStore.ZeroAddress.selector);
        store.withdrawCreator(address(0));
    }

    function test_withdrawCreator_onlyOwner_platformCannotTouch() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        _buy(buyer, id, address(0));
        address[3] memory others = [feeRecipient, platformOwner, address(factory)];
        for (uint256 i; i < others.length; i++) {
            vm.prank(others[i]);
            vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, others[i]));
            store.withdrawCreator(others[i]);
        }
    }

    function test_withdrawPlatform_onlyFeeRecipient() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        _buy(buyer, id, address(0));
        vm.prank(creator);
        vm.expectRevert(CreatorStore.NotFeeRecipient.selector);
        store.withdrawPlatform();

        vm.prank(feeRecipient);
        store.withdrawPlatform();
        assertEq(usdc.balanceOf(feeRecipient), (PRICE * FEE_BPS) / 10_000);
    }

    function test_renounceDisabled() public {
        vm.prank(creator);
        vm.expectRevert(CreatorStore.RenounceDisabled.selector);
        store.renounceOwnership();
    }

    function test_ownershipTransferIsTwoStep() public {
        uint256 id = _addProduct(PRICE, 0, 0);
        _buy(buyer, id, address(0));
        address newOwner = makeAddr("newOwner");
        vm.prank(creator);
        store.transferOwnership(newOwner);
        assertEq(store.owner(), creator); // not yet

        vm.prank(newOwner);
        store.acceptOwnership();
        assertEq(store.owner(), newOwner);

        vm.prank(newOwner);
        store.withdrawCreator(newOwner);
        assertGt(usdc.balanceOf(newOwner), 0);
    }

    // ------------------------------------------------------------------
    // Fuzz
    // ------------------------------------------------------------------

    function testFuzz_split_sumsToPrice(uint256 price, uint16 referralBps) public {
        price = bound(price, 0, CAP);
        referralBps = uint16(bound(referralBps, 0, 5_000));
        uint256 id = _addProduct(price, 0, referralBps);
        _approveReferrer(referrer);

        vm.startPrank(buyer);
        usdc.approve(address(store), price);
        store.purchase(id, price, referrer, _noPermit());
        vm.stopPrank();

        uint256 fee = (price * FEE_BPS) / 10_000;
        uint256 ref = (price * referralBps) / 10_000;
        assertEq(store.platformBalance(), fee);
        assertEq(store.referralBalance(referrer), ref);
        assertEq(store.creatorBalance(), price - fee - ref);
        assertEq(store.platformBalance() + store.referralBalance(referrer) + store.creatorBalance(), price);
        assertEq(usdc.balanceOf(address(store)), price);
    }

    function testFuzz_onlyOwnerCanManage(address caller) public {
        vm.assume(caller != creator);
        uint256 id = _addProduct(PRICE, 0, 0);
        vm.startPrank(caller);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, caller));
        store.updateProduct(id, _in(1, 0, 0, 0, "ipfs://x"));
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, caller));
        store.setProductActive(id, false);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, caller));
        store.pause();
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, caller));
        store.cancelVoucher(1);
        vm.stopPrank();
    }
}
