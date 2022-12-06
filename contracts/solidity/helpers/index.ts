import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { Address } from "hardhat-deploy/types";

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
    amount: receipt.amount,
    chainFrom: receipt.chainFrom,
    chainTo: receipt.chainTo,
    nonce: receipt.nonce,
  };
};

export const signReceipt = async (
  receipt: any,
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
