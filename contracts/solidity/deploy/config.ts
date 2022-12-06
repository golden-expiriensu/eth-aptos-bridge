import { ethers } from "hardhat";

export const TOKEN = {
  name: "Tether",
  symbol: "USDT",
  decimals: 6,
  initialSupply: ethers.utils.parseUnits("500000", 6),
};
