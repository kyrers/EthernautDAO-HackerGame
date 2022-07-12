# EthernautDAO-HackerGame Level 2

If you look at the contracts, you'll see that `walletLibrary` `initWallet` function can be called by anyone.
To call it, we'll need to send a transaction via the `wallet` contract `fallback` function.

Here's a simple way to do it:
1. Encode the data we need to send in our transaction which will invoke the `fallback` function using `ethers.utils.Interface()`;
2. Send a transaction using our wallet with the contract address and data encoded before. We should make sure to send our address as the first parameter and "1" in the second, to make sure only our signature is needed in the future;
3. You'll be the new owner of the multisig and will be able to, for instance, call `submitTransaction` and submit a transaction to send all funds to your address;

