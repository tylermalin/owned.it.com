// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable, Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CreatorStore} from "./CreatorStore.sol";

/// @title StoreFactory
/// @notice Deploys one CreatorStore clone per call. The caller owns the new store.
///         USDC, fee recipient and fee are fixed for every store this factory creates.
/// @dev    The factory owner has exactly one power: raising the per-product price cap.
///         It can never lower the cap, change fees, or touch any store's funds.
contract StoreFactory is Ownable2Step {
    address public immutable implementation;
    IERC20 public immutable usdc;
    address public immutable feeRecipient;
    uint16 public immutable feeBps;

    /// @notice Highest price a product may list at, in USDC base units. Only ever increases.
    uint256 public priceCap;

    mapping(address store => bool) public isStore;

    event StoreCreated(address indexed creator, address indexed store, string name, string symbol);
    event PriceCapRaised(uint256 oldCap, uint256 newCap);

    error ZeroAddress();
    error FeeTooHigh();
    error CapNotHigher(uint256 current, uint256 proposed);

    constructor(IERC20 usdc_, address feeRecipient_, uint16 feeBps_, uint256 priceCap_, address owner_)
        Ownable(owner_)
    {
        if (address(usdc_) == address(0) || feeRecipient_ == address(0)) revert ZeroAddress();
        CreatorStore impl = new CreatorStore();
        if (feeBps_ > impl.MAX_FEE_BPS()) revert FeeTooHigh();

        implementation = address(impl);
        usdc = usdc_;
        feeRecipient = feeRecipient_;
        feeBps = feeBps_;
        priceCap = priceCap_;
    }

    /// @notice Create a store owned by the caller.
    function createStore(string calldata name, string calldata symbol) external returns (address store) {
        store = Clones.clone(implementation);
        isStore[store] = true;
        CreatorStore(store).initialize(msg.sender, usdc, feeRecipient, feeBps, name, symbol);
        emit StoreCreated(msg.sender, store, name, symbol);
    }

    /// @notice Raise the price cap, for example after a full audit. Pass type(uint256).max to remove it.
    function raisePriceCap(uint256 newCap) external onlyOwner {
        uint256 old = priceCap;
        if (newCap <= old) revert CapNotHigher(old, newCap);
        priceCap = newCap;
        emit PriceCapRaised(old, newCap);
    }
}
