const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

async function main() {
    //The contract abi
    const abi = [
        {"inputs":[{"internalType":"address","name":"_walletLibrary","type":"address"},{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_numConfirmationsRequired","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"}, {"stateMutability":"payable","type":"fallback"},
        {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"isConfirmed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"numConfirmationsRequired","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"owners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"transactions","outputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bool","name":"executed","type":"bool"},{"internalType":"uint256","name":"numConfirmations","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"walletLibrary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}
    ]

    //The contract address
    const contractAddress = "0x19c80e4Ec00fAAA6Ca3B41B17B75f7b0F4D64CB7";

    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address);

    //Get the contract and connect using your account
    let contract = new ethers.Contract(contractAddress, abi, signer);

    let initWalletFunctionABI = ["function initWallet(address[] memory _owners, uint256 _numConfirmationsRequired)"];
    let interface = new ethers.utils.Interface(initWalletFunctionABI);
    let encondedData = interface.encodeFunctionData("initWallet", [["0x1234567890123456789012345678901234567890"], "1"]);
    /*let initWalletTx = await contract.initWallet(["0x732253fa9C208F89180aA652f1081319e72f2fE8"], 1);
    let initWalletTxReceipt = await initWalletTx.wait();*/
    const returnData = await signer.call({to: '0x19c80e4Ec00fAAA6Ca3B41B17B75f7b0F4D64CB7', data: encondedData });

    console.log(returnData);
    //Get the deployment info
    /*let deployTxHash = "0x027f7b59ae7602d23e99bc74d96a6bfc2a6760fb22edfa76a1b4eb8b553e7215";
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
    console.log("OWNERSHIP TAKEN: ", takeOwnershipTxReceipt);*/
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });