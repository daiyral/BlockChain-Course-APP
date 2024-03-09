import React, { useState, useEffect } from 'react';
import Election from '../contracts/Election.json';
import getWeb3 from '../getWeb3';
import '../styling/AdminHomePage.css'; // Import the CSS file for styling
function AdminHomePage({AccountNum, web3, contractInstance}) {

  const [electionStats, setElectionStats] = useState({
    electionStatus: false,
    electionName: '',
    totalCandidates: 0,
    totalVoters: 0,
  });
  const getElectionStats = async () => {
    try {
      const isOngoing = await contractInstance.methods.getElectionStatus().call();
      const { adminName, electionName } = await contractInstance.methods.getElectionDetails().call();
      const totalCandidates = await contractInstance.methods.getTotalCandidate().call();
      const totalVoters = await contractInstance.methods.getTotalVoter().call();
      setElectionStats({
        electionName,
        electionStatus: isOngoing,
        totalCandidates,
        totalVoters,
      });
    } catch (error) {
      console.error('Error getting election stats', error);
    }
  }

  useEffect(() => {
    if (!contractInstance) return;
    getElectionStats();
  }
  , [contractInstance]);



  return (
    <div className="admin-homepage-container">
      <h1>Admin Home Page</h1>
      {electionStats.electionStatus? (
        <div>
          <h2>Election Name: {electionStats.electionName}</h2>
          <h2>Total Candidates: {electionStats.totalCandidates}</h2>
          <h2>Total Voters: {electionStats.totalVoters}</h2>
        </div>
      ) : (
        <div>
          <h2>No election ongoing</h2>
          <button>Start Election</button>
        </div>
      )}
    </div>
  );
}

export default AdminHomePage;
