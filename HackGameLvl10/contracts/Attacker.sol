// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
* @dev The contract that receives the funds
* @author kyrers
*/
contract Attacker {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }

    function receiveFunds() external payable returns (bool) {
        (bool success, ) = payable(owner).call{value: msg.value}("");
        return success;
    }
    
}