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
    deployer: 0,
    owner: 1,
    signer: 2,
  },
  networks: {
    ropsen: {
      url: process.env.ROPSEN_URL || "",
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY,
        process.env.OWNER_PRIVATE_KEY,
        process.env.SIGNER_PRIVATE_KEY,
      ],
    },
    bscTestnet: {
      url: process.env.BCS_TESTNET_URL || "",
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY,
        process.env.OWNER_PRIVATE_KEY,
        process.env.SIGNER_PRIVATE_KEY,
      ],
    },
    polygonMumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY,
        process.env.OWNER_PRIVATE_KEY,
        process.env.SIGNER_PRIVATE_KEY,
      ],
    },
    avalancheFujiTestnet: {
      url: process.env.AVAX_FUJI || "",
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY,
        process.env.OWNER_PRIVATE_KEY,
        process.env.SIGNER_PRIVATE_KEY,
      ],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      ropsen: process.env.ETHERSCAN_API_KEY ?? "",
      bscTestnet: process.env.BSCSCAN_API_KEY ?? "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY ?? "",
      avalancheFujiTestnet: process.env.AVASCAN_API_KEY ?? "",
    },
  },
};

export default config;
