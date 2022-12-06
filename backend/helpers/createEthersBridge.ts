import { ethers } from "ethers";
import { existsSync, readFileSync } from "fs";

export const createEthersBridgeSync = (wss: string): ethers.Contract => {
  const ethWsProvider = new ethers.providers.WebSocketProvider(wss);

  const artifactPath =
    "../contracts/solidity/artifacts/contracts/Bridge.sol/Bridge.json";
  const deploymentPath = "../contracts/solidity/deployments/goerli/Bridge.json";

  if (!existsSync(artifactPath)) {
    throw new Error(
      `File ${artifactPath} does not exists, compile solidity contracts or change abi path`
    );
  }

  const artifact = JSON.parse(readFileSync(artifactPath).toString());
  const deployment = JSON.parse(readFileSync(deploymentPath).toString());

  return new ethers.Contract(deployment.address, artifact.abi, ethWsProvider);
};
