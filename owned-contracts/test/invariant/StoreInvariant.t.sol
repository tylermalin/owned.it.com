// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {StoreFactory} from "../../src/StoreFactory.sol";
import {CreatorStore} from "../../src/CreatorStore.sol";
import {MockUSDC} from "../mocks/MockUSDC.sol";

/// @dev Drives random catalog changes, purchases and withdrawals against one store.
contract StoreHandler is Test {
    CreatorStore public store;
    MockUSDC public usdc;
    address public creator;
    address public feeRecipient;

    address[] public actors;
    uint256 public totalPaid;
    uint256 public totalWithdrawn;
    uint256 public mintedCount;
    uint256 public totalDonated;
    uint256 public totalSwept;

    constructor(CreatorStore store_, MockUSDC usdc_, address creator_, address feeRecipient_) {
        store = store_;
        usdc = usdc_;
        creator = creator_;
        feeRecipient = feeRecipient_;
        for (uint256 i; i < 4; i++) {
            address a = makeAddr(string(abi.encodePacked("actor", vm.toString(i))));
            actors.push(a);
            usdc_.mint(a, 1_000_000e6);
            if (i % 2 == 0) {
                vm.prank(creator_);
                store_.setReferrer(a, true); // half the actors are approved referrers
            }
        }
    }

    function actorCount() external view returns (uint256) {
        return actors.length;
    }

    function addProduct(uint256 price, uint64 maxSupply, uint32 maxPerWallet, uint16 referralBps) external {
        price = bound(price, 0, 500e6);
        maxSupply = uint64(bound(maxSupply, 0, 20));
        maxPerWallet = uint32(bound(maxPerWallet, 0, 5));
        referralBps = uint16(bound(referralBps, 0, 5_000));
        vm.prank(creator);
        store.addProduct(
            CreatorStore.ProductInput({
                price: price, maxSupply: maxSupply, maxPerWallet: maxPerWallet, referralBps: referralBps, uri: "ipfs://h"
            })
        );
    }

    /// Unsolicited USDC sent straight to the store, then swept by the creator.
    function donateAndSweep(uint256 amount, bool sweep) external {
        amount = bound(amount, 1, 1_000e6);
        usdc.mint(address(store), amount);
        totalDonated += amount;
        if (sweep) {
            uint256 ex = store.excessUsdc();
            vm.prank(creator);
            store.sweepExcess(creator);
            totalSwept += ex;
        }
    }

    function updateProduct(uint256 idSeed, uint256 price, uint16 referralBps) external {
        uint256 n = store.nextProductId();
        if (n == 1) return;
        uint256 id = bound(idSeed, 1, n - 1);
        CreatorStore.ProductView memory p = store.getProduct(id);
        price = bound(price, 0, 500e6);
        referralBps = uint16(bound(referralBps, 0, 5_000));
        vm.prank(creator);
        store.updateProduct(
            id,
            CreatorStore.ProductInput({
                price: price, maxSupply: p.maxSupply, maxPerWallet: p.maxPerWallet, referralBps: referralBps, uri: "ipfs://h2"
            })
        );
    }

    function toggle(uint256 idSeed, bool active) external {
        uint256 n = store.nextProductId();
        if (n == 1) return;
        vm.prank(creator);
        store.setProductActive(bound(idSeed, 1, n - 1), active);
    }

    function purchase(uint256 actorSeed, uint256 idSeed, uint256 refSeed) external {
        uint256 n = store.nextProductId();
        if (n == 1) return;
        uint256 id = bound(idSeed, 1, n - 1);
        address buyer = actors[bound(actorSeed, 0, actors.length - 1)];
        address ref = actors[bound(refSeed, 0, actors.length - 1)];
        CreatorStore.ProductView memory p = store.getProduct(id);
        if (!p.active || (p.maxSupply != 0 && p.sold >= p.maxSupply)) return;
        if (p.maxPerWallet != 0 && store.purchasedBy(id, buyer) >= p.maxPerWallet) return;

        vm.startPrank(buyer);
        usdc.approve(address(store), p.price);
        CreatorStore.Permit memory none;
        store.purchase(id, p.price, ref, none);
        vm.stopPrank();
        totalPaid += p.price;
        mintedCount++;
    }

    function withdrawCreator() external {
        uint256 amt = store.creatorBalance();
        if (amt == 0) return;
        vm.prank(creator);
        store.withdrawCreator(creator);
        totalWithdrawn += amt;
    }

    function withdrawPlatform() external {
        uint256 amt = store.platformBalance();
        if (amt == 0) return;
        vm.prank(feeRecipient);
        store.withdrawPlatform();
        totalWithdrawn += amt;
    }

    function withdrawReferral(uint256 actorSeed) external {
        address a = actors[bound(actorSeed, 0, actors.length - 1)];
        uint256 amt = store.referralBalance(a);
        if (amt == 0) return;
        vm.prank(a);
        store.withdrawReferral(a);
        totalWithdrawn += amt;
    }
}

contract StoreInvariantTest is Test {
    MockUSDC usdc;
    StoreFactory factory;
    CreatorStore store;
    StoreHandler handler;
    address creator = makeAddr("creator");
    address feeRecipient = makeAddr("feeRecipient");

    function setUp() public {
        usdc = new MockUSDC();
        factory = new StoreFactory(IERC20(address(usdc)), feeRecipient, 300, 500e6, address(this));
        vm.prank(creator);
        store = CreatorStore(factory.createStore("S", "S"));
        handler = new StoreHandler(store, usdc, creator, feeRecipient);
        targetContract(address(handler));
    }

    function _owedTotal() internal view returns (uint256 owed) {
        owed = store.creatorBalance() + store.platformBalance();
        for (uint256 i; i < handler.actorCount(); i++) {
            owed += store.referralBalance(handler.actors(i));
        }
    }

    /// The running referral total always equals the sum of individual referral balances.
    function invariant_referralTotalMatches() public view {
        uint256 sum;
        for (uint256 i; i < handler.actorCount(); i++) sum += store.referralBalance(handler.actors(i));
        assertEq(store.totalReferralOwed(), sum);
    }

    /// Holdings always cover what is owed, and any surplus is exactly the unswept donations.
    function invariant_balancesMatchHoldings() public view {
        assertEq(usdc.balanceOf(address(store)), _owedTotal() + store.excessUsdc());
        assertEq(store.excessUsdc(), handler.totalDonated() - handler.totalSwept());
    }

    /// Money in equals money held plus money paid out.
    function invariant_conservation() public view {
        assertEq(
            handler.totalPaid() + handler.totalDonated(),
            usdc.balanceOf(address(store)) + handler.totalWithdrawn() + handler.totalSwept()
        );
    }

    /// One receipt per purchase, ids strictly sequential.
    function invariant_receiptsMatchPurchases() public view {
        assertEq(store.nextTokenId() - 1, handler.mintedCount());
    }

    /// The fee is fixed for life.
    function invariant_feeImmutable() public view {
        assertEq(store.feeBps(), 300);
        assertEq(store.feeRecipient(), feeRecipient);
        assertEq(store.owner(), creator);
    }
}
