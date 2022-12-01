import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { TOKEN } from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;

  const { deployer } = await getNamedAccounts();
  const owner = (await ethers.getContract("Bridge")).address;

  await deploy(TOKEN.name, {
    contract: "Token",
    from: deployer,
    args: [TOKEN.name, TOKEN.symbol, TOKEN.initialSupply, deployer, owner],
    log: true,
  });
};

export default func;
func.tags = ["mainnet", "tests", "Token"];
