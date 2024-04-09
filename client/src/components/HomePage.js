import React, { useState, useEffect } from 'react';
import RegisterElection from './RegisterElection';
import '../styling/HomePage.css';
import { Button } from '@fluentui/react-components';
import CandidateCard from './CandidateCard'; 
import ClipLoader from "react-spinners/ClipLoader";

function HomePage({isAdmin, account, web3, contractInstance}) {
  const [showForm, setShowForm] = useState(false);
  const [isElectionOngoing, setIsElectionOngoing] = useState(false); 
  const [voter, setVoter] = useState({isVerified: false}); 
  const [electionStats, setElectionStats] = useState({
    electionStatus: false,
    electionName: '',
    totalCandidates: 0,
    totalVoters: 0,
  });
  const [candidates, setCandidates] = useState([]); 
  const [loading, setLoading] = useState(true);
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
          voteCount: candidate.voteCount
        },
      ]);
    }
  }

  const deleteElection = async () => {
    try {
      await contractInstance.methods.deleteElection().send({ from: account }).catch((error) => console.error('Error deleting election:', error));
      setCandidates([]);
      await getElectionStats();
    } catch (error) {
      console.error('Error ending election', error);
    }
  }

  const endElection = async () => {
    // if all votes are 0 dont end election
    let totalVotes = 0;
    candidates.forEach(candidate => {
      totalVotes += parseInt(candidate.voteCount);
    });
    if (totalVotes === 0) {
      alert('No votes have been cast yet. Cannot end election.');
      return;
    }
    try {
      await contractInstance.methods.endElection().send({ from: account }).catch((error) => console.error('Error ending election:', error));
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
      const voter = await contractInstance.methods.voterDetails(account).call().catch((error) => console.error('Error checking registration status:', error));
      setVoter({ ...voter})
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
    setLoading(false);
  }

  useEffect(() => {
    if (!contractInstance) return;
    getElectionStats();
  }
  , [contractInstance]);

  useEffect(() => {
    setIsElectionOngoing(electionStats.electionStatus);
  }, [electionStats.electionStatus]);

  useEffect(() => {
    const fetchData = async () => {
      const currVoter = await contractInstance.methods.voterDetails(account).call().catch((error) => console.error('Error fetching voter details:', error));
      setVoter(currVoter);
    }
    
    fetchData();
  
  }, []);
  

  const handleRegister = async () => {
    await getElectionStats();
    window.location.reload();
  }

  const handleVote = async (candidateId) => {
    try {
      await contractInstance.methods.vote(candidateId-1).send({ from: account }).catch((error) => console.error('Error voting:', error));
      const voter = await contractInstance.methods.voterDetails(account).call().catch((error) => console.error('Error checking registration status:', error));
      setVoter({ ...voter})
    } catch (error) {
      console.error('Error voting', error);
    }
  }

  const title = isAdmin? `Admin Home Page` : `User Home Page`;

  if (loading) {
    return (
      <div>
        <ClipLoader
          loading={loading}
          size={30}
          color={'#123abc'}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div>
        <h1>{title}</h1>
        {isAdmin || (voter.isVerified && voter.isRegistered) ? (
            isElectionOngoing ? (
                <div>
                    <h2>Election Name: {electionStats.electionName}</h2>
                    <h2>Total Candidates: {electionStats.totalCandidates}</h2>
                    {candidates.map(candidate => (
                        <div style={{ marginBottom: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'start' }}>
                              <CandidateCard key={candidate.id} candidate={candidate} />
                              {!isAdmin && <Button appearance='primary' disabled = {voter?.hasVoted}  onClick={() => handleVote(candidate.id)} style={{marginLeft: '10px', backgroundColor: 'green' }}>Vote</Button>}
                            </div>
                        </div>
                    ))}
                    <div style={{justifyContent:'space-evenly', display: 'flex'}}>
                    {isAdmin && <Button appearance='primary' onClick={endElection} style={{ backgroundColor: 'blue', marginTop: '10px' }}>End Election</Button>}
                    {isAdmin && <Button appearance='primary' onClick={deleteElection} style={{ backgroundColor: 'red', marginTop: '10px' }}>Delete Election</Button>}
                    </div>
                </div>
            ) : (
                isAdmin ? (
                    <div className='center-class'>
                        <h2>No election ongoing</h2>
                        <Button appearance='primary' onClick={() => setShowForm(true)}>Start Election</Button>
                        {showForm && <RegisterElection contractInstance={contractInstance} account={account} onRegister={handleRegister} />}
                    </div>
                ) : (
                    <div className='center-class'>
                        <h2>No election ongoing</h2>
                        <p>Check back later for an ongoing election</p>
                    </div>
                )
            )
        ) : (
            voter.isRegistered ? (
                <div className='center-class'>
                    <h2>Your registration is pending approval</h2>
                </div>
            ) : (
                <div className='center-class'>
                    <h2>You must be verified to view the current election</h2>
                </div>
            )
        )}
    </div>
);

}

export default HomePage;