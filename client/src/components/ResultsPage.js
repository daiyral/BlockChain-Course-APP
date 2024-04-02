import React, { useEffect, useState } from 'react';
import CandidateCard from './CandidateCard'; // Import CandidateCard component

const ResultsPage = ({ contractInstance }) => {
  const [winner, setWinner] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [electionStats, setElectionStats] = useState({
    electionStatus: false,
    electionName: '',
    totalCandidates: 0,
    totalVoters: 0,
  });
  const [candidates, setCandidates] = useState([]);

  const getAllCandidates = async (totalCandidates, isOngoing) => {
    const candidateList = [];
    for (let i = 1; i <= totalCandidates; i++) {
      const candidate = await contractInstance.methods.candidateDetails(i - 1).call();
      candidateList.push({
        id: i,
        header: candidate.header,
        slogan: candidate.slogan,
        voteCount: candidate.voteCount,
      });
    }
    setCandidates(candidateList);
    if (!isOngoing) 
      calculateWinner(candidateList);
  };

  const calculateWinner = (candidateList) => {
    if (candidateList.length === 0) return;

    const totalVotes = parseInt(candidateList.reduce((total, candidate) => total + candidate.voteCount, 0));
    console.log(totalVotes, 'totalVotes')
    if (totalVotes === 0) return;
    const winner = candidateList.reduce((prev, current) => (prev.voteCount > current.voteCount ? prev : current));
    let percentage = ((winner.voteCount / totalVotes) * 100).toFixed(2);

    if (isNaN(percentage)) percentage = 0;
    setWinner(winner);
    setPercentage(percentage);
  };

  useEffect(() => {
    if (!contractInstance) return;

    (async () => {
      const isOngoing = await contractInstance.methods.getElectionStatus().call();
      const { electionName } = await contractInstance.methods.getElectionDetails().call();
      const totalCandidates = await contractInstance.methods.getTotalCandidate().call();
      const totalVoters = await contractInstance.methods.getTotalVoter().call();
      console.log(isOngoing, 'isOngoing') 
      setElectionStats({
        electionName,
        electionStatus: isOngoing,
        totalCandidates,
        totalVoters,
      });
      await getAllCandidates(totalCandidates, isOngoing);
    })();
  }, [contractInstance]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#333' }}>Results Page</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>{electionStats.electionName}</p>
      {winner && (  <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>Winner: <strong>{winner.header}</strong></p>)}
      {winner ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <CandidateCard key={winner.id} candidate={winner} />
            <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>Percentage of votes: {percentage}%</p>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '1.2em' }}>Pending results.</p>
      )}
    </div>
  );
};

export default ResultsPage;
