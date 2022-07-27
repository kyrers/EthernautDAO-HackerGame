const { ethers } = require("hardhat");

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("## SIGNER: ", signer.address);

    //Deploy contracts
    const carTokenFactory = await ethers.getContractFactory("CarToken");
    const carTokenContract = await carTokenFactory.deploy();
    await carTokenContract.deployed();
    console.log("## Car Token deployed to:", carTokenContract.address);

    const carMarketFactory = await ethers.getContractFactory("CarMarket");
    const carMarketContract = await carMarketFactory.deploy(carTokenContract.address);
    await carMarketContract.deployed();
    console.log("## Car Market deployed to:", carMarketContract.address);

    const carFactoryFactory = await ethers.getContractFactory("CarFactory");
    const carFactoryContract = await carFactoryFactory.deploy(carMarketContract.address, carTokenContract.address);
    await carFactoryContract.deployed();
    console.log("## Car Factory deployed to:", carFactoryContract.address);

    const attackerFactory = await ethers.getContractFactory("Attacker");
    const attackerContract = await attackerFactory.deploy(carTokenContract.address, carMarketContract.address);
    await attackerContract.deployed();
    console.log("## Attacker deployed to:", attackerContract.address);

    //Set up
    //Mint 100k tokens to the car market
    const mintForCarMarketTx = await carTokenContract.priviledgedMint(carMarketContract.address, ethers.utils.parseEther("100000"));
    await mintForCarMarketTx.wait();
    const carMarketBalance = await carTokenContract.balanceOf(carMarketContract.address);
    console.log(`## Minted ${ethers.utils.formatEther(carMarketBalance)} tokens for car market`);

    //Mint 100k tokens to the car factory
    const mintForCarFactoryTx = await carTokenContract.priviledgedMint(carFactoryContract.address, ethers.utils.parseEther("100000"));
    await mintForCarFactoryTx.wait();
    const carFactoryBalance = await carTokenContract.balanceOf(carMarketContract.address);
    console.log(`## Minted ${ethers.utils.formatEther(carFactoryBalance)} tokens for car factory`);

    //Set the car factory address in the car market
    const setCarFactoryTx = await carMarketContract.setCarFactory(carFactoryContract.address);
    await setCarFactoryTx.wait();
    console.log("## Set car factory on car market contract");
    
    //Attack
    const attackTx = await attackerContract.attack();
    const receipt = await attackTx.wait();

    //You should have 2 cars
    const attackerCars = await carMarketContract.getCarCount(attackerContract.address);
    console.log(`## Attack succeeded! You now have ${attackerCars} cars.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });