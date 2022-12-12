import { parseReceipt } from '@contracts/solidity/helpers'
import { SentEvent } from '@contracts/solidity/typechain/Bridge'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { HexString } from 'aptos'
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm'

import { Receipt } from './entities'

@Injectable()
export class DBAccessService {
  constructor(
    @InjectRepository(Receipt)
    private readonly userRepository: Repository<Receipt>
  ) {}

  getReceiptsById(id: string): Promise<Receipt> {
    return this.userRepository.findOneBy({ id });
  }

  getReceiptsByRecipient(recipient: HexString): Promise<Receipt[]> {
    return this.userRepository.findBy({ to: recipient.hex() });
  }

  createReceipt(receipt: SentEvent["args"]["receipt"]): Promise<Receipt> {
    const userRecord = this.userRepository.create(parseReceipt(receipt));

    return this.userRepository.save(userRecord);
  }

  createReceipts(receipts: SentEvent["args"]["receipt"][]): Promise<Receipt[]> {
    const userRecord = this.userRepository.create(
      receipts.map((r) => parseReceipt(r))
    );

    return this.userRepository.save(userRecord);
  }

  fullfillReceipts(
    where: FindOptionsWhere<Receipt>,
    txHash: HexString
  ): Promise<UpdateResult> {
    return this.userRepository.update(where, { claimTx: txHash.hex() });
  }
}
