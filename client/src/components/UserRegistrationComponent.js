import React, { useState, useEffect } from 'react';
import { Button } from '@fluentui/react-components'; // Fluent UI components

function UserRegistrationComponent({ contractInstance, account }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isElectionActive, setIsElectionActive] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    async function checkElectionStatus() {
      try {
        const status = await contractInstance.methods.getElectionStatus().call();
        setIsElectionActive(status);
      } catch (error) {
        console.error('Error checking election status:', error);
      }
    }

    checkElectionStatus();
  }, [contractInstance]);

  useEffect(() => {
    async function checkRegistrationStatus() {
      try {
        const voter = await contractInstance.methods.voterDetails(account).call();
        setHasRegistered(voter.isRegistered);
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    }

    if (account) {
      checkRegistrationStatus();
    }
  }, [contractInstance, account]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleRegistration = async () => {
    try {
      if (!isElectionActive) {
        alert('There is no active election. Registration is not allowed.');
        return;
      }

      if (hasRegistered) {
        alert('You have already registered for this election.');
        return;
      }

      await contractInstance.methods.registerAsVoter(name, phone).send({ from: account });
      // Clear form fields after successful registration
      setName('');
      setPhone('');
      setHasRegistered(true);
      alert('Registration successful!');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <div className="fluent-input">
        <label>Name:</label>
        <input type="text" value={name} onChange={handleNameChange} />
      </div>
      <div className="fluent-input">
        <label>Phone:</label>
        <input type="text" value={phone} onChange={handlePhoneChange} />
      </div>
      <Button onClick={handleRegistration}>Register</Button>
    </div>
  );
}
export default UserRegistrationComponent;

