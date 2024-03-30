import React, { useState, useEffect } from 'react';
import getWeb3 from '../getWeb3'; 
import ElectionContract from '../contracts/Election.json';
import CandidateCard from './CandidateCard'; 

function VotePage() {
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [electionDetails, setElectionDetails] = useState({});

  useEffect(() => {
    async function initializeWeb3() {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = ElectionContract.networks[networkId];
        const contract = new web3Instance.eth.Contract(
          ElectionContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContractInstance(contract);

        const electionStatus = await contract.methods.getElectionStatus().call();
        if (electionStatus) {
          const totalCandidates = await contract.methods.getTotalCandidate().call();
          const fetchedCandidates = [];
          for (let i = 0; i < totalCandidates; i++) {
            const candidate = await contract.methods.candidateDetails(i).call();
            fetchedCandidates.push(candidate);
          }
          setCandidates(fetchedCandidates);
        } else {
          console.log('There is no ongoing election.');
        }
      } catch (error) {
        console.error('Error initializing Web3 and contract:', error);
      }
    }

    initializeWeb3();
  }, []);
  useEffect(() => {
    async function checkUserVerification() {
      if (contractInstance && web3) {
        try {
          const isUserVerified = await contractInstance.methods.voterDetails(web3.currentProvider.selectedAddress).isVerified().call();
          setIsVerified(isUserVerified);
  
          // Fetch election details if user is verified
          if (isUserVerified) {
            const electionDetails = await contractInstance.methods.getElectionDetails().call();
            setElectionDetails(electionDetails);
          }
        } catch (error) {
          console.error('Error checking user verification:', error);
        }
      }
    }
  
    checkUserVerification();
  }, [contractInstance, web3]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      alert('Please select a candidate to vote.');
      return;
    }

    try {
      await contractInstance.methods.vote(selectedCandidate.id).send({ from: web3.currentProvider.selectedAddress });
      alert('Vote successfully casted!');
      const totalCandidates = await contractInstance.methods.getTotalCandidate().call();
      const fetchedCandidates = [];
      for (let i = 0; i < totalCandidates; i++) {
        const candidate = await contractInstance.methods.candidateDetails(i).call();
        fetchedCandidates.push(candidate);
      }
      setCandidates(fetchedCandidates);
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  return (
    <div>
      <h2>Vote in Active Election</h2>
      {candidates.length > 0 && isVerified ? (
        <div>
          <h3>Candidates:</h3>
          {candidates.map(candidate => (
            <div key={candidate.id}>
              <CandidateCard candidate={candidate} />
              <button onClick={() => setSelectedCandidate(candidate)}>Vote</button>
            </div>
          ))}
          <button onClick={handleVote}>Cast Vote</button>
        </div>
      ) : (
        <div>
          {!isVerified ? (
            <p>You are not verified.</p>
          ) : (
            <p>No active election or no candidates available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default VotePage;
