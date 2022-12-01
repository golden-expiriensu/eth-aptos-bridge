import './tasks';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-contract-sizer';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';

import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

if (!process.env.DEPLOYER_PRIVATE_KEY)
  throw new Error("Please set DEPLOYER_PRIVATE_KEY in .env file");
if (!process.env.OWNER_PRIVATE_KEY)
  throw new Error("Please set OWNER_PRIVATE_KEY in .env file");
if (!process.env.SIGNER_PRIVATE_KEY)
  throw new Error("Please set SIGNER_PRIVATE_KEY in .env file");

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  namedAccounts: {
    deployer: {
      hardhat: 0,
      goerli: "privatekey://" + process.env.DEPLOYER_PRIVATE_KEY,
    },
    owner: {
      hardhat: 1,
      goerli: "privatekey://" + process.env.OWNER_PRIVATE_KEY,
    },
    signer: {
      hardhat: 2,
      goerli: "privatekey://" + process.env.SIGNER_PRIVATE_KEY,
    },
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY,
        process.env.OWNER_PRIVATE_KEY,
        process.env.SIGNER_PRIVATE_KEY,
      ],
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY ?? "",
    },
  },
};

export default config;
