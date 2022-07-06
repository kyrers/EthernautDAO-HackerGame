const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        { "inputs": [{ "internalType": "string", "name": "rndString", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
        { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Deposit", "type": "event" },
        { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTaken", "type": "event" },
        { "inputs": [], "name": "NUM", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
        { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "addressToKeys", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
        { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
        { "inputs": [{ "internalType": "uint256", "name": "key", "type": "uint256" }], "name": "takeOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
        { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }
    ];

    //The contract address
    const contractAddress = "0x620E0c88E0f8F36bCC06736138bDEd99B6401192";

    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address);

    //Get the contract and connect using your account
    let contract = new ethers.Contract(contractAddress, abi, signer);

    //Get the deployment info
    let deployTxHash = "0x027f7b59ae7602d23e99bc74d96a6bfc2a6760fb22edfa76a1b4eb8b553e7215";
    let contractCreationBytecode = "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000042307831646363346465386465633735643761616238356235363762366363643431616433313234353162393438613734313366306131343266643430643439333437000000000000000000000000000000000000000000000000000000000000";
    let deployTx = await ethers.getDefaultProvider("goerli").getTransaction(deployTxHash);
    let txBlock = await ethers.getDefaultProvider("goerli").getBlock(deployTx.blockHash);

    //Decode the contractCreationBytecode
    const interface = new ethers.utils.Interface(abi);
    const decodedParams = interface._decodeParams(["string"], contractCreationBytecode);
    console.log(`### rndString: ${decodedParams[0]} ###`);

    let secretKey = ethers.utils.solidityKeccak256(["bytes32", "uint", "string"], [txBlock.parentHash, txBlock.timestamp, decodedParams[0]]);
    console.log(`### SECRET KEY: ${secretKey} ###`);

    //Take ownership
    let takeOwnershipTx = await contract.takeOwnership(secretKey);
    let takeOwnershipTxReceipt = await takeOwnershipTx.wait();
    console.log("OWNERSHIP TAKEN: ", takeOwnershipTxReceipt);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });