import { Module } from "@nestjs/common";
import { AptosService } from "src/aptos/aptos.service";

import { EthService } from "./eth.service";

@Module({
  providers: [EthService, AptosService],
})
export class EthModule {}
