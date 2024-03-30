import React, { useEffect, useState } from 'react';

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
    
      const getElectionStats = async () => {
        try {
          if (!contractInstance.methods) return; // Check if contractInstance is defined properly
          const isOngoing = await contractInstance.methods.getElectionStatus().call();
          const { adminName,electionName  } = await contractInstance.methods.getElectionDetails().call();
          const totalCandidates = await contractInstance.methods.getTotalCandidate().call();
          const totalVoters = await contractInstance.methods.getTotalVoter().call();
          await getAllCandidates(totalCandidates);
          setElectionStats({
            electionName,
            electionStatus: isOngoing,
            totalCandidates,
            totalVoters
          });
        } catch (error) {
          console.error('Error getting election stats', error);
        }
      }

      const calculateWinner = async () => {
        await getElectionStats();
        if (electionStats.electionStatus == true || candidates.length === 0) return; 
        const totalVotes = candidates.reduce((total, candidate) => total + candidate.voteCount, 0);
        const winner = candidates.reduce((prev, current) => (prev.voteCount > current.voteCount) ? prev : current);
        const percentage = ((winner.voteCount / totalVotes) * 100).toFixed(2);
        setWinner(winner);
        setPercentage(percentage);
      }

      useEffect(() => {
        if (!contractInstance) return;
        calculateWinner();
      }, [contractInstance, candidates]); 

    return (
        <div>
            <h1>Results Page</h1>
            {winner ? (
                <>
                    <p>Winner: {winner.header}</p>
                    <p>Percentage of votes: {percentage}%</p>
                </>
            ):
            <p>Election ongoing no winner yet</p>
        }
        </div>
    );
}

export default ResultsPage;
