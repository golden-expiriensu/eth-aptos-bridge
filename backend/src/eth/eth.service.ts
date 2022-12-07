import { signReceipt } from "@contracts/solidity/helpers";
import { Bridge, SentEvent } from "@contracts/solidity/typechain/Bridge";
import { Injectable } from "@nestjs/common";
import { Wallet } from "ethers";

import { createEthersBridgeSync } from "./helpers";

@Injectable()
export class EthService {
  private readonly signer: Wallet;

  constructor() {
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
    signReceipt(payload, this.signer).then((r) => console.log("signed:", r));
  }
}
