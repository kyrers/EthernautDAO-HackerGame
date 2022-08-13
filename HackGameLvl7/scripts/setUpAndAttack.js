const { ethers } = require("hardhat");

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("## SIGNER: ", signer.address);
    
    //Deploy and set up contracts 
    const Factory = await ethers.getContractFactory("");
    const Contract = await Factory.deploy(45,100);
    await Contract.deployed();
    console.log(`##  contract deployed to: ${Contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });