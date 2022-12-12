import { Module } from '@nestjs/common'
import { AptosService } from 'src/aptos/aptos.service'

import { EthService } from './eth.service'
import { EthController } from './eth.controller'

@Module({
  providers: [EthService, AptosService],
  controllers: [EthController],
})
export class EthModule {}
