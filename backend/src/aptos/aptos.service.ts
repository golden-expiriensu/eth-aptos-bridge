import { BridgeClient, CustomAptosAccount, TokenClient } from '@contracts/move/clients'
import { processTransaction } from '@contracts/move/scripts/common'
import { SentEvent } from '@contracts/solidity/typechain/Bridge'
import { Injectable } from '@nestjs/common'
import { HexString } from 'aptos'
import { BigNumber } from 'ethers'
import { DBAccessService } from 'src/db-access/db-access.service'
import { Receipt } from 'src/db-access/entities'

@Injectable()
export class AptosService {
  private eventsQueryStart: number = 0

  private readonly bridgeClient: BridgeClient
  private readonly tokenClient: TokenClient
  private readonly ownerAccount: CustomAptosAccount

  constructor(private readonly dbAccessSevice: DBAccessService) {
    this.bridgeClient = new BridgeClient(
      process.env.APTOS_ENDPOINT!,
      'Bridge',
      new HexString(process.env.APTOS_BRIDGE_ADDRESS!),
    )
    this.tokenClient = new TokenClient(
      process.env.APTOS_ENDPOINT!,
      'PlatformToken',
      `${process.env.APTOS_TOKEN_ADDRESS!}::SupportedTokens::USDT`, // TODO: multiple token support
      new HexString(process.env.APTOS_TOKEN_ADDRESS!),
    )

    this.ownerAccount = new CustomAptosAccount(process.env.APTOS_SIGNER_PRIVATE_KEY!)

    this.startFetchingEvents()
  }

  handleEvmReceipt(payload: SentEvent['args']['receipt']): Promise<string> {
    const handler = this.bridgeClient.creditUser(
      this.ownerAccount,
      this.tokenClient,
      new HexString(payload.to),
      payload.amount.toString(), // TODO: calculate decimals
    )

    return processTransaction(this.bridgeClient, () => handler)
  }

  isAptosChainId(chainId: number | BigNumber): boolean {
    return [1, 2, 39].includes(Number(chainId))
  }

  isAptosAddress(str: string): boolean {
    return str.length === 66
  }

  private async startFetchingEvents(): Promise<void> {
    console.log(`Fetched ${(await this.fetchNewEventsAndWriteNewOnesToDB()).length} events...`)
    await new Promise((r) => setTimeout(r, 5000))

    await this.startFetchingEvents()
  }

  private async fetchNewEventsAndWriteNewOnesToDB(): Promise<Receipt[]> {
    const events = await this.bridgeClient.getEventsByEventHandle(
      // TODO: move to bridge client
      new HexString(this.bridgeClient.moduleAddress.hex()),
      `${this.bridgeClient.moduleAddress.hex()}::${this.bridgeClient.moduleName}::Config`,
      'swap_event_handle',
      {
        start: this.eventsQueryStart,
      },
    )

    if (events.length === 0) return []

    const last = events.length - 1
    this.eventsQueryStart = Number(events[last].sequence_number) + 1

    const chainId = BigNumber.from((events as any).__headers['x-aptos-chain-id'])

    const sentEvents = events.map((e) => {
      return {
        from: e.data.from,
        to: e.data.to,
        tokenSymbol: e.data.token_symbol,
        amount: BigNumber.from(e.data.amount),
        chainFrom: chainId,
        chainTo: BigNumber.from(e.data.to_chain),
        nonce: BigNumber.from(e.sequence_number),
      } as SentEvent['args']['receipt']
    })

    return this.dbAccessSevice.createReceipts(sentEvents)
  }
}
