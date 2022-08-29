const { ethers } = require("hardhat");

async function main() {
    const [owner, signer] = await ethers.getSigners();
    console.log("## OWNER: ", owner.address);
    console.log("## ATTACK ACCOUNT: ", signer.address);
    
    //Deploy and set up contracts 
    const walletFactory = await ethers.getContractFactory("EtherWallet");
    const walletContract = await walletFactory.deploy({value: ethers.utils.parseEther("1")});
    await walletContract.deployed();

    console.log(`## EtherWallet deployed to: ${walletContract.address} with a balance of 1 ETH`);

    const initialAttackerBalance = await signer.getBalance();
    console.log(`## Attacker has an initial balance of ${ethers.utils.formatEther(initialAttackerBalance)} ETH`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });