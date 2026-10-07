// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @dev Minimal ERC-1271 wallet that accepts signatures from one EOA signer,
///      standing in for a smart wallet that owns a store.
contract MockSmartWallet is IERC1271 {
    address public immutable signer;

    constructor(address signer_) {
        signer = signer_;
    }

    function isValidSignature(bytes32 hash, bytes calldata signature) external view returns (bytes4) {
        (address recovered, ECDSA.RecoverError err,) = ECDSA.tryRecover(hash, signature);
        return (err == ECDSA.RecoverError.NoError && recovered == signer) ? IERC1271.isValidSignature.selector : bytes4(0);
    }

    function execute(address target, bytes calldata data) external returns (bytes memory) {
        require(msg.sender == signer, "not signer");
        (bool ok, bytes memory ret) = target.call(data);
        require(ok, "call failed");
        return ret;
    }
}
