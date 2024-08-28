import { useEffect, useCallback } from 'react';
import getUser from '../services/userService';
import { createErrorHandler } from '../utils/errorHandler';
import useSnackbar from './useSnackbar';

export const useFetchUser = (walletAddress, connectAccount, setUserInfo) => {
  const { setSnackbarOpen, setSnackbarMessage } = useSnackbar();
  const handleError = createErrorHandler(setSnackbarOpen, setSnackbarMessage);

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
  }, [walletAddress, connectAccount, setUserInfo, handleError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
};

export default useFetchUser;
