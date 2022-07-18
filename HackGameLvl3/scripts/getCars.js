const { ethers } = require("hardhat");

async function main() {
    //The contract address
    const contractAddress  = "";

    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });