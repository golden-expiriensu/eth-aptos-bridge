import { HexString } from 'aptos';
import { argv } from 'process';

import { CustomAptosAccount, TokenClient } from '../../../types';
import { processTransaction } from '../common';

require("dotenv").config();

async function main(moduleName: string, phantomType: string) {
  const account = new CustomAptosAccount(process.env.PRIVATE_KEY!);
  const client = new TokenClient(
    process.env.NODE_URL!,
    moduleName,
    phantomType,
    new HexString(process.env.TOKEN_ADDRESS!)
  );

  await processTransaction(client, () => client.mint(account, account.address(), BigInt(argv[4])));
}

main(argv[2], argv[3]).catch((e) => console.error(e));