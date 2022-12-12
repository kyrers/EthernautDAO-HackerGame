require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.15",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  },
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
    "optimism-goerli": {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [`${process.env.OPTIMISTIC_GOERLI_ACCOUNT_PK}`,]
    }
  }
}
