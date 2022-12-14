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
  private sentEventsNonce: number = 0
  private claimEventsNonce: number = 0

  private readonly bridgeClient: BridgeClient
  private readonly tokenClient: TokenClient
  private readonly ownerAccount: CustomAptosAccount

  constructor(private readonly dbAccessSevice: DBAccessService) {
    this.bridgeClient = new BridgeClient(
      process.env.APTOS_ENDPOINT!,
      'Bridge',
      new HexString(process.env.APTOS_PLATFORM!),
    )
    this.tokenClient = new TokenClient(
      process.env.APTOS_ENDPOINT!,
      'PlatformToken',
      `${process.env.APTOS_PLATFORM!}::SupportedTokens::USDT`, // TODO: multiple token support
      new HexString(process.env.APTOS_PLATFORM!),
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
    console.log(`Fetched ${(await this.fetchSentEvents()).length} sent events...`)
    console.log(`Fetched ${await this.fetchClaimEvents()} claim events...`)

    await new Promise((r) => setTimeout(r, 5000))

    await this.startFetchingEvents()
  }

  private async fetchSentEvents(): Promise<Receipt[]> {
    const events = await this.bridgeClient.getEventsByEventHandle(
      // TODO: move to bridge client
      new HexString(this.bridgeClient.moduleAddress.hex()),
      `${this.bridgeClient.moduleAddress.hex()}::${this.bridgeClient.moduleName}::Config`,
      'send_event_handle',
      {
        start: this.sentEventsNonce,
      },
    )

    if (events.length === 0) return []

    const last = events.length - 1
    this.sentEventsNonce = Number(events[last].sequence_number) + 1

    const chainId = (events as any).__headers['x-aptos-chain-id']

    const receipts = events.map((e) => {
      return {
        from: this.padLeftZeros64(e.data.from),
        to: e.data.to.length === 42 ? e.data.to : this.padLeftZeros64(e.data.to),
        tokenSymbol: e.data.token_symbol,
        amount: e.data.amount,
        chainFrom: chainId,
        chainTo: e.data.to_chain,
        nonce: e.sequence_number,
      }
    })

    return this.dbAccessSevice.createReceipts(receipts)
  }

  private async fetchClaimEvents(): Promise<number> {
    const events = await this.bridgeClient.getEventsByEventHandle(
      // TODO: move to bridge client
      new HexString(this.bridgeClient.moduleAddress.hex()),
      `${this.bridgeClient.moduleAddress.hex()}::${this.bridgeClient.moduleName}::Config`,
      'claim_event_handle',
      {
        start: this.claimEventsNonce,
      },
    )

    if (events.length === 0) return 0

    const last = events.length - 1
    this.claimEventsNonce = Number(events[last].sequence_number) + 1

    for (const event of events) {
      this.dbAccessSevice.fullfillReceipts({ to: this.padLeftZeros64(event.data.claimee) })
    }

    return events.length
  }

  private padLeftZeros64(address: string): string {
    const rawAddress = address.substring(2)
    const zerosCount = 64 - rawAddress.length

    return `0x${'0'.repeat(zerosCount)}${rawAddress}`
  }
}
