# EthernautDAO-HackerGame Level 11

This challenge has a more complicated setup.

It consists of a `Staking` contract that is `Pausable`, has its own `StakingToken`, and can have multiple `Reward` tokens.
Exploring the `Staking` contract, we can see that the staking token is the `StakingToken` - which has one function that gives `1000 STK` to the caller.

We can also see that the reward token for the `Staking` contract is the `RewardToken`. This contract also has its own reward token - the `MockERC20` token.

Lastly, we know that the `Staking` contract has an initial balance of 1 million `RewardToken`.

Now to the find the goal of this challenge. At first, I was looking for ways to steal the `Staking` tokens. When I couldn't find any, I started to look for other issues. Eventually, it dawned on me that if this contract is `Pausable`, there must be a way to pause it. This would make it impossible for users to stake. 

There is only one way to pause `Staking` - inside the `getReward()` function.

To make sure we reach `paused()` there's two conditions we must meet:
1. Our attacker must have a reward amount `> 0`. This is calculated during the execution of `updateReward(...)` modifier. Specifically, inside the `earned(...)` function.
2. The `Staking` contract attempt to transfer the `RewardToken` to the attacker, us, must fail. That way we can pass the `!success` verification and reach `paused()`.

Looking at the `earned(...)` function, it returns the result of `_balances[account].mul(rewardPerToken(_rewardsToken).sub(userRewardPerTokenPaid[account][_rewardsToken])).div(1e18).add(rewards[account][_rewardsToken]);`. We need this to be higher than 0, meaning that `_balances[ourAccount]` cannot be 0. To do that we must stake something!

Luckily for us, we know that the `StakingToken` acts as a faucet that gives `1000 STK` tokens. So we just call it and stake those tokens. Don't forget to `approve()` the `Staking` contract to use our `1000 STK` tokens.

This allows us to bypass the first verification, but what about the second?

We know that the attempt from the `Staking` contract to transfer the `RewardToken` to the attacker, us, must fail.
One possible way for this to fail is if the sender, the `Staking` contract, has insufficient balance. We know it has 1 million `RewardTokens`, but how can we modify this?

The `RewardToken` has a `burnFrom(...)` function, that allows whoever has the `minter` role, to send tokens from any user to the zero address. 
Who is the `minter` and how can it be set? Wait, `setMinter()` can be called by anyone? Promising. All we need is for the `minter` address to not have been initialized yet - which it hasn't!

So if we set our attacker account as the minter, we can then call `burnFrom(...)` and burn the `Staking` contract tokens, allowing us to bypass the second check and pause the contract!

To recap:
1. Get `STK` tokens from the faucet;
2. Approve `Staking` to use your `STK` tokens;
3. Stake those tokens;
4. Set yourself as the `RewardContract` `minter`;
5. Burn the `Staking` contract tokens;
6. Call the `getReward()` function;

p.s: If you clone this repo and run the `setUpAndAttack` script it will set up the challenge locally (or on goerli), as you most likely won't be able to use the original contract - it has already been hacked.

p.s.s: After solving this challenge, I found out from the creator of this challenge that this was not the intended exploit. It was a mistake. [The original exploit has the same result, but is much more elegant though.](https://github.com/beskay/solidity-challenges/blob/main/writeups/Staking.md)