import { Redirect, Route } from 'react-router-dom';
import UserManagement from '../pages/UserManagement';
import DashBoard from '../pages/DashBoard';
import ProductManagement from '../pages/ProductManagement';
import LoginPage from '../pages/Auth/Login';
import { useAppSelector } from '../hooks/useRedux';
import { IRootState } from '../redux';
import CategoryMangement from '../pages/CategoryManagement';
import StoreMangement from '../pages/StoreManagement';
import TenantManagement from '../pages/TenantMangement';

export default function RootApp() {
  const { accessToken, user } = useAppSelector((state: IRootState) => state.auth);

  const renderAdminRoutes = () => {
    return (
      <>
        <Route path="/home">
          <DashBoard />
        </Route>
        <Route path="/user-management">
          <UserManagement />
        </Route>
        <Route path="/category-management">
          <CategoryMangement />
        </Route>
        <Route path="/products-management">
          <ProductManagement />
        </Route>
        <Route path="/store-management">
          <StoreMangement />
        </Route>
        <Route path="/tenant-management">
          <TenantManagement />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </>
    );
  };

  const renderStaffRoutes = () => {
    return (
      <>
        <Route path="/home">
          <DashBoard />
        </Route>
        <Route path="/user-management">
          <UserManagement />
        </Route>
        <Route path="/products-management">
          <ProductManagement />
        </Route>
        <Route path="/store-management">
          <StoreMangement />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </>
    );
  };

  return (
    <div>
      <Route
        path="/"
        render={() => {
          return !accessToken ? <Redirect to="/login" /> : <Redirect to="/user-management" />;
        }}
      ></Route>

      {user?.role === 'admin' ? renderAdminRoutes() : renderStaffRoutes()}
    </div>
  );
}
