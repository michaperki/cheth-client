import { useEffect } from 'react';
import getUser from '../services/userService';
import { createErrorHandler } from '../utils/errorHandler';
import useSnackbar from './useSnackbar';

export const useFetchUser = (walletAddress, connectAccount, setUserInfo) => {
  const { setSnackbarOpen, setSnackbarMessage } = useSnackbar();
  const handleError = createErrorHandler(setSnackbarOpen, setSnackbarMessage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(walletAddress);
        setUserInfo(userData);
      } catch (error) {
        handleError(error, 'Error fetching user data');
        setUserInfo(null);
      }
    };

    if (walletAddress) {
      fetchData();
    } else {
      connectAccount();
    }
  }, [walletAddress, setUserInfo, connectAccount, handleError]);
};

export default useFetchUser;
