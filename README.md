# EthernautDAO-HackerGame Level 4

If you look at the contracts, hopefully you'll see that this is a basic reentrancy attack.
There's only a couple of things that are worth mentioning:
1. The `withdrawal()` function in the `VendingMachine` contract requires that you have made a `deposit()` of atleast `0.1 ether`;
2. It also expects the account to be externally owned;

Here's how I did it:
1. Create an `Attacker` contract that makes a `deposit()` to the `VendingMachine` contract and then calls the `withdrawal()` function. Personally, I chose a deposit of `1 ether`, just because it makes the exploit faster. However, any deposit `>= 0.1 ether` will work, it will only take longer;
2. The `Attacker` contract also has a `receive()` function, which checks the `VendingMachine` remaining balance and performs a reentrancy attack while `balance != 0`;
3. Finally, the `Attacker` contract also has a `withdraw()` functions that allows you to get the `Attacker` balance back to your account.

p.s: If you clone this repo and run the `setUpAndAttack` script it will set up the vending machine and initiate the attack locally (or on goerli), as you most likely won't be able to use the original contract - it has already been hacked.