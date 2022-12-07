import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AptosModule } from "./aptos/aptos.module";
import { DBAccessModule } from "./db-access/db-access.module";
import { DBAccessService } from "./db-access/db-access.service";
import { EthModule } from "./eth/eth.module";

@Module({
  imports: [ConfigModule.forRoot(), EthModule, AptosModule, DBAccessModule],
  controllers: [AppController],
  providers: [AppService, DBAccessService],
})
export class AppModule {}
