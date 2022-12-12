import { Controller, Get, Param } from '@nestjs/common'
import { HexString } from 'aptos'

import { DBAccessService } from './db-access.service'
import { Receipt } from './entities'

@Controller("receipts")
export class DbAccessController {
  constructor(private readonly dbAccessSevice: DBAccessService) {}

  @Get("/:user")
  getReceipts(@Param("user") user: string): Promise<Receipt[]> {
    return this.dbAccessSevice.getReceiptsByRecipient(new HexString(user));
  }
}
