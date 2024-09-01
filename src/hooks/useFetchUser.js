import { useEffect, useCallback } from 'react';
import getUser from '../services/userService';
import { createErrorHandler } from '../utils/errorHandler';

export const useFetchUser = (walletAddress, connectAccount, setUserInfo) => {
  const handleError = createErrorHandler();

  const fetchData = useCallback(async () => {
    if (!walletAddress) {
      connectAccount();
      return;
    }

    try {
      const userData = await getUser(walletAddress);
      setUserInfo(userData);
    } catch (error) {
      handleError(error, 'Error fetching user data');
      setUserInfo(null);
    }
  }, [walletAddress, setUserInfo ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
};

export default useFetchUser;
