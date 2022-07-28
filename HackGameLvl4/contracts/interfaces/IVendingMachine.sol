// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

/**
 * @title Vending Machine Interface
 * @author kyrers (of the interface only, not the contract itself)
 * @notice Contains the functions required to exploit the vending machine
 */
interface IVendingMachine {
    /**
     * @dev Deposits are made to the contract before any interaction with it.
     * Only valid when the contract hasn't been hacked.
     */
    function deposit() external payable;

    /**
     * @dev Withdraws deposit or balance from the contract.
     * Only valid when the contract hasn't been hacked.
     *
     * Requirements:
     *
     * - The caller must have deposited to contract and has a balance in the contract even after transaction.
     */
    function withdrawal() external;
}