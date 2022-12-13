import { BigNumber } from 'ethers'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 66 })
  from: string

  @Column('varchar', { length: 66 })
  to: string

  @Column('varchar', { length: 16 })
  tokenSymbol: string

  @Column('numeric', { precision: 78, scale: 0 })
  amount: BigNumber

  @Column('numeric', { precision: 16, scale: 0 })
  chainFrom: number

  @Column('numeric', { precision: 16, scale: 0 })
  chainTo: number

  @Column('numeric', { precision: 78, scale: 0 })
  nonce: BigNumber

  @Column('boolean')
  isFullfilled: boolean
}
