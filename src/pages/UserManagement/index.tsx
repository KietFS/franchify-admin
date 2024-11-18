import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';
import { Pagination } from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState, store } from '../../redux';
import { apiURL } from '../../config/constanst';

import ActionMenu from './ActionMenu';
import { toast } from 'react-toastify';
import CreateAccountForm from './CreateAccount';
import Button from '../../designs/Button';
import { useAuth } from '../../hooks/useAuth';

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

const UserManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [userNeedToUpdate, setUserNeedToUpdate] = React.useState<IUser | null>(null);

  const { user, accessToken, isAuthorizedForAdmin, isAuthorizedForManager } = useAuth();

  const columns: GridColDef[] = [
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
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phoneNumber', headerName: 'Số điện thoại', width: 200 },
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
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'string',
      width: 300,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params: GridRenderCellParams<any>) => {
        if (isAuthorizedForManager) {
          {
            const handleDeactivateUser = async (id: string | number) => {
              try {
                const payload = {
                  isActive: false,
                  store: 8,
                };
                const response = await axios.put(`${apiURL}/tenant/users/${id}`, payload, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });

                if (response?.data?.success == true) {
                  toast.success('Vô hiệu hóa tài khoản thành công');
                  getAllUser({ addLoadingEffect: true });
                } else {
                }
              } catch (error) {
                console.log('error');
              }
            };

            const handleActivateUser = async (id: string | number) => {
              try {
                const payload = {
                  isActive: true,
                  store: 8,
                };
                const response = await axios.put(`${apiURL}/tenant/users/${id}`, payload, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });

                if (response?.data?.success == true) {
                  toast.success('Kích hoạt tài khoản thành công');
                  getAllUser({ addLoadingEffect: false });
                } else {
                }
              } catch (error) {
                console.log('error');
              }
            };

            const options = [
              params?.row?.isActive == true
                ? {
                    id: 'deactivate',
                    title: 'Khóa',
                    onPress: () => handleDeactivateUser(params.row?.id),
                    onActionSuccess: () => getAllUser({ addLoadingEffect: false }),
                  }
                : {
                    id: 'activate',
                    title: 'Cập nhật',
                    onPress: () => handleActivateUser(params.row?.id),
                    onActionSuccess: () => getAllUser({ addLoadingEffect: false }),
                  },
              {
                id: 'update-account',
                title: 'Cập nhật',
                onPress: () => {
                  setOpenDialog(true);
                  setUserNeedToUpdate(params.row);
                },
                onActionSuccess: () => getAllUser({ addLoadingEffect: false }),
              },
            ];
            return <ActionMenu options={options} />;
          }
        } else {
          return <></>;
        }
      },
    },
  ];

  const getAllUser = async (params?: { addLoadingEffect?: boolean }) => {
    const { addLoadingEffect } = params || {};
    try {
      addLoadingEffect && setLoading(true);

      const requestURl = isAuthorizedForAdmin
        ? `${apiURL}/tenant/users`
        : `${apiURL}/tenant/staffs/${user?.store?.id}`;

      const response = await axios.get(`${requestURl}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success == true) {
        setUsers(response?.data?.data);
        setTotalPage(response?.data?._totalPage);
      }
    } catch (error) {
      console.log('GET USER ERROR', error);
    } finally {
      addLoadingEffect && setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllUser({ addLoadingEffect: true });
  }, [page]);

  console.log('users', user);

  return (
    <>
      <MainLayout
        title="Quản lý người dùng"
        content={
          <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-x-2">
                <Pagination
                  onChange={(event, changedPage) => setPage(changedPage)}
                  count={totalPage}
                  defaultPage={1}
                  page={page}
                />
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
            <div className="h-[800px] w-full">
              <DataGrid
                rows={users}
                loading={loading}
                paginationMode="server"
                page={page}
                rowCount={totalPage}
                pageSize={10}
                columns={columns}
                hideFooterPagination
                disableSelectionOnClick
                // onPageChange={(current) => setPage(current)}
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
              currentUser={userNeedToUpdate as any}
              isOpen={openDialog}
              onClose={() => setOpenDialog(false)}
              onSuccess={() => getAllUser({ addLoadingEffect: false })}
            />
          ) : (
            <CreateAccountForm
              onSuccess={() => getAllUser({ addLoadingEffect: false })}
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
