import * as React from 'react';
import MainLayout from '../../components/MainLayout';

interface IUser {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  address?: IAddress;
}

export interface IAddress {
  addressId: number;
  homeNumber: string;
  city: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  ward: {
    id: number;
    name: string;
  };
}

const TenantManagement = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [initialValues, setInitalValues] = React.useState<any>({});

  return (
    <MainLayout
      title="Quản lý thương hiệu"
      content={<div className="flex flex-col gap-y-10 px-10"></div>}
    />
  );
};

export default TenantManagement;
