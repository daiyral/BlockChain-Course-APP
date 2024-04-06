import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Web3 from 'web3';
import getWeb3 from './getWeb3'; 
import Election from './contracts/Election.json';
import Navbar from './components/Navbar'; 
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';
import UserRegistrationComponent from './components/UserRegistrationComponent';
import AdminApprovalComponent from './components/AdminApprovalComponent';
import ClipLoader from "react-spinners/ClipLoader";
import './App.css';
import config from './config';
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null); 
  const [accounts, setAccounts] = useState([null]); // [0] is the current account
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function initWeb3() {
      try {

        if (config.env.environment === "dev") {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
          
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
        }
        if (config.env.environment === "staging") {
          const web3 = new Web3(
            new Web3.providers.HttpProvider(
              config.env.API_KEY
            )
          )
          console.log(web3, "web3")
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
      }
        setAccounts(accounts);
    
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Election.networks[networkId];
        if (deployedNetwork && deployedNetwork.address) {
          const instance = new web3.eth.Contract(
            Election.abi,
            deployedNetwork.address,
          );
          setWeb3(web3);
          setContractInstance(instance);
          const admin = await instance.methods.getAdmin().call();
          setIsAdmin(admin.toString().toLowerCase() === accounts[0].toString().toLowerCase());
          setLoading(false);
        } else {
          console.error('Contract not deployed to the current network');
        }
    
      } catch (error) {
        console.error('Error initializing web3', error);
      }
    }

    initWeb3();
  }, []);


  if (loading){
    return <div >
      <ClipLoader
      loading={loading}
      size={30}
      color={"#123abc"}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
  }


  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <div className="container-base">
            <Route exact path="/" render={() => (
                <HomePage
                      isAdmin={isAdmin}
                      account = {accounts[0]}
                      web3={web3}
                      contractInstance={contractInstance}
                  /> 
            )} />
            <Route path="/Results" render={() => (
              <ResultsPage contractInstance={contractInstance}/>
            )} />
            <Route exact path="/Registration">
            {isAdmin ? (
              <AdminApprovalComponent contractInstance={contractInstance} account={accounts[0]} />
            ) : (
              <UserRegistrationComponent contractInstance={contractInstance} account={accounts[0]} />
            )}
          </Route>
          </div>
        </Switch>
      </div>
    </Router>
  );
}

export default App;