import { HexString } from 'aptos'
import { CustomAptosAccount, TokenClient } from 'clients'
import { argv } from 'process'
import { processTransaction } from 'scripts/common'

require('dotenv').config()

async function main(moduleName: string, coinType: string) {
  const account = new CustomAptosAccount(process.env.PRIVATE_KEY!)
  const client = new TokenClient(process.env.NODE_URL!, moduleName, coinType, new HexString(process.env.TOKEN_ADDRESS!))

  await processTransaction(client, () => client.transfer(account, account.address(), BigInt('0xf')))
}

main(argv[2], argv[3]).catch((e) => console.error(e))
