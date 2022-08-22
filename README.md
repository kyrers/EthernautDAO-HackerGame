# EthernautDAO-HackerGame Level 8

The goal of this challenge is to get our hands on more than 2 `VNFT` ERC721 tokens.

Looking at the contract code we see that `VNFT` tokens are minted in functions `imFeelingLucky(...)` and `whitelistMint(...)`;

`imFeelingLucky(...)` requires us to guess a number and be an `EOA` account. 
`whitelistMint(...)` mints a maximum of 2 `VNFT` tokens to a given address, given a hash and signature that results in the owner account.
[Inspecting the challenge address transactions](https://goerli.etherscan.io/address/0xc357c220d9ffe0c23282fcc300627f14d9b6314c) we find that the owner called `whitelistMint(...)` giving us an `hash` and `signature` to use. And a way in.

There's one more key aspect to this hack - the fact that this is an `ERC721` token means that the receiving address must implement a `onERC721Received(...)` functions that must return the `ERC721` token selector.

Knowing this, here's what we can do:
1. Deploy an `Attacker` contract that uses the `whitelistMint(...)` function twice - for two different `Receiver` contracts;
2. The `Receiver` contracts send the `VNFT` to our attacker wallet on `onERC721Received(...)` function execution.

This is actually a simple hack provided we know one key piece of information regarding the `ERC721` token standard.

p.s: Unlike previous challenges, this solution is not prepared to run locally because the VNFT contract has plenty of tokens left. However if you need to set up the hack locally, you can refer to previous branches for examples.
