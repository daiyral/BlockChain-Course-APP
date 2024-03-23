import React, { useState, useEffect } from 'react';
import RegisterElection from './RegisterElection';
import '../styling/AdminHomePage.css';
import { Button } from '@fluentui/react-components';
import CandidateCard from './CandidateCard'; 

function AdminHomePage({account, web3, contractInstance}) {
  const [showForm, setShowForm] = useState(false);
  const [isElectionOngoing, setIsElectionOngoing] = useState(false); 
  const [electionStats, setElectionStats] = useState({
    electionStatus: false,
    electionName: '',
    totalCandidates: 0,
    totalVoters: 0,
  });
  const [candidates, setCandidates] = useState([]); 

  const getAllCandidates = async (totalCandidates) => {
    for (let i = 1; i <= totalCandidates; i++) {
      const candidate = await contractInstance.methods
        .candidateDetails(i - 1)
        .call();
      setCandidates((prevCandidates) => [
        ...prevCandidates,
        {
          id: i,
          header: candidate.header,
          slogan: candidate.slogan,
        },
      ]);
    }
  }

  const deleteElection = async () => {
    try {
      await contractInstance.methods.deleteElection().send({ from: account });
      setCandidates([]);
      await getElectionStats();
    } catch (error) {
      console.error('Error ending election', error);
    }
  }

  const getElectionStats = async () => {
    try {
      const isOngoing = await contractInstance.methods.getElectionStatus().call();
      const { adminName,electionName  } = await contractInstance.methods.getElectionDetails().call();
      const totalCandidates = await contractInstance.methods.getTotalCandidate().call();
      const totalVoters = await contractInstance.methods.getTotalVoter().call();
      getAllCandidates(totalCandidates);
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

  useEffect(() => {
    setIsElectionOngoing(electionStats.electionStatus);
  }, [electionStats.electionStatus]);
    

  const handleRegister = async () => {
    await getElectionStats();
    window.location.reload();
  }


  return (
    <div className="admin-homepage-container">
      <h1>Admin Home Page</h1>
      {isElectionOngoing? (
        <div>
          <h2>Election Name: {electionStats.electionName}</h2>
          <h2>Total Candidates: {electionStats.totalCandidates}</h2>
          <h2>Total Voters: {electionStats.totalVoters}</h2>
          {candidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
            <Button appearance='primary' onClick={deleteElection}   style={{ backgroundColor: 'red', marginTop: '20px' }} >End Election</Button> 
        </div>
      ) : (
        <div className='center-class'>
          <h2>No election ongoing</h2>
          <Button appearance='primary' onClick={() => setShowForm(true)}>Start Election</Button>
          {showForm && <RegisterElection contractInstance={contractInstance} account = {account} onRegister = {handleRegister} />}
        </div>
      )}
    </div>
  );
}

export default AdminHomePage;