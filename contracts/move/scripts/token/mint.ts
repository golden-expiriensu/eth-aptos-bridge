import { HexString } from 'aptos';
import { argv } from 'process';

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

  await processTransaction(client, () => client.mint(account, account.address(), BigInt(argv[2])));
}

main().catch((e) => console.error(e));