import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { Bridge } from "../../typechain";
import { TOKEN } from "../config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;

  const { owner: ownerAddress } = await getNamedAccounts();
  const owner = await hre.ethers.getSigner(ownerAddress);
  const tokenAddress = (await ethers.getContract(TOKEN.name)).address;
  const bridge = await ethers.getContract<Bridge>("Bridge");

  await bridge.connect(owner).setTokenAddress(TOKEN.symbol, tokenAddress);
};

export default func;
func.tags = ["mainnet", "tests", "config"];
