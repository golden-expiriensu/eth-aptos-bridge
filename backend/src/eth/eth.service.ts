import { parseReceipt, signReceipt } from '@contracts/solidity/helpers'
import { Bridge, SentEvent } from '@contracts/solidity/typechain/Bridge'
import { Injectable } from '@nestjs/common'
import { Wallet } from 'ethers'
import { AptosService } from 'src/aptos/aptos.service'
import { DBAccessService } from 'src/db-access/db-access.service'

import { createEthersBridgeSync } from './helpers'

@Injectable()
export class EthService {
  private readonly signer: Wallet

  constructor(private dbAccessSevice: DBAccessService, private aptosService: AptosService) {
    this.signer = new Wallet(process.env.ETH_SIGNER_PRIVATE_KEY!)
    const bridge: Bridge = createEthersBridgeSync(process.env.ETH_WS!)

    bridge.on(bridge.filters.Sent(), (payload) => this.handleSentEvent(payload))
  }

  async signReceipt(receiptId: string): Promise<string> {
    const receipt = await this.dbAccessSevice.getReceiptsById(receiptId)

    return signReceipt(parseReceipt(receipt), this.signer)
  }

  handleSentEvent(payload: SentEvent['args']['receipt']): Promise<string> {
    this.dbAccessSevice.createReceipt(payload)

    if (this.aptosService.isAptosAddress(payload.to) && this.aptosService.isAptosChainId(payload.chainTo)) {
      return this.aptosService.handleEvmReceipt(payload)
    }
  }
}
