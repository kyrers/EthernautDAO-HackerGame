const { ethers } = require("hardhat");

async function main() {
    const [signer] = await ethers.getSigners();
    const provider = ethers.provider;
    console.log("## SIGNER: ", signer.address);

    //Deploy and set up contracts 
    const vendingMachineFactory = await ethers.getContractFactory("VendingMachine");
    const vendingMachineContract = await vendingMachineFactory.deploy({value: ethers.utils.parseEther("1")});
    await vendingMachineContract.deployed();
    const vendingMachineBalance = ethers.utils.formatEther(await provider.getBalance(vendingMachineContract.address));
    console.log(`## Vending Machine deployed to: ${vendingMachineContract.address} with a balance of ${vendingMachineBalance} ETH`);

    const attackerFactory = await ethers.getContractFactory("Attacker");
    const attackerContract = await attackerFactory.deploy(vendingMachineContract.address);
    await attackerContract.deployed();
    console.log("## Attacker deployed to:", attackerContract.address);
    
    //Attack
    const attackTx = await attackerContract.attack({value: ethers.utils.parseEther("1")});
    await attackTx.wait();
    const attackerContractBalance = ethers.utils.formatEther(await provider.getBalance(attackerContract.address));
    console.log(`## Attack succeeded! The attacker contract now has ${attackerContractBalance} ETH.`);

    //You should have your 2 eth back after this
    const withdrawTx = await attackerContract.withdraw();
    await withdrawTx.wait();
    console.log(`## Attacker funds successfully sent to your account.`);

    const afterbalance = ethers.utils.formatEther(await provider.getBalance(signer.address));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });