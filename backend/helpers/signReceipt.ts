import * as ethers from "ethers";

type Receipt = {
  from: string;
  to: string;
  tokenName: string;
  amount: ethers.BigNumber;
  chainFrom: ethers.BigNumber;
  chainTo: ethers.BigNumber;
  nonce: ethers.BigNumber;
};

export const parseReceipt = (receipt: Receipt) => {
  return {
    from: receipt.from,
    to: receipt.to,
    tokenName: receipt.tokenName,
    amount: receipt.amount,
    chainFrom: receipt.chainFrom,
    chainTo: receipt.chainTo,
    nonce: receipt.nonce,
  };
};

export const signReceipt = async (receipt: Receipt, signer: ethers.Signer) => {
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
      receipt.tokenName,
      receipt.amount,
      receipt.chainFrom,
      receipt.chainTo,
      receipt.nonce,
    ]
  );

  const hash = ethers.utils.keccak256(ethers.utils.arrayify(message));

  return signer.signMessage(ethers.utils.arrayify(hash));
};
