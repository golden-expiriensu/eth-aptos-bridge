import { AptosAccount, HexString } from 'aptos';
import { argv } from 'process';

import { TokenClient } from '../types';

require("dotenv").config();

async function main() {
  const privateKey = new HexString(process.env.PRIVATE_KEY!);
  
  const account = new AptosAccount(privateKey.toUint8Array());
  const client = new TokenClient(process.env.NODE_URL!, "BrandNewToken", "Token", account.address());

  const txnHash = await client.mint(account, account.address(), BigInt(argv[2]));
  await client.waitForTransaction(txnHash, { checkSuccess: true });
  
  console.log("Success");
}

main().catch((e) => console.error(e));