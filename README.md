# EthernautDAO-HackerGame Level 5

The goal of this challenge is to use `permit(...)` to be able to transfer `EthernautDaoTokens` from the `owner` to our wallet.
We are given the `private key` of the owner account.

Looking at the `permit(...)` function, we can see that it allows us to permit a transaction if we use the correct signature parameters.
Given that we have the `private key` of the wallet, we just have to permit a transaction of all the tokens to ourselves.

Although this is possible to do without third-party libraries, I used `eth-permit` to solve this challenge. 
Here's how I did it:
1. Access the `owner` wallet[^1];
2. Sign a transaction object using the `owner` wallet using `eth-permit`. The transaction object simulates the real permit transaction which allows us to transfer the tokens to ourselves;
3. Call `permit(...)` function from the `EthernautDaoToken` contract with the `owner` wallet using the parameters discovered above.
4. Using your wallet, call `transferFrom(...)` and transfer the `owner` tokens to your wallet.

p.s: If you clone this repo and run the `setUpAndAttack` script it will set up the environment and initiate the attack locally (or on goerli), as you most likely won't be able to use the original contract - it has already been hacked.

[^1]: As we are running this ourselves, we just have to use two different wallets. But given we know the private key of the owner wallet, if we needed to, we could use `ethers` to easily get that wallet.