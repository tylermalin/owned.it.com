// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/CreatorStore.sol";

contract Deploy is Script {
    function run() external {
        // Load environment variables - private key should be hex string WITH 0x prefix
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address platformFeeAddress = vm.envAddress("PLATFORM_FEE_ADDRESS");
        
        // Base Sepolia USDC address
        address usdcAddress = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy CreatorStore
        CreatorStore store = new CreatorStore(
            usdcAddress,
            platformFeeAddress,
            "OWNED Store",
            "OWNED"
        );
        
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("CreatorStore deployed to:", address(store));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Platform fee address:", platformFeeAddress);
        console.log("USDC address:", usdcAddress);
        console.log("Network: Base Sepolia (84532)");
        
        console.log("\nDeployment successful!");
        console.log("Save this info to deployments/base-sepolia.json manually");
    }
}
