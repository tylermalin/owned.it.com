// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {StoreFactory} from "../src/StoreFactory.sol";

/// @notice Deploys StoreFactory (and its CreatorStore implementation).
/// Env:
///   USDC_ADDRESS     Base mainnet 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, Sepolia 0x036CbD53842c5426634e7929541eC2318f3dCF7e
///   FEE_RECIPIENT    the platform Safe, never a hot EOA on mainnet
///   FACTORY_OWNER    holder of the raise-only price cap power (the Safe)
///   FEE_BPS          default 300
///   PRICE_CAP        default 500e6 ($500)
/// Run: forge script script/DeployFactory.s.sol --rpc-url base_sepolia --broadcast --verify --account <keystore>
contract DeployFactory is Script {
    function run() external returns (StoreFactory factory) {
        IERC20 usdc = IERC20(vm.envAddress("USDC_ADDRESS"));
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");
        address owner = vm.envAddress("FACTORY_OWNER");
        uint16 feeBps = uint16(vm.envOr("FEE_BPS", uint256(300)));
        uint256 priceCap = vm.envOr("PRICE_CAP", uint256(500e6));

        vm.startBroadcast();
        factory = new StoreFactory(usdc, feeRecipient, feeBps, priceCap, owner);
        vm.stopBroadcast();

        console.log("StoreFactory:", address(factory));
        console.log("Implementation:", factory.implementation());
        console.log("Deploy block:", block.number);
    }
}
