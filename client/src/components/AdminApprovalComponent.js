import React, { useState, useEffect } from 'react';
import { Button } from '@fluentui/react-components'; // Import Button from Fluent UI

function AdminVerifyVotersComponent({ contractInstance, account }) {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVoters() {
      try {
        const totalVoters = await contractInstance.methods.getTotalVoter().call();
        const voters = [];
        for (let i = 0; i < totalVoters; i++) {
          const voterAddress = await contractInstance.methods.voters(i).call();
          const voter = await contractInstance.methods.voterDetails(voterAddress).call();
          voters.push({
            address: voterAddress,
            name: voter.name,
            phone: voter.phone,
            isVerified: voter.isVerified,
          });
        }
        setVoters(voters);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching voters:', error);
      }
    }

    if (contractInstance && account) {
      fetchVoters();
    }
  }, [contractInstance, account]);

  const handleVerify = async (voterAddress) => {
    try {
      await contractInstance.methods.verifyVoter(true, voterAddress).send({ from: account });
      // Refresh the list of voters after verification
      const updatedVoter = await contractInstance.methods.voterDetails(voterAddress).call();
      const updatedVoters = voters.map(voter => {
        if (voter.address === voterAddress) {
          return {
            ...voter,
            isVerified: updatedVoter.isVerified
          };
        }
        return voter;
      });
      setVoters(updatedVoters);
    } catch (error) {
      console.error('Error verifying voter:', error);
    }
  };

  return (
    <div>
      <h2>Admin Verify Voters Component</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {voters.map(voter => (
            <li key={voter.address}>
              <span>Name: {voter.name}</span>
              <span>Phone: {voter.phone}</span>
              <span>Verified: {voter.isVerified ? 'Yes' : 'No'}</span>
              {!voter.isVerified && (
                <Button onClick={() => handleVerify(voter.address)}>Verify</Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminVerifyVotersComponent;
