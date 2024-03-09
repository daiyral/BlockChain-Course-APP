import React, { useState, useEffect } from 'react';
import Election from '../contracts/Election.json';
import getWeb3 from '../getWeb3';
import '../styling/AdminHomePage.css'; // Import the CSS file for styling
function AdminHomePage() {
  const [adminName, setAdminName] = useState('');
  const [electionName, setElectionName] = useState('');
  const [electionStatus, setElectionStatus] = useState(false);
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
        const deployedNetwork = Election.networks[networkId];
        const instance = new web3.eth.Contract(
          Election.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3);
        setContractInstance(instance);
      } catch (error) {
        console.error('Error initializing web3', error);
      }
    }

    initWeb3();
  }, []);

  useEffect(() => {
    async function loadElectionDetails() {
      if (contractInstance) {
        try {
          const adminName = ''; // Fetch admin name from the contract
          const electionName = ''; // Fetch election name from the contract
          const electionStatus = ''; // Fetch election status from the contract

          setAdminName(adminName);
          setElectionName(electionName);
          setElectionStatus(electionStatus);
        } catch (error) {
          console.error('Error loading election details', error);
        }
      }
    }

    loadElectionDetails();
  }, [contractInstance]);



  return (
    <div className="admin-homepage-container">
      <h1>Admin Home Page</h1>
      <div className="election-details-container">
        <h2>Election Details</h2>
        <p><strong>Admin Name:</strong> {adminName}</p>
        <p><strong>Election Name:</strong> {electionName}</p>
        <p><strong>Election Status:</strong> {electionStatus ? 'Ongoing' : 'Not ongoing'}</p>
      </div>
    </div>
  );
}

export default AdminHomePage;
