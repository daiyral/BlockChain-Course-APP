import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import getWeb3 from './getWeb3'; 
import Election from './contracts/Election.json';
import Navbar from './components/Navbar'; 
import AdminHomePage from './components/AdminHomePage';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null); 

  useEffect(() => {
    async function initWeb3() {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
    
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        console.log('Network ID:', networkId); // Log the network ID
        console.log('Election:', Election); // Log the Election object
    
        const deployedNetwork = Election.networks[networkId];
        console.log('Deployed network:', deployedNetwork); // Log the deployed network object
    
        if (deployedNetwork && deployedNetwork.address) {
          const instance = new web3.eth.Contract(
            Election.abi,
            deployedNetwork.address,
          );
          setWeb3(web3);
          setContractInstance(instance);
          const admin = await instance.methods.getAdmin().call();
          setIsAdmin(admin === accounts[0]);
        } else {
          console.error('Contract not deployed to the current network');
        }
    
      } catch (error) {
        console.error('Error initializing web3', error);
      }
    }

    initWeb3();
  }, []);


  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" render={() => (
            isAdmin ? <AdminHomePage 
                      AccountNum={"0x0"}
                      web3={web3}
                      contractInstance={contractInstance}
                      /> 
                      : 
                      <Redirect to="/Voter" />
          )} />
          {/* <Route path="/create-election" component={CreateElectionPage} />
          <Route path="/view-election" component={ViewElectionPage} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;