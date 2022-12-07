import {
  BridgeClient,
  CustomAptosAccount,
  TokenClient,
} from "@contracts/move/clients";
import { processTransaction } from "@contracts/move/scripts/common";
import { SentEvent } from "@contracts/solidity/typechain/Bridge";
import { Injectable } from "@nestjs/common";
import { HexString } from "aptos";
import { BigNumber } from "ethers";

@Injectable()
export class AptosService {
  private readonly bridgeClient: BridgeClient;
  private readonly tokenClient: TokenClient;
  private readonly ownerAccount: CustomAptosAccount;

  constructor() {
    this.bridgeClient = new BridgeClient(
      process.env.APTOS_ENDPOINT!,
      "Bridge",
      new HexString(process.env.APTOS_BRIDGE_ADDRESS!)
    );
    this.tokenClient = new TokenClient(
      process.env.APTOS_ENDPOINT!,
      "PlatformToken",
      `${process.env.APTOS_TOKEN_ADDRESS!}::SupportedTokens::USDT`, // TODO: multiple token support
      new HexString(process.env.APTOS_TOKEN_ADDRESS!)
    );

    this.ownerAccount = new CustomAptosAccount(
      process.env.APTOS_SIGNER_PRIVATE_KEY!
    );
  }

  handleEvmReceipt(payload: SentEvent["args"]["receipt"]): Promise<void> {
    const handler = this.bridgeClient.creditUser(
      this.ownerAccount,
      this.tokenClient,
      new HexString(payload.to),
      payload.amount.mul(3).toString() // TODO: refactor
    );

    return processTransaction(this.bridgeClient, () => handler);
  }

  isAptosChainId(chainId: number | BigNumber): boolean {
    return [1, 2, 39].includes(Number(chainId));
  }

  isAptosAddress(str: string): boolean {
    return str.length === 66;
  }
}
