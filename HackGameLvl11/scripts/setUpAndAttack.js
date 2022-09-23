const { ethers } = require("hardhat");

async function main() {
    const [owner, attacker, lpStaker] = await ethers.getSigners();
    console.log("## OWNER ACCOUNT: ", owner.address);
    console.log("## ATTACK ACCOUNT: ", attacker.address);
    console.log("## LPSTAKER ACCOUNT: ", lpStaker.address);

    console.log("** DEPLOY CONTRACTS **");

    //Deploy RewardToken
    const rewardFactory = await ethers.getContractFactory("RewardToken");
    const rewardContract = await rewardFactory.deploy("RewardToken", "RT", lpStaker.address);
    await rewardContract.deployed();
    console.log("   ## REWARD TOKEN DEPLOYED TO: ", rewardContract.address);

    //Deploy Staking
    const stakingFactory = await ethers.getContractFactory("Staking");
    const stakingContract = await stakingFactory.deploy(rewardContract.address);
    await stakingContract.deployed();
    console.log("   ## STAKING CONTRACT DEPLOYED TO: ", stakingContract.address);

    //Deploy MockERC20
    const mockFactory = await ethers.getContractFactory("MockERC20");
    const mockERC20Contract = await mockFactory.deploy();
    await mockERC20Contract.deployed();
    console.log("   ## MOCK ERC20 DEPLOYED TO: ", mockERC20Contract.address);

    //-----------------------------------------------------------------------

    console.log("** SETUP CONTRACTS **");

    //Mint RewardTokens to owner
    await rewardContract.mint(owner.address, ethers.utils.parseEther("10000000000"));
    console.log("   ## MINT REWARD TOKENS TO OWNER");

    //Approve Staking contract to use all RewardTokens
    await rewardContract.approve(stakingContract.address, ethers.constants.MaxUint256);
    console.log("   ## APPROVE STAKING CONTRACT TO USE REWARD TOKENS");

    //Add RewardToken to Staking as the reward token
    await stakingContract.addReward(rewardContract.address, owner.address, 7257600);
    console.log("   ## ADD REWARD TOKEN TO STAKING CONTRACT");

    //Staking Notify Reward Amount
    await stakingContract.notifyRewardAmount(rewardContract.address, ethers.utils.parseEther("1000000"));
    console.log("   ## NOTIFY REWARD AMOUNT");

    // Add MockERC20 to Reward as the reward token
    await rewardContract.addReward(mockERC20Contract.address, owner.address, 7257600);
    console.log("   ## ADD REWARD TOKEN TO REWARD CONTRACT");
    //-----------------------------------------------------------------------
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });