import { ethers } from 'hardhat';

export const TOKEN = {
  name: "Tether",
  symbol: "USDT",
  initialSupply: ethers.utils.parseEther("500000")
};
