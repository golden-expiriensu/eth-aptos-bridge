import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DbAccessController } from './db-access.controller'
import { DBAccessService } from './db-access.service'
import { Receipt } from './entities'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER_NAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_BASE_NAME,
      entities: [Receipt],
      synchronize: Boolean(process.env.POSTGRES_SYNCHRONIZE || false),
    }),
    TypeOrmModule.forFeature([Receipt]),
  ],
  providers: [DBAccessService],
  controllers: [DbAccessController],
  exports: [DBAccessService],
})
export class DBAccessModule {}
