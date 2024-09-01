import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import getUser from '../services/userService';
import { createErrorHandler } from '../utils/errorHandler';
import { setUserInfo, clearUserInfo } from '../store/slices/userSlice';

export const useFetchUser = (walletAddress, connectAccount) => {
  const dispatch = useDispatch();
  const handleError = createErrorHandler();

  const fetchData = useCallback(async () => {
    if (!walletAddress) {
      connectAccount();
      return;
    }

    try {
      const userData = await getUser(walletAddress);
      dispatch(setUserInfo(userData));
    } catch (error) {
      handleError(error, 'Error fetching user data');
      dispatch(clearUserInfo());
    }
  }, [walletAddress, dispatch, connectAccount, handleError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return fetchData; // Return the fetchData function in case you need to manually trigger a refresh
};

export default useFetchUser;
