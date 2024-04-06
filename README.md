# Voting app
Decentralised voting system based on etherum. 
Using metamask, truffle, ganache.
Contract also deployed on sepolia network. If you have sepolia it can also be used.

## System Workflow
- Admin account will create an election with the candidates for the election.
- Voter accounts will register their account to be eligable to vote
- Admin account will approve the accounts that can vote in the election
- Voter account that is approved is able to see the election and vote on the candidate that he wishes.
- Admin account will close the election when he pleases.
- Results will be displayed in the results page.

  see demo:

  
## Setting up the development environment

### Requirements

- [Node.js](https://nodejs.org)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://github.com/trufflesuite/ganache-cli) (Cli)
- [Metamask](https://metamask.io/) (Browser Extension)

#### Getting the requirements

1. Download and install **NodeJS**

   Download and install NodeJS from [here](https://nodejs.org/en/download/ "Go to official NodeJS download page.").

2. Install **truffle** and **ganache-cli** using node packager manager (npm)

   ```shell
   npm install -g truffle
   npm install -g ganache-cli
   ```

3. Install **metamask** browser extension

   Download and install metamask from [here](https://metamask.io/download "Go to official metamask download page.").

### Configuring the project for development

1. Clone this repository
   
   ```git clone https://github.com/daiyral/BlockChain-Course-APP.git```
   
3. Run local eth blockchain
   
   ```shell
     ganache-cli
   ```
   
5. Configure metamask new custom network with the following:
   
     New RPC URL: `http://127.0.0.1:8545` *(use `port: 7545` for **ganache gui**, update it in the file:`truffle-config.js` as well)*
     Chain ID: `1337
   
7. Import accounts from ganache to metamask using their private keys. (First account in the ganache cli is the admin account, the rest are regular users)
   
9. Deploy smart contract to local blockchain
    
  ``` shell
  truffle migrate
```
  
11. Launch client
    
   ```shell
   cd client
   npm install
   npm start
  ```

### Deploy for sepolia testnet

9. Deploy smart contract to sepolia blockchain (MUST HAVE SEPOLIA ETH)
    
  ``` shell
  truffle migrate --network sepolia.
```
  
11. Deploy to git pages the react client
    
   ```shell
   cd client
   npm run deploy
  ```

12. Go to https://daiyral.github.io/BlockChain-Course-APP/
