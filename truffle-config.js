const path = require("path");
require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      // port: 7545, // for ganache gui
      port: 8545, // for ganache-cli
      gas: 6721975,
      gasPrice: 20000000000,
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic:{
          phrase:process.env.MNEMONIC
        },
        providerOrUrl:process.env.API_KEY
      }),
      network_id: 11155111, // Sepolia's network ID
      gas: 6721975, // Adjust the gas limit as per your requirements
      gasPrice: 20000000000, // Set the gas price to an appropriate value
      confirmations: 2, // Set the number of confirmations needed for a transaction
      timeoutBlocks: 200, // Set the timeout for transactions
      skipDryRun: true // Skip the dry run option
     }
  },
};