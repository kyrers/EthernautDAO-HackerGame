# EthernautDAO-HackerGame Level 7

The goal of this challenge is very simple, we just have to become the new owner of the `Switch` contract. There are two key functions in the contract:
    - `changeOwnership(address _owner) onlyOwner` that allows only the owner to change the contract owner;
    - `changeOwnership(uint8 v, bytes32 r, bytes32 s)` which, fortunately for us, only checks that the parameters passed to the function result in an address different than zero address.

So, these easy steps will solve the challenge:
1. Connect your goerli account to `ethers` and use it to create a `Wallet()` object. This is needed because `ethers` doesn't allow `signers` to sign transactions, `wallets` can.
2. Then, we need to sign a mock transaction using our attacker wallet to get `r,s,v` values that we can than use to call the `changeOwnership(uint8 v, bytes32 r, bytes32 s)` function;
3. All that's left is to call `changeOwnership(uint8 v, bytes32 r, bytes32 s)` usign the parameters we obtained above.

p.s: Unlike previous challenges, this solution is not prepared to run locally - because the `Switch` contract can be hacked forever.