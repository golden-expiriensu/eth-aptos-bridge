import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;

  const { deployer, owner, signer } = await getNamedAccounts();

  await deploy("Bridge", {
    from: deployer,
    args: [signer, owner],
    log: true,
  });
};

export default func;
func.tags = ["mainnet", "tests", "Bridge"];
