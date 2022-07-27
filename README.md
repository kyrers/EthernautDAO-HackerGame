# EthernautDAO-HackerGame Level 3

If you look at the contracts, you'll see that you can get 1 car for free. However, the goal is to get 2 cars for free.
The `carFactory` contract has a `flashLoan` function which we can use to provide us with funds to buy the second car. However, there's a couple of tricks for this to work:
1. Notice that you can't use the `flashLoan` effectively by calling it directly, because the `address private carFactory` equals `address(0)`;
2. Hopefully, you'll notice that the only way to call the `flashLoan` function is using the `fallback` function in the `carMarket` contract - which uses `delegatecall`. This is important, otherwise we would have to repay our loan and the second car wouldn't be free.

Here's a way to do it:
1. Create an `Attacker` contract that initiates the attack and is capable of handling the callback `receivedCarToken(addres)` made by the `flashLoan` function;
2. The `Attack` function has to `mint` our free car token - we can also approve the `carMarket` to spend our 101k car tokens (1 minted + 100k from flashloan). This is only needed when purchasing the second car, but we can do it here for convenience. Then, we need `purchase` our free car and then call the `fallback` function using `abi.encodeWithSignature("flashLoan(uint256)", 100000 ether)` as parameters, so the `carMarket` calls the `fallback` function with the correct parameters;
3. In the `receivedCarToken(addres)` function we just need to purchase the second car;
4. You should own 2 cars now.

p.s: If you clone this repo and run the `getCars` script it will set up the hackable contracts and initiate the attack locally (or on goerli), as you most likely won't be able to use the original contracts - they have already been hacked.