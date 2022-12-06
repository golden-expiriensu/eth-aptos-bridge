import { AptosAccount, AptosClient, HexString } from 'aptos';

import { TokenClient } from './tokenClient';

export class BridgeClient extends AptosClient {
  constructor(
    nodeUrl: string,
    private moduleName: string,
    private moduleAddress: HexString
  ) {
    super(nodeUrl);
  }

  async initialize(
    owner: AptosAccount,
    feeE12: number,
    treasure: HexString
  ): Promise<string> {
    const rawTxn = await this.generateTransaction(owner.address(), {
      function: `${this.moduleAddress.hex()}::${this.moduleName}::initialize`,
      type_arguments: [],
      arguments: [feeE12, treasure],
    });

    const bcsTxn = await this.signTransaction(owner, rawTxn);
    const pendingTxn = await this.submitTransaction(bcsTxn);

    return pendingTxn.hash;
  }

  async addTokenSupport(
    owner: AptosAccount,
    token: TokenClient
  ): Promise<string> {
    const rawTxn = await this.generateTransaction(owner.address(), {
      function: `${this.moduleAddress.hex()}::${
        this.moduleName
      }::add_token_support`,
      type_arguments: [token.phantomType],
      arguments: [],
    });

    const bcsTxn = await this.signTransaction(owner, rawTxn);
    const pendingTxn = await this.submitTransaction(bcsTxn);

    return pendingTxn.hash;
  }

  async creditUser(
    owner: AptosAccount,
    token: TokenClient,
    user: HexString,
    amount: bigint | string
  ): Promise<string> {
    const rawTxn = await this.generateTransaction(owner.address(), {
      function: `${this.moduleAddress.hex()}::${this.moduleName}::credit_user`,
      type_arguments: [token.phantomType],
      arguments: [user.hex(), amount],
    });

    const bcsTxn = await this.signTransaction(owner, rawTxn);
    const pendingTxn = await this.submitTransaction(bcsTxn);

    return pendingTxn.hash;
  }
}
