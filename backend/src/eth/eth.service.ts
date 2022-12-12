import { signReceipt } from '@contracts/solidity/helpers'
import { Bridge, SentEvent } from '@contracts/solidity/typechain/Bridge'
import { Injectable } from '@nestjs/common'
import { Wallet } from 'ethers'
import { DBAccessService } from 'src/db-access/db-access.service'

import { createEthersBridgeSync } from './helpers'

@Injectable()
export class EthService {
  private readonly signer: Wallet;

  constructor(private dbAccessSevice: DBAccessService) {
    this.signer = new Wallet(process.env.ETH_SIGNER_PRIVATE_KEY!);
    const bridge: Bridge = createEthersBridgeSync(process.env.ETH_WS!);

    bridge.on(bridge.filters.Sent(), (payload) =>
      this.handleSentEvent(payload)
    );
  }

  signReceipt(receipt: SentEvent["args"]["receipt"]): Promise<string> {
    return signReceipt(receipt, this.signer);
  }

  handleSentEvent(payload: SentEvent["args"]["receipt"]): void {
    this.dbAccessSevice.createReceipt(payload);
  }
}
