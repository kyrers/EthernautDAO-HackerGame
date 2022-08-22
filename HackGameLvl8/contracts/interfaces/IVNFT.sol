// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
* @dev Simple interface to the VNFT implementation
* @author kyrers
*/
interface IVNFT {
    function whitelistMint(address to, uint256 qty, bytes32 hash, bytes memory signature) external payable;
}