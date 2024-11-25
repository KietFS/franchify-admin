import React, {lazy, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {useAppSelector} from '../hooks/useRedux';
import {IRootState} from '../redux';

// Lazy load components
const DashBoard = lazy(() => import('../pages/DashBoard'));
const ProductManagement = lazy(() => import('../pages/ProductManagement'));
const LoginPage = lazy(() => import('../pages/Auth/Login'));
const CategoryMangement = lazy(() => import('../pages/CategoryManagement'));
const StoreMangement = lazy(() => import('../pages/StoreManagement'));
const TenantManagement = lazy(() => import('../pages/TenantMangement'));
const OrdersManagement = lazy(() => import('../pages/OrdersManagement'));
const UserManagement = lazy(() => import('../pages/UserManagement'));

export default function RootApp() {
    const {accessToken, user} = useAppSelector((state: IRootState) => state.auth);

    const renderAdminRoutes = () => {
        return (
            <>
                <Route path="/home" component={DashBoard}/>
                <Route path="/user-management" component={UserManagement}/>
                <Route path="/category-management" component={CategoryMangement}/>
                <Route path="/products-management" component={ProductManagement}/>
                <Route path="/store-management" component={StoreMangement}/>
                <Route path="/tenant-management" component={TenantManagement}/>
            </>
        );
    };

    const renderStaffRoutes = () => {
        return (
            <>
                <Route path="/home" component={DashBoard}/>
                <Route path="/user-management" component={UserManagement}/>
                <Route path="/products-management" component={ProductManagement}/>
                <Route path="/orders-management" component={OrdersManagement}/>
            </>
        );
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route
                    path="/"
                    exact
                    render={() => (!accessToken ? <Redirect to="/login"/> : <Redirect to="/home"/>)}
                />
                <Route path="/login" component={LoginPage}/>
                {user?.role === 'admin' ? renderAdminRoutes() : renderStaffRoutes()}
            </Switch>
        </Suspense>
    );
}
