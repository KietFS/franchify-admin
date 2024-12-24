import React from 'react';
import MainLayout from '@/components/MainLayout';

interface ICmsManagementPageProps {}

const CmsManagementPage: React.FC<ICmsManagementPageProps> = () => {
  return <MainLayout title="Quản lý nội dung hiển thị" content={<div>CmsManagementPage</div>} />;
};

export default CmsManagementPage;
