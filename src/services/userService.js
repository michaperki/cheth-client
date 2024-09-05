import { useState, useCallback } from 'react';

// This cache is outside of any component, so it persists across re-renders
const userCache = {};

export const useUserService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUser = useCallback(async (walletAddress) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if we have cached data and it's less than 5 minutes old
      if (userCache[walletAddress] && (Date.now() - userCache[walletAddress].timestamp < 5 * 60 * 1000)) {
        console.log('User data from cache:', userCache[walletAddress].data);
        setIsLoading(false);
        return userCache[walletAddress].data;
      }

      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('User data:', data);
      
      // Cache the data
      userCache[walletAddress] = {
        data: data,
        timestamp: Date.now()
      };

      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  }, []);

  return { getUser, isLoading, error };
};
