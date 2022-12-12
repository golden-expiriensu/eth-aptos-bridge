import { HexString } from 'aptos'
import { BigNumber } from 'ethers'
import { Column, Entity, PrimaryColumn } from 'typeorm'

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

  @Column("numeric", { precision: 16, scale: 0 })
  chainFrom: number;

  @Column("numeric", { precision: 16, scale: 0 })
  chainTo: number;

  @Column("numeric", { precision: 78, scale: 0 })
  nonce: BigNumber;

  @Column("boolean")
  isFullfiled: boolean;
}
