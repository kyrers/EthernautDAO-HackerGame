# EthernautDAO-HackerGame Level 1

The approach I took was to minimize Etherscan usage and maximize ethers.js interactions;

I did use Etherscan though, namely to:
1. Read the contract code and find how the `secretKey` was calculated;
2. Obtain the contract abi, deployment transaction hash, and contract creation bytecode;

If anyone knows how to use ethers.js to do any of the above, please do reach out or code it!

I then used a mix of hardhat and ethers.js to:
1. Connect to the contract using my goerli account;
2. Get the deployment transaction and block;
3. Decode the contract creation bytecode and find out the `rndString` used;
4. Calculate the `secretKey` given that I already have all the information needed;
5. Take ownership;


