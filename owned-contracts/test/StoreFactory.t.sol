// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {BaseTest} from "./Base.t.sol";
import {StoreFactory} from "../src/StoreFactory.sol";
import {CreatorStore} from "../src/CreatorStore.sol";

contract StoreFactoryTest is BaseTest {
    function test_constructor_setsConfig() public view {
        assertEq(address(factory.usdc()), address(usdc));
        assertEq(factory.feeRecipient(), feeRecipient);
        assertEq(factory.feeBps(), FEE_BPS);
        assertEq(factory.priceCap(), CAP);
        assertEq(factory.owner(), platformOwner);
        assertTrue(factory.implementation() != address(0));
    }

    function test_constructor_rejectsZeroAddresses() public {
        vm.expectRevert(StoreFactory.ZeroAddress.selector);
        new StoreFactory(IERC20(address(0)), feeRecipient, FEE_BPS, CAP, platformOwner);
        vm.expectRevert(StoreFactory.ZeroAddress.selector);
        new StoreFactory(IERC20(address(usdc)), address(0), FEE_BPS, CAP, platformOwner);
    }

    function test_constructor_rejectsFeeAboveTenPercent() public {
        vm.expectRevert(StoreFactory.FeeTooHigh.selector);
        new StoreFactory(IERC20(address(usdc)), feeRecipient, 1_001, CAP, platformOwner);
    }

    function test_createStore_callerOwnsInitializedStore() public view {
        assertEq(store.owner(), creator);
        assertEq(store.name(), "Creator Store");
        assertEq(store.symbol(), "CRTR");
        assertEq(address(store.usdc()), address(usdc));
        assertEq(store.feeRecipient(), feeRecipient);
        assertEq(store.feeBps(), FEE_BPS);
        assertEq(store.factory(), address(factory));
        assertEq(store.nextProductId(), 1);
        assertEq(store.nextTokenId(), 1);
        assertTrue(factory.isStore(address(store)));
    }

    function test_createStore_emitsEvent() public {
        vm.recordLogs();
        vm.prank(stranger);
        address s = factory.createStore("Other", "OTH");
        assertTrue(factory.isStore(s));
        assertEq(CreatorStore(s).owner(), stranger);
    }

    function test_createStore_storesAreIndependent() public {
        vm.prank(stranger);
        CreatorStore other = CreatorStore(factory.createStore("Other", "OTH"));
        assertTrue(address(other) != address(store));
        uint256 id = _addProduct(PRICE, 0, 0);
        _buy(buyer, id, address(0));
        assertEq(other.creatorBalance(), 0);
        assertGt(store.creatorBalance(), 0);
    }

    function test_clone_cannotBeReinitialized() public {
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        store.initialize(stranger, usdc, 0, "x", "x");
    }

    function test_implementation_cannotBeInitialized() public {
        CreatorStore impl = CreatorStore(factory.implementation());
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        impl.initialize(stranger, usdc, 0, "x", "x");
    }

    function test_raisePriceCap_onlyOwner() public {
        vm.prank(stranger);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, stranger));
        factory.raisePriceCap(CAP + 1);
    }

    function test_raisePriceCap_onlyUp() public {
        vm.startPrank(platformOwner);
        vm.expectRevert(abi.encodeWithSelector(StoreFactory.CapNotHigher.selector, CAP, CAP));
        factory.raisePriceCap(CAP);
        vm.expectRevert(abi.encodeWithSelector(StoreFactory.CapNotHigher.selector, CAP, CAP - 1));
        factory.raisePriceCap(CAP - 1);
        factory.raisePriceCap(type(uint256).max);
        vm.stopPrank();
        assertEq(factory.priceCap(), type(uint256).max);
    }

    function test_raisePriceCap_appliesToExistingStores() public {
        vm.prank(creator);
        vm.expectRevert(abi.encodeWithSelector(CreatorStore.PriceAboveCap.selector, CAP + 1, CAP));
        store.addProduct(_in(CAP + 1, 0, 0, 0, "ipfs://x"));

        vm.prank(platformOwner);
        factory.raisePriceCap(1_000e6);

        vm.prank(creator);
        store.addProduct(_in(CAP + 1, 0, 0, 0, "ipfs://x"));
    }
}
