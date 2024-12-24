import React from 'react';
import MainLayout from '@/components/MainLayout';

interface IFeeManagementPageProps {}

const FeeManagement: React.FC<IFeeManagementPageProps> = () => {
  return <MainLayout title="Quản lý chi phí" content={<div>Fee Management</div>} />;
};

export default FeeManagement;
