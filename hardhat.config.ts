import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from 'dotenv'
dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
  networks: {
    mumbai : {
      url: process.env.POLYGON_MUMBAI_URL,
      accounts: [process.env.DEPLOYER_KEY!]
    },
    hardhat: {
      forking: {
        url: process.env.POLYGON_MAINNET!,
      },
      allowUnlimitedContractSize: true,
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!
    }
  },
};

export default config;
