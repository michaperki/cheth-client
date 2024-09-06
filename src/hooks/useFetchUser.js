import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUserService } from 'services/userService';
import { setUserInfo } from 'store/slices/userSlice';

export const useFetchUser = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector(state => state.user.walletAddress);
  const userInfo = useSelector(state => state.user.userInfo);
  const { getUser } = useUserService();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!walletAddress || userInfo) return;

      try {
        const userData = await getUser(walletAddress);
        if (isMounted) {
          dispatch(setUserInfo(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [walletAddress, userInfo, getUser, dispatch]);
};
