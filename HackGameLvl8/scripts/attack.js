const { ethers } = require("hardhat");

async function main() {
    const [owner, attacker] = await ethers.getSigners();
    console.log("## Owner: ", owner.address);
    console.log("## Attacker: ", attacker.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });