import * as ethers from 'ethers';
import fs from 'fs';

const {parseReceipt, signReceipt} = require('./helpers');

require("dotenv").config();

const wsProvider = new ethers.providers.WebSocketProvider(
    `wss://goerli.infura.io/ws/v3/${process.env.INFURA_API_KEY}`,
);

const bridgeAbi = JSON.parse(fs.readFileSync('bridge.json').toString());

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, bridgeAbi, wsProvider);
const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY!);

console.log('Starting to listen events...');

contract.on("Sent", (receipt) => {
  signReceipt(ethers, receipt, signer).then((signed: string) => {
    console.log('Catched "Sent" event:', parseReceipt(receipt));
    console.log('\nSigned payload:', signed);
  });
});
