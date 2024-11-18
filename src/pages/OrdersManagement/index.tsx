import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';
import { Pagination } from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState, store } from '../../redux';
import { apiURL } from '../../config/constanst';

import OrderActionMenu from './ActionMenu';
import { toast } from 'react-toastify';
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

const OrdersManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);

  enum OrderStatus {
    PENDING = 'pending',
    RECEIVED = 'received',
    PROCESSING = 'processing',
    SHIPPING = 'shipping',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
  }

  const status = {
    pending: {
      label: 'Chờ xác nhận',
      actionLabel: 'Chuyển sang xác nhận',
      status: 'received',
      onclick: () => {},
    },
    received: {
      label: 'Đã nhận đơn',
      actionLabel: 'Chuyển sang xử lý',
      status: 'processing',
      onclick: () => {},
    },
    processing: {
      label: 'Đang xử lý',
      actionLabel: 'Chuyển sang giao hàng',
      status: 'shipping',
      onclick: () => {},
    },
    shipping: {
      label: 'Đang giao hàng',
      actionLabel: 'Chuyển sang đã giao hàng',
      status: 'delivered',
      onclick: () => {},
    },
    delivered: {
      label: 'Đã giao hàng',
      actionLabel: 'Chuyển sang hoàn thành',
      status: 'completed',
      onclick: () => {},
    },
    completed: {
      label: 'Hoàn thành',
      actionLabel: '',
    },
  };

  const { user, accessToken, isAuthorizedForAdmin, isAuthorizedForManager } = useAuth();

  const renderOrderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-sm font-bold text-yellow-600">Đang chờ xử lý</span>;

      case 'received':
        return <span className="text-sm font-bold text-blue-600">Đã nhận đơn</span>;

      case 'processing':
        return <span className="text-sm font-bold text-lime-600">Đang xử lý</span>;

      case 'shipping':
        return <span className="text-sm font-bold text-blue-600">Đang giao hàng</span>;

      case 'delivered':
        return <span className="text-sm font-bold text-orange-600">Đã giao hàng</span>;

      case 'cancelled':
        return <span className="text-sm font-bold text-red-600">Đã hủy</span>;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderHeader: () => <div className="font-bold text-gray-800">ID</div>,
    },
    {
      field: 'user',
      headerName: 'Người đặt hàng',
      width: 200,
      renderCell: (params) => (
        <div className="font-bold text-gray-600">
          {params?.row?.user?.firstName} {params?.row?.user?.lastName}{' '}
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      type: 'string',
      width: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => renderOrderStatus(params.row.status as string),
    },
    {
      field: 'totalAmount',
      headerName: 'Giá trị đơn hàng',
      width: 200,
      renderCell: (params) => (
        <div className="font-bold text-green-600">
          {Number(params?.row?.totalAmount)?.toString()?.prettyMoney()}
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      type: 'string',
      width: 200,
      renderCell: (params) => (
        <div className="text-gray-600">
          {(params?.row?.createdAt?.toString() as string)?.prettyDateTime()}
        </div>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Ngày cập nhật',
      type: 'string',
      width: 200,
      renderCell: (params) => (
        <div className="text-gray-600">
          {(params?.row?.updatedAt?.toString() as string)?.prettyDateTime()}
        </div>
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
            const handleUpdateOrderStatus = async (status: string) => {
              try {
                setLoading(true);
                const payload = {
                  status: status,
                };
                const response = await axios.put(`${apiURL}/orders/${params.row.id}`, payload, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });

                if (response?.data?.success == true) {
                  setLoading(false);
                  toast.success('Cập nhật đơn hàng thành công');
                  getAllOrderByStore({ addLoadingEffect: true });
                } else {
                  setLoading(false);
                }
              } catch (error) {
                setLoading(false);
                console.log('error');
              } finally {
                setLoading(false);
              }
            };

            //@ts-ignore
            const option = status?.[params.row.status as any] as any;

            return (
              <OrderActionMenu
                option={{ ...option, onClick: () => handleUpdateOrderStatus(option?.status) }}
              />
            );
          }
        } else {
          return <></>;
        }
      },
    },
  ];

  const getAllOrderByStore = async (params?: { addLoadingEffect?: boolean }) => {
    const { addLoadingEffect } = params || {};
    try {
      addLoadingEffect && setLoading(true);

      const requestURl = `${apiURL}/orders/store/${user?.store?.id}`;

      console.log('requestURl', requestURl);

      const response = await axios.get(`${requestURl}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!!response) {
        console.log('response', response);
      }

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
    getAllOrderByStore({ addLoadingEffect: true });
  }, [page]);

  console.log('users', user);

  return (
    <>
      <MainLayout
        title="Quản lý đơn hàng"
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
    </>
  );
};

export default OrdersManagement;
