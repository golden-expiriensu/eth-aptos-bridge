import { HexString } from "aptos";
import { BigNumber } from "ethers";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("receipts")
export class Receipt {
  @PrimaryColumn("bytea")
  to: HexString;

  @Column("bytea")
  from: HexString;

  @Column("varchar", { length: 16 })
  tokenSymbol: string;

  @Column("numeric", { precision: 78, scale: 0 })
  amount: BigNumber;

  @Column("bytea")
  chainFrom: HexString;

  @Column("bytea")
  chainTo: HexString;

  @Column("numeric", { precision: 78, scale: 0 })
  nonce: BigNumber;

  @Column('boolean')
  isFullfiled: boolean;
}
