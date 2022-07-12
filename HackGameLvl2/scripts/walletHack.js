const { ethers } = require("hardhat");

async function main() {
    //The contract address
    const contractAddress = "0x19c80e4Ec00fAAA6Ca3B41B17B75f7b0F4D64CB7";

    const [signer] = await ethers.getSigners();
    console.log("SIGNER: ", signer.address);

    let initWalletFunctionABI = ["function initWallet(address[] memory _owners, uint256 _numConfirmationsRequired)"];
    let interface = new ethers.utils.Interface(initWalletFunctionABI);
    let encondedData = interface.encodeFunctionData("initWallet", [["0x1234567890123456789012345678901234567890"], "1"]);

    const initWalletTx = await signer.sendTransaction({to: contractAddress, data: encondedData });
    const initWalletTxReceipt = await initWalletTx.wait();
    console.log("Init Wallet: \n", initWalletTxReceipt);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });