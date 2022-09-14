const ethers = require('ethers');
const usdtABI = require('./usdtABI.json');
require('dotenv').config();

async function ethereum() {
  //const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  const usdtContractAddress = process.env.USDT_ERC20_TOKEN_CONTRACT;
  const provider = new ethers.providers.WebSocketProvider(`${process.env.ALCHEMY_WEBSOCKET_URL}${process.env.ALCHEMY_API_KEY}`);
  const contract = new ethers.Contract(usdtContractAddress, usdtABI, provider);
  contract.on("Transfer", (from, to, value, event) => {
    let info = {
      from: from,
      to: to,
      value: ethers.utils.formatUnits(value, 6),   // только для юсдт на эфире, для бнб беп здесь будет 18
      data: event
    };
    console.log(JSON.stringify(info, null, 4))
  })
}

async function bnbchain() {
  const usdtContractAddress = process.env.USDT_BEP20_TOKEN_CONTRACT;
  const provider =await  new ethers.providers.WebSocketProvider(`${process.env.CHAINSTACK_WEBSOCKET_URL}${process.env.CHAINSTACK_API_KEY}`);
  const contract = await new ethers.Contract(usdtContractAddress, usdtABI, provider);
  try {
    await contract.on("Transfer", (from, to, value, event) => {
    let info = {
      from: from,
      to: to,
      value: ethers.utils.formatUnits(value, 18),   // только для юсдт на эфире, для бнб беп здесь будет 18
      data: event
    };
    console.log(JSON.stringify(info, null, 4))
  })
  } catch (e) {
    console.log(e)
  }
}

// ethereum();
bnbchain()
  .catch((e)=>{
    console.log(e)
  })









// async function main() {
//   const provider = new ethers.providers.InfuraProvider('rinkeby', process.env.PROJECT_ID);
//   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//   const usdtContract = new ethers.Contract(process.env.USDT_CONTRACT, usdtABI, wallet);
//   const balance = await usdtContract.balanceOf(process.env.ACCOUNT);
//   console.log(balance.toString());
// }
