import { CircularProgress } from '@mui/material';
import React from 'react';

type IButtonVariant = 'primary' | 'secondary' | 'red';
type IButtonType = 'button' | 'submit';

interface IButtonProps {
  onClick?: () => void;
  variant?: IButtonVariant;
  className?: string;
  type?: IButtonType;
  title?: string;
  isLoading?: boolean;
}

const Button: React.FC<IButtonProps> = (props) => {
  const {
    onClick,
    variant = 'primary',
    className,
    type = 'submit',
    title = '',
    isLoading = false,
  } = props;

  return (
    <button
      className={`flex w-fit min-w-[200px] items-center justify-center rounded-2xl px-4 py-2 text-center hover:opacity-50 ${className} ${
        variant === 'primary' && 'bg-gray-700'
      } ${variant === 'secondary' && 'bg-white'} ${variant === 'red' && 'bg-red-500'} ${
        variant === 'secondary' ? 'text-gray-500' : 'text-white'
      } border ${
        variant === 'secondary' ? 'border-gray-500' : 'border-transparent'
      } text-lg font-semibold`}
      onClick={(e) => {
        e?.stopPropagation();
        onClick && onClick();
      }}
      type={type}
    >
      {isLoading ? (
        <>
          <CircularProgress size="md" sx={{ color: 'white', width: 28, height: 28 }} />
        </>
      ) : (
        title
      )}
    </button>
  );
};

export default Button;
