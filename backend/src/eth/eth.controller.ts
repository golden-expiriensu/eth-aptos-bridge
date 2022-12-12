import { Controller, Get, Param } from '@nestjs/common'

import { EthService } from './eth.service'

@Controller('signature')
export class EthController {
  constructor(private readonly ethService: EthService) {}

  @Get(':receiptId')
  getSignature(@Param('receiptId') receiptId: string): Promise<string> {
    return this.ethService.signReceipt(receiptId)
  }
}
