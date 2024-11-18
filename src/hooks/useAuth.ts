import { useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { auth } from '../common/config/firebase';
import { IRootState } from '../redux';
import { setAccessToken, setUser } from '../redux/slices/auth';
import { useAppSelector } from './useRedux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { apiURL } from '../config/constanst';

export const useAuth = () => {
  //login
  const [loginError, setLoginError] = useState<string>();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const { user, accessToken } = useAppSelector((state: IRootState) => state.auth);
  const history = useHistory();

  const dispatch = useDispatch();

  const isAuthorizedForAdmin = user?.role === 'admin';
  const isAuthorizedForManager = user?.role === 'manager' || isAuthorizedForAdmin;
  const isAuthorizedForStaff = user?.role === 'staff' || isAuthorizedForManager;

  const login = async (phoneNumber: string, password: string) => {
    try {
      setLoginLoading(true);
      const response = await axios.post(`${apiURL}/tenant/signin`, {
        phoneNumber,
        password,
      });
      if (response?.data?.success) {
        toast.success('Đăng nhập thành công', {
          position: 'top-right',
          autoClose: 0,
          theme: 'colored',
          hideProgressBar: true,
        });
        history.push('/home');
        dispatch(setUser(response?.data?.data as any));
        dispatch(setAccessToken(response?.data?.data?.accessToken));
      } else {
        toast.error('Phone number or password in incorrect', {
          position: 'top-right',
          theme: 'colored',
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
      setLoginError(error as string);
    } finally {
      setLoginLoading(false);
    }
  };

  return {
    isAuth: !!accessToken,
    login,
    accessToken,
    loginError,
    loginLoading,
    user,
    isAuthorizedForAdmin,
    isAuthorizedForManager,
    isAuthorizedForStaff,
  };
};
