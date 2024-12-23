import * as React from 'react';
import {useAppSelector} from '../../hooks/useRedux';
import {IRootState} from '../../redux';
import TenantProductManagement from './TenantProductManagement';
import StoreProductManagement from './StoreProductManagement';

const ProductManagement = () => {
    const {user} = useAppSelector((state: IRootState) => state.auth);
    const [viewMode, setViewMode] = React.useState<'tenant' | 'store'>(
        user?.role === 'admin' ? 'tenant' : 'store',
    );

    return (
        <>
            {viewMode === 'store' ? (
                <StoreProductManagement onChangeViewMode={(mode) => setViewMode(mode)}/>
            ) : (
                <TenantProductManagement onChangeViewMode={(mode) => setViewMode(mode)}/>
            )}
        </>
    );
};

export default ProductManagement;
