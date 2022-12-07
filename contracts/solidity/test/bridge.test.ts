import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import hre, { deployments, ethers } from "hardhat";

import { TOKEN } from "../deploy/config";
import { parseReceipt, signReceipt } from "../helpers";
import { Bridge, Token } from "../typechain";

describe("Bridge tests", () => {
  let signer: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress;

  const chainA = 31337,
    chainB = 31337;

  let bridgeA: Bridge, bridgeB: Bridge;
  let tokenA: Token, tokenB: Token;

  const sendAmount = ethers.utils.parseUnits("1000", 6);

  beforeEach(async () => {
    const { signer: signerAddress, deployer: deployerAddress } =
      await hre.getNamedAccounts();
    signer = await ethers.getSigner(signerAddress);
    const deployer = await ethers.getSigner(deployerAddress);
    [, , , user1, user2] = await ethers.getSigners();

    await deployments.fixture("tests");

    bridgeA = await ethers.getContract("Bridge");
    tokenA = await ethers.getContract(TOKEN.name);

    bridgeB = bridgeA;
    tokenB = tokenA;

    await tokenA.connect(deployer).transfer(user1.address, sendAmount);
  });

  it("1. Should allow to bridge tokens", async () => {
    expect(await tokenA.balanceOf(user1.address), "1. Init balance U1").eq(
      sendAmount
    );
    expect(await tokenA.balanceOf(user2.address), "1. Init balance U2").eq(0);

    const sendTx = await bridgeA
      .connect(user1)
      .send(TOKEN.symbol, chainB, user2.address, sendAmount);

    expect(await tokenA.balanceOf(user1.address), "1. Send balance U1").eq(0);
    expect(await tokenA.balanceOf(user2.address), "1. Send balance U2").eq(0);

    const receipt = (await sendTx.wait()).events!.find(
      (e) => e.event === "Sent"
    )!.args![0];

    const signature = await signReceipt(receipt, signer);

    await bridgeB.connect(user2).claim(parseReceipt(receipt), signature);

    expect(await tokenB.balanceOf(user1.address), "1. Claim balance U1").eq(0);
    expect(await tokenB.balanceOf(user2.address), "1. Claim balance U2").eq(
      sendAmount
    );
  });

  it("2. Should allow to send tokens to non 20-byte addresses", async () => {
    const sendTx = await bridgeA
      .connect(user1)
      .send(TOKEN.symbol, chainB, ethers.constants.MaxUint256, sendAmount);

    const receipt = (await sendTx.wait()).events!.find(
      (e) => e.event === "Sent"
    )!.args![0];

    expect(receipt.to, "2. Receipt.to").eq(ethers.constants.MaxUint256);
  });
});
