import { SentEvent } from '@contracts/solidity/typechain/Bridge'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { HexString } from 'aptos'
import { BigNumber } from 'ethers'
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm'

import { Receipt } from './entities'

@Injectable()
export class DBAccessService {
  constructor(
    @InjectRepository(Receipt)
    private readonly userRepository: Repository<Receipt>
  ) {}

  getReceipts(
    recipient: HexString,
    chainFrom: BigNumber | null = null,
    chainTo: BigNumber | null = null,
    isFullfiled: boolean | null = null
  ): Promise<Receipt[]> {
    const condition: FindOptionsWhere<Receipt> = { to: recipient.hex() };

    if (chainFrom) condition.chainFrom = chainFrom.toNumber();
    if (chainTo) condition.chainTo = chainTo.toNumber();
    if (typeof isFullfiled === "boolean") condition.isFullfiled = isFullfiled;

    console.log(condition);
    
    return this.userRepository.findBy(condition);
  }

  createReceipt(receipt: SentEvent["args"]["receipt"]): Promise<Receipt> {
    console.log({
      to: receipt.to,
      chainFrom: receipt.chainFrom.toString(),
      chainTo: receipt.chainTo.toString(),
      isFullfiled: false,
    })
    
    const userRecord = this.userRepository.create({
      from: receipt.from,
      to: receipt.to,
      tokenSymbol: receipt.tokenSymbol,
      amount: receipt.amount.toString(),
      chainFrom: receipt.chainFrom.toNumber(),
      chainTo: receipt.chainTo.toNumber(),
      nonce: receipt.nonce.toString(),
      isFullfiled: false,
    });

    return this.userRepository.save(userRecord);
  }

  fullfillReceipts(where: FindOptionsWhere<Receipt>): Promise<UpdateResult> {
    return this.userRepository.update(where, { isFullfiled: true });
  }
}
