import { Module } from "@nestjs/common";
import { AptosService } from "./aptos.service";

@Module({
  providers: [AptosService],
})
export class AptosModule {}
