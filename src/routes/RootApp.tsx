import { Redirect, Route } from "react-router-dom";
import UserManagement from "../pages/UserManagement";
import DashBoard from "../pages/DashBoard";
import ProductManagement from "../pages/ProductManagement";
import LoginPage from "../pages/Auth/Login";
import { useAppSelector } from "../hooks/useRedux";
import { IRootState } from "../redux";
import CategoryMangement from "../pages/CategoryManagement";
import StoreMangement from "../pages/StoreManagement";

export default function RootApp() {
  const { accessToken } = useAppSelector((state: IRootState) => state.auth);

  console.log("accessToken is", accessToken);

  return (
    <div>
      <Route
        path="/"
        render={() => {
          return !accessToken ? (
            <Redirect to="/login" />
          ) : (
            <Redirect to="/home" />
          );
        }}
      ></Route>
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
      <Route path="/payment-management">
        <StoreMangement />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
    </div>
  );
}
