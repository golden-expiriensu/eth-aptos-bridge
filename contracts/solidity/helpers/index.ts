import { BigNumber, Signer } from 'ethers'
import * as ethers from 'ethers'
import { Address } from 'hardhat-deploy/types'

export type Receipt = {
  from: Address;
  to: Address;
  tokenSymbol: string;
  amount: BigNumber;
  chainFrom: BigNumber;
  chainTo: BigNumber;
  nonce: BigNumber;
};

export const parseReceipt = (receipt: any): Receipt => {
  return {
    from: receipt.from,
    to: receipt.to,
    tokenSymbol: receipt.tokenSymbol,
    amount: BigNumber.from(receipt.amount),
    chainFrom: BigNumber.from(receipt.chainFrom),
    chainTo: BigNumber.from(receipt.chainTo),
    nonce: BigNumber.from(receipt.nonce),
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
