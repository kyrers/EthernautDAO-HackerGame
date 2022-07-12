require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  solidity: "0.8.15",
  networks: {
    localhost: {
      url: "http://localhost:8545"
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [`${process.env.GOERLI_ACCOUNT_PK}`,]
    },
  }
};
