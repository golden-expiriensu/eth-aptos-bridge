import { HexString } from 'aptos';

import { CustomAptosAccount, TokenClient } from '../../types';
import { TOKEN_CONFIG } from './common';

require("dotenv").config();

async function main() {
  const account = new CustomAptosAccount(process.env.PRIVATE_KEY!);
  const client = new TokenClient(
    process.env.NODE_URL!,
    TOKEN_CONFIG.moduleName,
    TOKEN_CONFIG.phantomType,
    new HexString(process.env.TOKEN_ADDRESS!)
  );

  console.log("balance:", await client.getBalance(account.address()));
}

main().catch((e) => console.error(e));