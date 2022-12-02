import { AptosAccount, AptosClient, HexString, MaybeHexString } from 'aptos';

export class TokenClient extends AptosClient {
    private coinType: string;
      
    constructor(
      nodeUrl: string,
      private coinModuleName: string,
      coinPhantomType: string,
      private coinModuleAddress: HexString
    ) {
      super(nodeUrl);
      this.coinType = `${coinModuleAddress.hex()}::${coinModuleName}::${coinPhantomType}`;
    }
  
    async register(signer: AptosAccount): Promise<string> {
      const rawTxn = await this.generateTransaction(signer.address(), {
        function: `${this.coinModuleAddress.hex()}::${this.coinModuleName}::register`,
        type_arguments: [],
        arguments: [],
      });
  
      const bcsTxn = await this.signTransaction(signer, rawTxn);
      const pendingTxn = await this.submitTransaction(bcsTxn);
  
      return pendingTxn.hash;
    }
  
    async mint(minter: AptosAccount, receiverAddress: HexString, amount: number | bigint): Promise<string> {
      const rawTxn = await this.generateTransaction(minter.address(), {
        function: `${this.coinModuleAddress.hex()}::${this.coinModuleName}::mint`,
        type_arguments: [],
        arguments: [receiverAddress.hex(), amount],
      });
  
      const bcsTxn = await this.signTransaction(minter, rawTxn);
      const pendingTxn = await this.submitTransaction(bcsTxn);
  
      return pendingTxn.hash;
    }

    async transfer(from: AptosAccount, to: HexString, amount: number | bigint): Promise<string> {
      const rawTxn = await this.generateTransaction(from.address(), {
        function: "0x1::coin::transfer",
        type_arguments: [this.coinType],
        arguments: [to.hex(), amount],
      });
  
      const bcsTxn = await this.signTransaction(from, rawTxn);
      const pendingTxn = await this.submitTransaction(bcsTxn);
  
      return pendingTxn.hash;
    }
  
    async getBalance(accountAddress: MaybeHexString): Promise<string | number> {
      try {
        const resource = await this.getAccountResource(
          accountAddress,
          `0x1::coin::CoinStore<${this.coinType}>`,
        );
  
        return parseInt((resource.data as any)["coin"]["value"]);
      } catch (e) {
        console.error(e);
        return 0;
      }
    }
  }