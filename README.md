# EthernautDAO-HackerGame Level 10

The challenge goal is simple: Steal all the funds from the `Vault` contract.

I'll explain my solution below, but I will also point you to an [alternative explanation](https://github.com/beskay/solidity-challenges/blob/main/writeups/Vault.md). This challenge has a few traps, so reading more than one explanation might help you.

With that being said, let's dive in.

The first thing to note is that the `Vault` has a `delegate`, which is itself a contract - `Vesting`.

Analyzing the `Vault` contract, we can immediately see that there's no way to withdraw the funds. We can only deposit, upgrade the delegate (if we are the owner), or make the vault `execute()` a `call` to a `target` using the `data` sent as a parameter.

The `Vault` handles calls to non-existing functions via a `fallback()` function, which calls the `_delegate()` function. This function performs a `delegatecall` to the `delegate`. However, you'll notice that `_delegate()` makes sure that the caller is the `Vault` owner.

We know in which situation the `delegate` is called and that to change it we must be the owner of the `Vault`. Theoretically, if we manage to change the `delegate`, we could set it to an `Attacker` contract that sends all the `Vault` funds to ourselves.

There's no way to change the `Vault` owner in the `Vault` contract itself. So we'll have to look for a way in the `Vesting` contract.

The `Vesting` contract `setDuration(...)` function immediately stands out, because it changes state. This is key because we have already seen that the `Vault` performs a `delegatecall` to this contract, meaning it will be executed in the `Vault` context, potentially causing storage collisions.

Upon further inspection, this is really what we need! The `duration` variable is stored in the same memory slot as the `Vault` `owner` variable, so if `setDuration(...)` is executed via `delegatecall` it will modify the `Vault` owner!

If we become the `Vault` owner, the remaining steps of the hack are relatively easy. We just change the `delegate` to our attacker contract, and then call the `Vault` `fallback()` function using our account, which will perform a `delegatecall` to the `delegate`, which will be our `Attacker` contract, that we will implement in a way that simply sends all funds to our account.

There are a few verifications we have to sidestep while implementing this hack, which are clearly described in the `setUpAndAttack` script. I will mention them here as well, while reviewing the steps we need to take. So:

1. Implement an `Attacker` contract that sends the `Vault` funds to our account;
2. Call the `Vault` `execute(...)` function:
    - The `payload` must be an encoded call to the `setDuration(...)` function:
        - For this to work, we have to convert our attack address to an uint. The result of this conversion must also be larger than the current `owner` address as an uint. If you are lucky, your address will be larger. If not, you might need to use the `CREATE2` opcode to deploy a contract to work as an intermediary between you and the `Vault`;
    - As the `target`, we must send the `Vault` address itself, that way it will `call` its own `fallback(...)` function, which will pass the `onlyAuth` verification and perform a `delegatecall` to the `delegate`, meaning the `owner` will be changed;
3. Set our `Attacker` contract as the delegate;
4. Send a transaction to the `Vault` contract in which the data is a call to the `delegate` contract withdraw function:
    - This call must not be done via the `execute(...)` function like in step 2, otherwise the funds will be sent to the `Vault` itself, instead of our account;
5. Profit!


p.s: If you clone this repo and run the `setUpAndAttack` script it will set up the `Vault`, `Vesting` and `Attack` contracts locally (or on goerli), as you most likely won't be able to use the original contract - it has already been hacked.
Note that you might need to modify the script if you deploy to goerli and add `tx.wait()` for each transaction made.