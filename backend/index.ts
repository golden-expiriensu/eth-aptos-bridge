import { HexString } from 'aptos';
import * as ethers from 'ethers';

import {
  createAptosAccount,
  processTransaction,
} from '../contracts/move/scripts/tasks/common';
import { BridgeClient, TokenClient } from '../contracts/move/types';
import { parseReceipt, signReceipt } from './helpers';
import { createEthersBridgeSync } from './helpers/createEthersBridge';

require("dotenv").config();

const ethBridge = createEthersBridgeSync(process.env.ETH_WS!);
const ethSigner = new ethers.Wallet(process.env.ETH_SIGNER_PRIVATE_KEY!);

const aptosBridge = new BridgeClient(
  process.env.APTOS_URL!,
  "Bridge",
  new HexString(process.env.APTOS_BRIDGE_ADDRESS!)
);
const aptosToken = new TokenClient(
  process.env.APTOS_URL!,
  "PlatformToken",
  `${process.env.APTOS_TOKEN_ADDRESS}::SupportedTokens::USDT`,
  new HexString(process.env.APTOS_TOKEN_ADDRESS!)
);
const aptosSigner = createAptosAccount(process.env.APTOS_SIGNER_PRIVATE_KEY!);

console.log(`Starting to listen events at ${ethBridge.address} ...`);

ethBridge.on("Sent", async (receipt: any) => {
  console.log('Catched "Sent" event:', parseReceipt(receipt));

  console.log(`Signed event: ${await signReceipt(receipt, ethSigner)}`);

  await processTransaction(aptosBridge, () =>
    aptosBridge.creditUser(
      aptosSigner,
      aptosToken,
      new HexString(receipt.to),
      ethers.BigNumber.from(receipt.amount).mul(1e3).toString()
    )
  );
});
