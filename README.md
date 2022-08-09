# EthernautDAO-HackerGame Level 6

The goal of this challenge is very simple. We just have to call the `cantCallMe()` function in a block which the number satisfies the condition `blockNumber % mod == lastXDigits` before anyone else does it.
Since `mod` and `lastXDigits` are public, we can easily get the values to perform the calculations needed. An equally easy alternative would be to use etherscan to check the contract creation transaction.

So, these easy steps will solve the challenge:
1. Get the `mod` and `lastXDigits` values;
2. Get the next block number.
    - If `nextBlockNumber % mod == lastXDigits`, call the `cantCallMe()` function in the next block;
    - Else, mine the next block.[^1]

p.s: If you clone this repo and run the `setUpAndAttack` script it will set up the environment and initiate the attack locally (or on goerli), as you most likely won't be able to use the original contract - it has already been hacked.

[^1]: Keep in mind that mining the next block is only possible when running a local chain. On goerli it isn't this straightforward.