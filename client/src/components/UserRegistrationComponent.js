import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

function UserRegistrationComponent({ contractInstance, account }) {
  const { handleSubmit, register, formState: { errors } } = useForm();
  
  const [isElectionActive, setIsElectionActive] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    async function checkElectionStatus() {
      try {
        const status = await contractInstance.methods.getElectionStatus().call().catch((error) => console.error('Error checking election status:', error));
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
        const voter = await contractInstance.methods.voterDetails(account).call().catch((error) => console.error('Error checking registration status:', error));
        setHasRegistered(voter.isRegistered);
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    }

    if (account) {
      checkRegistrationStatus();
    }
  }, [contractInstance, account]);

  const onSubmit = async (data) => {
    try {
      if (!isElectionActive) {
        alert('There is no active election. Registration is not allowed.');
        return;
      }

      if (hasRegistered) {
        alert('You have already registered for this election.');
        return;
      }

      const transaction = await contractInstance.methods.registerAsVoter(data.name, data.phone).send({ from: account }).catch((error) => console.error('Error registering voter:', error));
      await transaction.wait();
      // Clear form fields after successful registration
       setHasRegistered(true);
       alert('Registration successful!');
    } catch (error) {
      //alert('Failed to register. Please try again.');
    }
  };

  return (
    <div className="register-election-container">
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="register-election-form">
        <div className="form-field">
          <label>Name:</label>
          <input className="form-input" type="text" {...register('name', { required: true })} />
          {errors.name && <span>This field is required</span>}
        </div>
        <div className="form-field">
          <label>Phone:</label>
          <input className="form-input" type="text" {...register('phone', { required: true })} />
          {errors.phone && <span>This field is required</span>}
        </div>
        <button className="register-button" type="submit">Register</button>
      </form>
    </div>
  );
}

export default UserRegistrationComponent;
