const { ethers } = require("hardhat");

async function main() {
    const [attacker] = await ethers.getSigners();
    console.log("## Attacker: ", attacker.address);
    
    const hash = "0xd54b100c13f0d0e7860323e08f5eeb1eac1eeeae8bf637506280f00acd457f54";
    const signature = "0xf80b662a501d9843c0459883582f6bb8015785da6e589643c2e53691e7fd060c24f14ad798bfb8882e5109e2756b8443963af0848951cffbd1a0ba54a2034a951c";

    //Deploy attacker
    const attackerFactory = await ethers.getContractFactory("Attacker");
    const attackerContract = await attackerFactory.deploy("0xC357c220D9ffe0c23282fCc300627f14D9B6314C", hash, signature);
    await attackerContract.deployed();

    console.log("## ATTACKER CONTRACT DEPLOYED TO: ", attackerContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });