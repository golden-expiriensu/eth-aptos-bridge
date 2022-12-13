import { Signer } from 'ethers'
import * as ethers from 'ethers'
import { Address } from 'hardhat-deploy/types'

export type Receipt = {
  from: Address;
  to: Address;
  tokenSymbol: string;
  amount: string;
  chainFrom: number;
  chainTo: number;
  nonce: string;
};

export const parseReceipt = (receipt: any): Receipt => {
  return {
    from: String(receipt.from).toLowerCase(),
    to: String(receipt.to).toLowerCase(),
    tokenSymbol: receipt.tokenSymbol,
    amount: receipt.amount,
    chainFrom: receipt.chainFrom,
    chainTo: receipt.chainTo,
    nonce: receipt.nonce,
  };
};

export const signReceipt = async (
  receipt: Receipt,
  signer: Signer
): Promise<string> => {
  const message = ethers.utils.solidityPack(
    [
      "address",
      "address",
      "string",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
    ],
    [
      receipt.from,
      receipt.to,
      receipt.tokenSymbol,
      receipt.amount,
      receipt.chainFrom,
      receipt.chainTo,
      receipt.nonce,
    ]
  );

  const hash = ethers.utils.keccak256(ethers.utils.arrayify(message));

  return signer.signMessage(ethers.utils.arrayify(hash));
};
