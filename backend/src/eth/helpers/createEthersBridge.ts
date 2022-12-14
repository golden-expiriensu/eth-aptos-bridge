import * as deployment from '@contracts/solidity/deployments/sepolia/Bridge.json'
import { Bridge } from '@contracts/solidity/typechain/Bridge'
import { BaseContract, providers } from 'ethers'

export const createEthersBridgeSync = (wss: string): Bridge => {
  const ethWsProvider = new providers.WebSocketProvider(wss)

  return new BaseContract(deployment.address, deployment.abi, ethWsProvider) as Bridge
}
