require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.15",
  networks: {
    localhost: {
      chainId: 1337,
      url: "http://localhost:8545"
    },
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [`${process.env.GOERLI_ACCOUNT_PK}`, `${process.env.GOERLI_SECOND_ACCOUNT_PK}`]
    },
  }
}