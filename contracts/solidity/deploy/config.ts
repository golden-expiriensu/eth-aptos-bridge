import { ethers } from 'hardhat';

export const TOKEN = {
  name: "Tether",
  symbol: "USDT",
  decimals: 6,
  initialSupply: ethers.utils.parseEther("500000")
};
