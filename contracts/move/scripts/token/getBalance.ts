import { AptosAccount, HexString } from 'aptos';

import { TokenClient } from '../../types';
import { TOKEN_CONFIG } from './config';

require("dotenv").config();

async function main() {
  const privateKey = new HexString(process.env.PRIVATE_KEY!);
  
  const account = new AptosAccount(privateKey.toUint8Array());
  const client = new TokenClient(
    process.env.NODE_URL!,
    TOKEN_CONFIG.moduleName,
    TOKEN_CONFIG.phantomType,
    new HexString(process.env.TOKEN_ADDRESS!)
  );

  console.log("balance:", await client.getBalance(account.address()));
}

main().catch((e) => console.error(e));