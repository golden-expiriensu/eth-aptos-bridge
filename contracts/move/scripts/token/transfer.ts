import { HexString } from 'aptos';

import { CustomAptosAccount, TokenClient } from '../../types';
import { processTransaction, TOKEN_CONFIG } from './common';

require("dotenv").config();

async function main() {
  const account = new CustomAptosAccount(process.env.PRIVATE_KEY!);
  const client = new TokenClient(
    process.env.NODE_URL!,
    TOKEN_CONFIG.moduleName,
    TOKEN_CONFIG.phantomType,
    new HexString(process.env.TOKEN_ADDRESS!)
  );

  await processTransaction(client, () => client.transfer(account, account.address(), BigInt("0xf")));
}

main().catch((e) => console.error(e));