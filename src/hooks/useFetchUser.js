import { useEffect } from 'react';
import getUser from '../services/userService';

/**
 * Custom hook for fetching user information.
 * 
 * @param {string} walletAddress - The user's wallet address.
 * @param {Function} connectAccount - Function to connect the user's account.
 * @param {Function} setUserInfo - State setter function for user information.
 */
export const useFetchUser = (walletAddress, connectAccount, setUserInfo) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(walletAddress);
        setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (walletAddress) {
      fetchData();
    } else {
      connectAccount();
    }
  }, [walletAddress, setUserInfo]);
};

export default useFetchUser;