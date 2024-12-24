import React, { ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

const FormControlErrorHelper: React.FC<IProps> = ({ children }) => {
  return <div className="text-14 mt-1 flex items-center text-red-500">{children}</div>;
};

export default FormControlErrorHelper;
