import { useState } from 'react';

const useCheckEligibility = () => {
  const [isEligible, setIsEligible] = useState(null);
  const [reason, setReason] = useState('');

  const checkEligibility = async (username, navigate) => {
    try {
      console.log('Checking eligibility for', username);
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/checkEligibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lichessHandle: username })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setIsEligible(data.isEligible);
      setReason(data.reason);

      if (data.isEligible) {
        navigate(`/onboarding/${username}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsEligible(false);
      setReason('Error occurred while checking eligibility.');
    }
  };

  return { isEligible, reason, checkEligibility };
};

export default useCheckEligibility;
