import { HexString } from 'aptos'
import { CustomAptosAccount, TokenClient } from 'clients'
import { argv } from 'process'

require('dotenv').config()

async function main(moduleName: string, coinType: string) {
  const account = new CustomAptosAccount(process.env.PRIVATE_KEY!)
  const client = new TokenClient(process.env.NODE_URL!, moduleName, coinType, new HexString(process.env.TOKEN_ADDRESS!))

  console.log('balance:', await client.getBalance(account.address()))
}

main(argv[2], argv[3]).catch((e) => console.error(e))
