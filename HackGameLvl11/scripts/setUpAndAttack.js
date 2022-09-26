const { ethers } = require("hardhat");

async function main() {
    const [owner, attacker, lpStaker] = await ethers.getSigners();
    console.log("## OWNER ACCOUNT: ", owner.address);
    console.log("## ATTACK ACCOUNT: ", attacker.address);
    console.log("## LPSTAKER ACCOUNT: ", lpStaker.address);

    console.log("** DEPLOY CONTRACTS **");

    //Deploy MockERC20
    const mockFactory = await ethers.getContractFactory("MockERC20", owner);
    const mockERC20Contract = await mockFactory.deploy();
    await mockERC20Contract.deployed();
    console.log("   ## MOCK ERC20 DEPLOYED TO: ", mockERC20Contract.address);

    //Deploy Staking Token
    const stakingTokenFactory = await ethers.getContractFactory("StakingToken", owner);
    const stakingTokenContract = await stakingTokenFactory.deploy();
    await stakingTokenContract.deployed();
    console.log("   ## STAKING TOKEN DEPLOYED TO: ", stakingTokenContract.address);

    //Deploy RewardToken
    const rewardFactory = await ethers.getContractFactory("RewardToken", owner);
    const rewardContract = await rewardFactory.deploy("RewardToken", "RT", lpStaker.address);
    await rewardContract.deployed();
    console.log("   ## REWARD TOKEN DEPLOYED TO: ", rewardContract.address);

    //Deploy Staking
    const stakingFactory = await ethers.getContractFactory("Staking", owner);
    const stakingContract = await stakingFactory.deploy(stakingTokenContract.address);
    await stakingContract.deployed();
    console.log("   ## STAKING CONTRACT DEPLOYED TO: ", stakingContract.address);

    //-----------------------------------------------------------------------

    console.log("** SETUP REWARD TOKEN CONTRACT **");
    const duration = 86400 * 7 * 12;

    // Add MockERC20 to Reward as the reward token
    await rewardContract.addReward(mockERC20Contract.address, owner.address, duration);
    console.log("   ## ADD MOCKERC20 AS THE REWARD CONTRACT REWARD TOKEN");

    ///Mint RewardTokens to owner
    await rewardContract.mint(owner.address, ethers.utils.parseEther("10000000000"));
    console.log("   ## MINT REWARDTOKENS TO OWNER");

    //Approve Staking contract to use all RewardTokens
    await rewardContract.approve(stakingContract.address, ethers.constants.MaxUint256);
    console.log("   ## APPROVE STAKING CONTRACT TO USE REWARDTOKENS");

    //-----------------------------------------------------------------------

    console.log("** SETUP STAKING CONTRACT **");

    //Add RewardToken to Staking as the reward token
    await stakingContract.addReward(rewardContract.address, owner.address, duration);
    console.log("   ## ADD REWARDTOKEN AS THE STAKING CONTRACT REWARD TOKEN");

    //Staking Notify Reward Amount
    await stakingContract.notifyRewardAmount(rewardContract.address, ethers.utils.parseEther("1000000"));
    console.log("   ## NOTIFY REWARD AMOUNT");

    //-----------------------------------------------------------------------
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });