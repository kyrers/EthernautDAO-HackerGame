const { ethers } = require("hardhat");

async function main() {
    const [owner, signer] = await ethers.getSigners();
    console.log("## OWNER: ", owner.address);
    console.log("## ATTACK ACCOUNT: ", signer.address);
    
    //Deploy and set up contracts 
    const hackableFactory = await ethers.getContractFactory("Hackable");
    const hackableContract = await hackableFactory.deploy(45,100);
    await hackableContract.deployed();
    console.log(`## Hackable contract deployed to: ${hackableContract.address}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });