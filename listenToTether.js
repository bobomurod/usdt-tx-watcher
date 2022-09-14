const ethers = require('ethers');
const usdtABI = require('./usdtABI.json');
const MongoClient = require('mongodb').MongoClient
require('dotenv').config();
let mongoUrl = process.env.MONGO_URL;
console.log(mongoUrl)
let documentCount = 0;
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
      let db, client;

(
    async () => {
      client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db('usdt');
    }
)()

async function bnbchain() {
  let db;
  let client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  const usdtContractAddress = process.env.USDT_BEP20_TOKEN_CONTRACT;
  const provider =await  new ethers.providers.WebSocketProvider(`${process.env.CHAINSTACK_WEBSOCKET_URL}${process.env.CHAINSTACK_API_KEY}`);
  const contract = await new ethers.Contract(usdtContractAddress, usdtABI, provider);
  let tx
  let txData;
  try {
    await contract.on("Transfer", (from, to, value, event) => {
    tx = {
      from: from,
      to: to,
      value: ethers.utils.formatUnits(value, 18),   // только для юсдт на эфире, для бнб беп здесь будет 18
      data: event
    };
    txData = JSON.stringify(tx, null, 4)
    insertDocument(tx)
    })
  } catch (e) {
    console.log(e)
  }
}

async function insertDocument(txData) {
    try {
      await db.collection('transactions').insertOne(txData, function(err, result) {
          if (err) throw err;
          console.log(documentCount+=1 ,"document inserted at ", new Date());
      })
    } catch (e) {
        console.log(e)
    }
}


// ethereum();
bnbchain()
//
// client.close();
// console.log("Connection closed!");








// async function main() {
//   const provider = new ethers.providers.InfuraProvider('rinkeby', process.env.PROJECT_ID);
//   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//   const usdtContract = new ethers.Contract(process.env.USDT_CONTRACT, usdtABI, wallet);
//   const balance = await usdtContract.balanceOf(process.env.ACCOUNT);
//   console.log(balance.toString());
// }
