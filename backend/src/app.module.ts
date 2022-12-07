import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AptosModule } from "./aptos/aptos.module";
import { EthModule } from "./eth/eth.module";

@Module({
  imports: [ConfigModule.forRoot(), EthModule, AptosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
