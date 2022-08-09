const { ethers } = require("hardhat");

async function main() {
    const [owner, signer] = await ethers.getSigners();
    console.log("## OWNER: ", owner.address);
    console.log("## ATTACK ACCOUNT: ", signer.address);
    
    //Deploy and set up contracts 
    const hackableFactory = await ethers.getContractFactory("Hackable");
    const hackableContract = await hackableFactory.deploy(45,100);
    const deployTx = await hackableContract.deployed();
    console.log(`## Hackable contract deployed to: ${hackableContract.address}`);

    //Get values
    let digits = (await hackableContract.lastXDigits()).toNumber();
    let mod = (await hackableContract.mod()).toNumber();
    console.log(`## Last X Digits: ${digits}`);
    console.log(`## MOD: ${mod}`);

    //Find a block which number satisfies the requirements
    console.log(`## WAITING FOR CORRECT BLOCK`);
    let nextBlockNumber = (await ethers.provider.getBlock()).number + 1;
    while(nextBlockNumber % mod != digits) {
        await ethers.provider.send("evm_mine");
        nextBlockNumber = (await ethers.provider.getBlock()).number + 1;
    }
    console.log(`## FOUND QUALIFIYING BLOCK: ${nextBlockNumber}`);

    //Try to make the call
    console.log("## ATTEMPTING CALL");
    await hackableContract.cantCallMe();
    console.log(`## SUCCESS!`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });