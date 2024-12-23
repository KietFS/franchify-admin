import * as React from 'react';
import {useEffect} from 'react';
import {DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel} from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';

import ActionMenu from './ActionMenu';
import CreateAccountForm from './CreateAccount';
import Button from '../../designs/Button';
import {useAuth} from '../../hooks/useAuth';
import useUserManagement from '../../hooks/useUserManagement';
import SpinnerWrapper from '../../components/SpinnerWrapper';
import SimpleInput from '../../components/SimpleInput';
import {IUser} from "../../types/models";

const UserManagement = () => {
    const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [userNeedToUpdate, setUserNeedToUpdate] = React.useState<IUser | null>(null);
    const {users, getAllUser, loading, handleDeactivateUser, handleActivateUser} =
        useUserManagement();
    const [userTableData, setUserTableData] = React.useState<IUser[]>([]);

    const {isAuthorizedForManager} = useAuth();

    const columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Hành động',
            type: 'string',
            width: 100,
            renderCell: (params: GridRenderCellParams<any>) => {
                if (isAuthorizedForManager) {
                    const options = [
                        params?.row?.isActive
                            ? {
                                id: 'deactivate',
                                title: 'Khóa',
                                onPress: () => handleDeactivateUser(params.row?.id),
                                onActionSuccess: () => getAllUser({addLoadingEffect: false}),
                            }
                            : {
                                id: 'activate',
                                title: 'Cập nhật',
                                onPress: () => handleActivateUser(params.row?.id),
                                onActionSuccess: () => getAllUser({addLoadingEffect: false}),
                            },
                        {
                            id: 'update-account',
                            title: 'Cập nhật',
                            onPress: () => {
                                setOpenDialog(true);
                                setUserNeedToUpdate(params.row);
                            },
                            onActionSuccess: () => getAllUser({addLoadingEffect: false}),
                        },
                    ];
                    return <ActionMenu options={options}/>;
                } else {
                    return <></>;
                }
            },
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            renderHeader: () => <div className="font-bold text-gray-800">ID</div>,
        },
        {
            field: 'username',
            headerName: 'Tên người dùng',
            width: 250,
            renderHeader: () => <div className="font-bold text-gray-800">Tên người dùng</div>,
            renderCell: (params) => (
                <p className="text-sm font-semibold text-gray-600">
                    {params?.row?.firstName} {params?.row?.lastName}
                </p>
            ),
        },
        {
            field: 'store',
            headerName: 'Cửa hàng',
            width: 250,
            renderCell: (params) => (
                <p className="font-regular text-sm text-gray-600">
                    {params?.row?.store?.name || 'Không có'}
                </p>
            ),
        },
        {
            field: 'role',
            headerName: 'Vai trò',
            width: 200,
            renderCell: (params) => {
                switch (params.value) {
                    case 'admin':
                        return (
                            <p className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-800">
                                Quản trị viên
                            </p>
                        );

                    case 'manager':
                        return (
                            <p className="rounded-full bg-purple-50 px-2 py-1 text-xs font-bold text-purple-800">
                                Cửa hàng trưởng
                            </p>
                        );
                    case 'staff':
                        return (
                            <p className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">
                                Nhân viên
                            </p>
                        );
                    default:
                        return (
                            <p className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-800">
                                Người dùng
                            </p>
                        );
                }
            },
        },
        {field: 'email', headerName: 'Email', width: 250},
        {field: 'phoneNumber', headerName: 'Số điện thoại', width: 200},
    ];

    const handleSearch = (value: string) => {
        if (value?.length > 0) {
            const filteredData = users.filter((user: any) => {
                if (user?.username.toLowerCase().includes(value.toLowerCase())) {
                    return true;
                } else {
                    let fullName = `${user?.firstName} ${user?.lastName}`;
                    return fullName.toLowerCase().includes(value.toLowerCase());
                }
            });
            setUserTableData([...filteredData]);
        } else {
            setUserTableData(users);
        }
    };

    React.useEffect(() => {
        getAllUser({addLoadingEffect: true, overrideCache: false});
    }, []);

    useEffect(() => {
        setUserTableData(users);
    }, [users]);

    return (
        <>
            <MainLayout
                title="Quản lý người dùng"
                content={
                    <div className="flex w-full flex-col gap-y-5 rounded-xl bg-white">
                        <div className="flex flex-row items-center justify-between">
                            <SimpleInput
                                name="search-user"
                                label="Tìm kiếm người dùng"
                                mode="text"
                                className="max-w-[400px] rounded-xl border border-gray-300 px-4 py-2 text-sm"
                                placeholder="John Doe"
                                autoComplete="off"
                                onChangeValue={(value: any) => handleSearch(value as string)}
                            />
                            <div>
                                {isAuthorizedForManager && (
                                    <Button
                                        title="Tạo người dùng"
                                        onClick={() => {
                                            setUserNeedToUpdate(null);
                                            setOpenDialog(true);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="h-[750px] w-full">
                            <DataGrid
                                disableColumnFilter={false}
                                className="shadow-xl"
                                sx={{borderRadius: '8px', overflow: 'hidden'}}
                                scrollbarSize={1}
                                rows={userTableData}
                                getEstimatedRowHeight={() => 42}
                                components={{
                                    LoadingOverlay: SpinnerWrapper,
                                }}
                                loading={loading}
                                paginationMode="client"
                                hideFooterSelectedRowCount={false}
                                columns={columns}
                                disableSelectionOnClick
                                pageSize={12}
                                rowHeight={50}
                                onSelectionModelChange={(newSelectionModel) => {
                                    setDeleteDisable(!deleteDisable);
                                    setSelectionModel(newSelectionModel);
                                }}
                                selectionModel={selectionModel}
                                checkboxSelection={false}
                            />
                        </div>
                    </div>
                }
            />

            {openDialog && (
                <>
                    {userNeedToUpdate ? (
                        <CreateAccountForm
                            currentUser={userNeedToUpdate as IUser}
                            isOpen={openDialog}
                            onClose={() => setOpenDialog(false)}
                            onSuccess={() => getAllUser({addLoadingEffect: false, overrideCache: true})}
                        />
                    ) : (
                        <CreateAccountForm
                            onSuccess={() => getAllUser({addLoadingEffect: false, overrideCache: true})}
                            isOpen={openDialog}
                            onClose={() => setOpenDialog(false)}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default UserManagement;
