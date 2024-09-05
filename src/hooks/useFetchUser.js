import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserService } from 'services/userService';
import { createErrorHandler } from 'utils/errorHandler';
import { setUserInfo, clearUserInfo } from 'store/slices/userSlice';

export const useFetchUser = () => {
  const dispatch = useDispatch();
  const handleError = createErrorHandler();
  const walletAddress = useSelector(state => state.user.walletAddress);
  const userInfo = useSelector(state => state.user.userInfo);
  const { getUser } = useUserService();

  const fetchData = useCallback(async () => {
    if (!walletAddress) {
      if (userInfo) dispatch(clearUserInfo());
      return;
    }
    try {
      const userData = await getUser(walletAddress);
      dispatch(setUserInfo(userData));
    } catch (error) {
      handleError(error, 'Error fetching user data');
      dispatch(clearUserInfo());
    }
  }, [walletAddress, dispatch, handleError, userInfo, getUser]);

  useEffect(() => {
    if (walletAddress && !userInfo) {
      fetchData();
    }
  }, [walletAddress, userInfo, fetchData]);

  return fetchData; // Return the fetchData function in case you need to manually trigger a refresh
};

export default useFetchUser;
