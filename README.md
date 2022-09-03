# EthernautDAO-HackerGame Level 9

The goal of this challenge is to drain the `EtherWallet` contract.

To me, this was the hardest challenge so far. I actually needed a tip from [beskay](https://twitter.com/beskay0x), a member of the EthernautDAO. I'll explain how I reached the solution below.

Looking at the `EtherWallet` contract, it was obvious that the `withdraw(...)` function needed to be called.

It was also obvious that using the signature that the owner used after deploying the contract would not work, because of the line `require(!usedSignatures[signature], "Signature already used!");`.

The next verification made by the `withdraw()` function is to verifiy that the signature provided resolves to the owner address. I looked through the `ECDSA` library code, but I couldn't find an exploit.
This is where the tip from [beskay](https://twitter.com/beskay0x) came in handy - he told me to compare it to the [OpenZeppelin implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol).

First thing I noticed is that the `ECDSA` library being used in this challenge did not implement all the functions present in the OpenZeppelin version, but that did not seem too critical.

I then started comparing the implemented functions. The first worthy difference I stumbled upon was [this](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/66ec91bc450ff997ca7f7291491f7a1e49107767/contracts/utils/cryptography/ECDSA.sol#L138-L149). Missing verifications seemed like it could be a big issue.

I must admit I did not know what `signature malleability` meant, but the comment provided by `OpenZeppelin` actually does a good job of explaining it.

As I understand it, to avoid `signature malleability` we must ensure that the `s` value of the signature is in the `lower half order` and reject the signature if it is not. The OpenZeppelin explanation provides `0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0` as the order limiter, so `s` can't be bigger than this.

If this check is missing from the `ECDSA` library used by the `EtherWallet` contract, that means that we can flip the `s` and `v` values used by the owner and we should reach a valid signature.
It's important to notice that we must take into account that the original signature used by the owner could be in the `lower half order`. This is important to make sure we flip `s` correctly.

After knowing this, it was a simple matter of:
1. Recovering the original `r,s,v` values;
2. Flipping `s` and `v`;

And that was it. I had a valid signature that could be used to call `withdraw(...)`! The implementation of the exploit is very easy, the tricky part was finding the concept of `signature malleability` and learning what it was. If you already knew this, this challenge might have been very easy for you.

You'll find the exploit in the `attack.js` file;

p.s: Please note that I did not make a local version of this contract because I couldn't get `ganache` to let me sign a message as the owner, meaning I couldn't call `withdraw(...)` with a signature that I could then flip. Apparently this is a known issue. In addition, this challenge only has one winning solution, which means we can compare the signature we reach to the winner's signature and determine if we would've won in case we were the first ones to try. That's what I did. Of course, you can still send the transaction, but it should revert with the `Signature already used!` message.