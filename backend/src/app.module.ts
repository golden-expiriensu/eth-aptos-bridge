import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DBAccessModule } from './db-access/db-access.module'
import { EthModule } from './eth/eth.module'

@Module({
  imports: [ConfigModule.forRoot(), DBAccessModule, EthModule],
})
export class AppModule {}
