const Web3 = require('web3');
require('dotenv').config();
class TransactionChecker {
  web3;
  account;

  constructor(projectId, account) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${projectId}`));
    this.account = account.toLowerCase();
  }
  
  async checkBlock() {
    let block = await this.web3.eth.getBlock('latest');
    let blockNumber = block.number;
    console.log(`Checking block ${blockNumber}`);

    if(block && block.transactions) {
      for (let txHash of block.transactions) {
        let tx = await this.web3.eth.getTransaction(txHash);
        // console.log(tx);
        if(tx.to && this.account == tx.to.toLowerCase()) {
          console.log(`Transaction found: ${txHash}`);
          console.log(tx)
        }
      }
    }
  }

}
console.log(process.env.PROJECT_ID);
console.log(process.env.ACCOUNT);
const checker = new TransactionChecker(process.env.PROJECT_ID, process.env.ACCOUNT);
checker.checkBlock();
setInterval(() => checker.checkBlock(), 10000);