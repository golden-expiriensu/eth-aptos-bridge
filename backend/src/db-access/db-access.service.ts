import { SentEvent } from "@contracts/solidity/typechain/Bridge";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HexString } from "aptos";
import { FindOptionsWhere, Repository, UpdateResult } from "typeorm";

import { Receipt } from "./entities";

@Injectable()
export class DBAccessService {
  constructor(
    @InjectRepository(Receipt)
    private readonly userRepository: Repository<Receipt>
  ) {}

  getReceipts(recipient: HexString): Promise<Receipt[]> {
    return this.userRepository.findBy({ to: recipient.hex() });
  }

  createReceipt(receipt: SentEvent["args"]["receipt"]): Promise<Receipt> {
    const userRecord = this.userRepository.create({
      from: receipt.from,
      to: receipt.to,
      tokenSymbol: receipt.tokenSymbol,
      amount: receipt.amount.toString(),
      chainFrom: receipt.chainFrom.toNumber(),
      chainTo: receipt.chainTo.toNumber(),
      nonce: receipt.nonce.toString(),
    });

    return this.userRepository.save(userRecord);
  }

  fullfillReceipts(
    where: FindOptionsWhere<Receipt>,
    txHash: HexString
  ): Promise<UpdateResult> {
    return this.userRepository.update(where, { claimTx: txHash.hex() });
  }
}
