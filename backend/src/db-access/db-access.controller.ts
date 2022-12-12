import { Controller, Get, Param } from "@nestjs/common";
import { HexString } from "aptos";
import { BigNumber } from "ethers";

import { DBAccessService } from "./db-access.service";
import { Receipt } from "./entities";

@Controller("db-access")
export class DbAccessController {
  constructor(private readonly dbAccessSevice: DBAccessService) {}

  @Get("/:user/:chainFrom/:chainTo/:isFullfiled")
  getReceipts(
    @Param("user") user: string,
    @Param("chainFrom") chainFrom: number | null,
    @Param("chainTo") chainTo: number | null,
    @Param("isFullfiled") isFullfiled: boolean | null
  ): Promise<Receipt[]> {
    return this.dbAccessSevice.getReceipts(
      new HexString(user),
      BigNumber.from(chainFrom),
      BigNumber.from(chainTo),
      isFullfiled
    );
  }
}
