import { HexString } from "aptos";
import { argv } from "process";

import { CustomAptosAccount, TokenClient } from "../../../clients";
import { processTransaction } from "../common";

require("dotenv").config();

async function main(
  moduleName: string,
  coinType: string,
  name: string,
  symbol: string,
  decimals: number,
  initialSupply: bigint
) {
  const account = new CustomAptosAccount(process.env.PRIVATE_KEY!);
  const client = new TokenClient(
    process.env.NODE_URL!,
    moduleName,
    coinType,
    new HexString(process.env.TOKEN_ADDRESS!)
  );

  await processTransaction(client, () =>
    client.initialize(account, name, symbol, decimals, initialSupply)
  );
}

main(
  argv[2],
  argv[3],
  argv[4],
  argv[5],
  Number(argv[6]),
  BigInt(argv[7])
).catch((e) => console.error(e));
