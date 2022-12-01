module.exports.parseReceipt = (receipt) => {
    return {
        from: receipt.from,
        to: receipt.to,
        tokenName: receipt.tokenName,
        amount: receipt.amount,
        chainFrom: receipt.chainFrom,
        chainTo: receipt.chainTo,
        nonce: receipt.nonce,
    };
}

module.exports.signReceipt = async (ethers, receipt, signer) => {
    const message = ethers.utils.solidityPack([
        "address",
        "address",
        "string",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
    ], [
        receipt.from,
        receipt.to,
        receipt.tokenName,
        receipt.amount,
        receipt.chainFrom,
        receipt.chainTo,
        receipt.nonce,
    ]);

    const hash = ethers.utils.keccak256(ethers.utils.arrayify(message));

    return signer.signMessage(ethers.utils.arrayify(hash));
}