// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable, Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CreatorStore} from "./CreatorStore.sol";

/// @title StoreFactory
/// @notice Deploys one CreatorStore clone per call. The caller owns the new store.
///         USDC and the fee rate are fixed for every store this factory creates.
/// @dev    The factory owner can: raise the per-product price cap, and propose a new
///         platform fee recipient. Neither touches any creator's money or the fee rate.
///         The only source of truth for which stores are real is `isStore` and `StoreCreated`.
contract StoreFactory is Ownable2Step {
    address public immutable implementation;
    IERC20 public immutable usdc;
    uint16 public immutable feeBps;

    /// @notice Receives the platform share from every store. Rotatable, two-step.
    address public feeRecipient;
    address public pendingFeeRecipient;

    /// @notice Highest price a product may list at, in USDC base units. Only ever increases.
    uint256 public priceCap;

    mapping(address store => bool) public isStore;

    event StoreCreated(address indexed creator, address indexed store, string name, string symbol);
    event PriceCapRaised(uint256 oldCap, uint256 newCap);
    event FeeRecipientProposed(address indexed current, address indexed proposed);
    event FeeRecipientChanged(address indexed previous, address indexed current);

    error ZeroAddress();
    error FeeTooHigh();
    error CapNotHigher(uint256 current, uint256 proposed);
    error NotAuthorized();

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
        CreatorStore(store).initialize(msg.sender, usdc, feeBps, name, symbol);
        emit StoreCreated(msg.sender, store, name, symbol);
    }

    /// @notice Raise the price cap, for example after a full audit. Pass type(uint256).max to remove it.
    function raisePriceCap(uint256 newCap) external onlyOwner {
        uint256 old = priceCap;
        if (newCap <= old) revert CapNotHigher(old, newCap);
        priceCap = newCap;
        emit PriceCapRaised(old, newCap);
    }

    /// @notice Propose a new fee recipient. Callable by the current recipient, or by the owner
    ///         if the recipient's key is lost. Takes effect only when the new address accepts.
    function proposeFeeRecipient(address proposed) external {
        if (msg.sender != feeRecipient && msg.sender != owner()) revert NotAuthorized();
        if (proposed == address(0)) revert ZeroAddress();
        pendingFeeRecipient = proposed;
        emit FeeRecipientProposed(feeRecipient, proposed);
    }

    function acceptFeeRecipient() external {
        if (msg.sender != pendingFeeRecipient) revert NotAuthorized();
        address previous = feeRecipient;
        feeRecipient = msg.sender;
        pendingFeeRecipient = address(0);
        emit FeeRecipientChanged(previous, msg.sender);
    }
}
