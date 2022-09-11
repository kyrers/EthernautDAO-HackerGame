const { ethers } = require("hardhat");

async function main() {
    const [attacker] = await ethers.getSigners();
    console.log("## ATTACK ACCOUNT: ", attacker.address);

    const contractAddress = "";

    //Get the contract
    const contractABI = [];

    const exploitableContract = new ethers.Contract(contractAddress, contractABI, attacker);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });