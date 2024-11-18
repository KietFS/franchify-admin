import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import { setAccessToken, setUser } from '../../redux/slices/auth';
import LogoutConfirmDialog from '../LogoutConfirmDialog';

interface IHeaderProps {
  title: string;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const logOut = () => {
    try {
      localStorage.removeItem('admin');
      localStorage.removeItem('token');
      dispatch(setAccessToken(''));
      dispatch(setUser(null));
      toast.success('Đăng xuất thành công', {
        position: 'top-right',
        hideProgressBar: true,
        theme: 'colored',
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-between border-b border-b-gray-300 px-12 py-[16.5px]">
      <h2 className="text-2xl font-bold text-gray-600">{props.title}</h2>
      <div className="flex items-center space-x-4">
        <p className="text-lg font-bold text-gray-500">
          Xin chào {user?.lastName} {user?.firstName} !
        </p>
        <button
          className="rounded-full bg-gray-100 px-3 py-1 font-bold text-gray-800 hover:opacity-50"
          onClick={() => setOpen(true)}
        >
          Đăng xuất
        </button>
      </div>
      <LogoutConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={logOut} />
    </div>
  );
};

export default Header;
