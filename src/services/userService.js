import { useCallback, useMemo } from 'react';

const userCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserService = () => {
  const getUser = useCallback(async (walletAddress) => {
    const now = Date.now();
    if (userCache[walletAddress] && (now - userCache[walletAddress].timestamp < CACHE_DURATION)) {
      return userCache[walletAddress].data;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/getUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      
      userCache[walletAddress] = {
        data: data,
        timestamp: now
      };

      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({ getUser }), [getUser]);
};
