// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
* @dev The contract that receives the funds and sends them to whoever calls withdraw
* @author kyrers
*/
contract Attacker {
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}
