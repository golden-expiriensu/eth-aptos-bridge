import { AptosAccount, AptosClient, HexString, MaybeHexString } from 'aptos'

export class TokenClient extends AptosClient {
  constructor(
    nodeUrl: string,
    private moduleName: string,
    public phantomType: string,
    private moduleAddress: HexString,
  ) {
    super(nodeUrl)
  }

  async initialize(
    owner: AptosAccount,
    name: string,
    symbol: string,
    decimals: number,
    initialSupply: bigint | number,
  ): Promise<string> {
    const rawTxn = await this.generateTransaction(owner.address(), {
      function: `${this.moduleAddress.hex()}::${this.moduleName}::initialize`,
      type_arguments: [this.phantomType],
      arguments: [name, symbol, decimals, initialSupply],
    })

    const bcsTxn = await this.signTransaction(owner, rawTxn)
    const pendingTxn = await this.submitTransaction(bcsTxn)

    return pendingTxn.hash
  }

  async transfer(from: AptosAccount, to: HexString, amount: number | bigint): Promise<string> {
    const rawTxn = await this.generateTransaction(from.address(), {
      function: '0x1::coin::transfer',
      type_arguments: [this.phantomType],
      arguments: [to.hex(), amount],
    })

    const bcsTxn = await this.signTransaction(from, rawTxn)
    const pendingTxn = await this.submitTransaction(bcsTxn)

    return pendingTxn.hash
  }

  async getBalance(accountAddress: MaybeHexString): Promise<string | number> {
    try {
      const resource = await this.getAccountResource(accountAddress, `0x1::coin::CoinStore<${this.phantomType}>`)

      return parseInt((resource.data as any)['coin']['value'])
    } catch (e) {
      console.error(e)
      return 0
    }
  }
}
