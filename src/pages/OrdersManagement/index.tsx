import * as React from 'react';
import {DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel} from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import {apiURL} from '../../config/constanst';

import OrderActionMenu from './ActionMenu';
import {toast} from 'react-toastify';
import {useAuth} from '../../hooks/useAuth';
import CustomDialog from '../../components/CustomDialog';
import OrderForm from './OrderForm';
import SelectComponent from '../../components/Select';
import SpinnerWrapper from "../../components/SpinnerWrapper";

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
    const statusList = [
        {
            id: 'pending',
            label: 'Chờ xác nhận',
        },
        {
            id: 'received',
            label: 'Đã nhận đơn',
        },
        {
            id: 'processing',
            label: 'Đang xử lý',
        },
        {
            id: 'shipping',
            label: 'Đang giao hàng',
        },
        {
            id: 'delivered',
            label: 'Đã giao hàng',
        },
        {
            id: 'completed',
            label: 'Hoàn thành',
        },
    ];

    const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    const [orders, setOrders] = React.useState<IOrder[]>([]);
    const [showOrders, setShowOrders] = React.useState<IOrder[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [orderSelected, setOrderSelected] = React.useState<any | null>(null);
    const [statusSelected, setStatusSelected] = React.useState<any>(statusList[0]);

    const status = {
        pending: {
            label: 'Chờ xác nhận',
            actionLabel: 'Chuyển sang xác nhận',
            status: 'received',
            onclick: () => {
            },
        },
        received: {
            label: 'Đã nhận đơn',
            actionLabel: 'Chuyển sang xử lý',
            status: 'processing',
            onclick: () => {
            },
        },
        processing: {
            label: 'Đang xử lý',
            actionLabel: 'Chuyển sang giao hàng',
            status: 'shipping',
            onclick: () => {
            },
        },
        shipping: {
            label: 'Đang giao hàng',
            actionLabel: 'Chuyển sang đã giao hàng',
            status: 'delivered',
            onclick: () => {
            },
        },
        delivered: {
            label: 'Đã giao hàng',
            actionLabel: 'Chuyển sang hoàn thành',
            status: 'completed',
            onclick: () => {
            },
        },
        completed: {
            label: 'Hoàn thành',
            actionLabel: '',
        },
    };

    const {user, accessToken, isAuthorizedForAdmin, isAuthorizedForManager} = useAuth();

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
            field: 'actions',
            headerName: 'Hành động',
            type: 'string',
            width: 100,
            renderCell: (params: GridRenderCellParams<any>) => {
                if (isAuthorizedForManager) {
                    {
                        //@ts-ignore
                        const option = status?.[params.row.status as any] as any;
                        return (
                            <OrderActionMenu
                                onViewDetail={() => {
                                    setOrderSelected(params.row);
                                    setOpenDialog(true);
                                }}
                                option={{
                                    ...option,
                                    onClick: () => handleUpdateOrderStatus(params.row.id, option?.status),
                                }}
                            />
                        );
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
    ];

    const getAllOrderByStore = async (params?: { addLoadingEffect?: boolean }) => {
        const {addLoadingEffect} = params || {};
        try {
            addLoadingEffect && setLoading(true);

            const requestURl = `${apiURL}/orders/store/${user?.store?.id}`;

            const response = await axios.get(`${requestURl}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response?.data?.success == true) {
                setOrders(response?.data?.data);
            }
        } catch (error) {
            console.log('GET USER ERROR', error);
        } finally {
            addLoadingEffect && setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (id: number, status: string) => {
        try {
            setLoading(true);
            const payload = {
                status: status,
            };
            const response = await axios.put(`${apiURL}/orders/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response?.data?.success == true) {
                setLoading(false);
                toast.success('Cập nhật đơn hàng thành công');
                getAllOrderByStore({addLoadingEffect: true});
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

    React.useEffect(() => {
        getAllOrderByStore({addLoadingEffect: true});
    }, []);

    React.useEffect(() => {
        if (statusSelected) {
            const filterOrders = orders.filter((order) => order.status == statusSelected?.id);
            setShowOrders([...filterOrders]);
        }
    }, [statusSelected, orders]);

    return (
        <>
            <MainLayout
                title="Quản lý đơn hàng"
                content={
                    <>
                        <div className="mb-8 w-[250px]">
                            <SelectComponent
                                optionSelected={statusSelected}
                                options={statusList}
                                keyLabel="label"
                                keyValue="id"
                                onSelect={(value) => setStatusSelected(value)}
                                name="status"
                                placeholder="Chọn trạng thái"
                                label="Trạng thái đơn hàng"
                            />
                        </div>
                        <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white">
                            <div className="h-[800px] w-full">
                                <DataGrid
                                    components={{
                                        NoRowsOverlay:
                                            () => (
                                                <div className="w-full h-full flex justify-center items-center"><p
                                                    className="text-sm text-gray-500">Không có dữ liệu</p></div>
                                            ),
                                        LoadingOverlay: SpinnerWrapper,
                                    }}
                                    sx={{borderRadius: '8px'}}
                                    rows={showOrders || orders}
                                    loading={loading}
                                    paginationMode="client"
                                    pageSize={12}
                                    columns={columns}
                                    disableSelectionOnClick
                                    onSelectionModelChange={(newSelectionModel) => {
                                        setDeleteDisable(!deleteDisable);
                                        setSelectionModel(newSelectionModel);
                                    }}
                                    selectionModel={selectionModel}
                                    checkboxSelection={false}
                                />
                            </div>
                        </div>
                    </>
                }
            />

            {openDialog ? (
                <CustomDialog
                    title="Chi tiết đơn hàng"
                    open={openDialog}
                    maxWidth="lg"
                    onClose={() => {
                        setOpenDialog(false);
                        setOrderSelected(null);
                    }}
                    children={
                        <OrderForm
                            currentOrder={orderSelected}
                            onConfirm={(values) => {
                                handleUpdateOrderStatus(orderSelected?.id, values?.status as string);
                                setOpenDialog(false);
                                setOrderSelected(null);
                            }}
                        />
                    }
                />
            ) : null}
        </>
    );
};

export default OrdersManagement;
