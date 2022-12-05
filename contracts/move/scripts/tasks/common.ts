import { AptosAccount, AptosClient, HexString } from 'aptos';

export const createAptosAccount = (privateKey: string): AptosAccount => {
    const privateKeyHex = new HexString(privateKey);
    return new AptosAccount(privateKeyHex.toUint8Array());
}

export const processTransaction = async (client: AptosClient, handler: () => Promise<string>) => {
  try {
    const txHash = await handler();
    console.log(`Transaction ${txHash} submited successfully`);
    
    await client.waitForTransaction(txHash, { checkSuccess: true });
    console.log("Status: Success")
  } catch (err) {
    console.error("Status: Error");
    console.error(err);
  }
}
