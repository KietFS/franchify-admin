import * as React from 'react';
import {DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel} from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';

import ActionMenu from './ActionMenu';
import CreateAccountForm from './CreateAccount';
import Button from '../../designs/Button';
import {useAuth} from '../../hooks/useAuth';
import useUserManagement from "../../hooks/useUserManagement";

interface IUser {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    address?: IAddress;

    [key: string]: any;
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

const UserManagement = () => {
    const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [userNeedToUpdate, setUserNeedToUpdate] = React.useState<IUser | null>(null);
    const {users, getAllUser, loading, handleDeactivateUser, handleActivateUser, setUsers} = useUserManagement();
    const [userTableData, setUserTableData] = React.useState<IUser[]>([]);

    const {isAuthorizedForManager,} = useAuth();

    const columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Hành động',
            type: 'string',
            width: 100,
            renderCell: (params: GridRenderCellParams<any>) => {
                if (isAuthorizedForManager) {
                    {
                        const options = [
                            params?.row?.isActive == true
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
                    }
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
            width: 250,
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
        {
            field: 'isActive',
            headerName: 'Trạng thái',
            type: 'string',
            width: 150,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params: GridRenderCellParams<boolean>) =>
                params.value === true ? (
                    <p className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-800">
                        Đang hoạt động
                    </p>
                ) : (
                    <p className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-800">
                        Đã bị khóa
                    </p>
                ),
        },
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value?.length > 0) {
            const filteredData = users.filter((user: any) => {
                if (user?.username.toLowerCase().includes(value.toLowerCase())) {
                    return true
                } else {
                    let fullName = `${user?.firstName} ${user?.lastName}`;
                    return fullName.toLowerCase().includes(value.toLowerCase());
                }
            });
            setUserTableData([...filteredData]);
        } else {
            setUserTableData(users)
        }
    }


    React.useEffect(() => {
        getAllUser({addLoadingEffect: true});
        setUserTableData(users)
    }, []);

    return (
        <>
            <MainLayout
                title="Quản lý người dùng"
                content={
                    <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white rounded-xl">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-col space-y-2">
                                <label className="font-bold text-gray-600 text-sm">Tìm kiếm người dùng</label>
                                <input className="w-[300px] px-4 py-2 border border-gray-200 rounded-xl"
                                       placeholder="John Doe"
                                       onChange={handleSearch}
                                       name="search-user"/>
                            </div>

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
                        <div className="h-[700px] w-full">
                            <DataGrid
                                rows={userTableData}
                                loading={loading}
                                paginationMode="client"
                                columns={columns}
                                disableSelectionOnClick
                                pageSize={10}
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
                            onSuccess={() => getAllUser({addLoadingEffect: false})}
                        />
                    ) : (
                        <CreateAccountForm
                            onSuccess={() => getAllUser({addLoadingEffect: false})}
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
