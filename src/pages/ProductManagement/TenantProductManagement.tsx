import * as React from 'react';
import {DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel} from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import {useAppSelector} from '../../hooks/useRedux';
import {IRootState} from '../../redux';
import Spinner from '../../components/Spinner';
import {apiURL} from '../../config/constanst';
import ActionMenu from '../../components/ActionMenu';
import {toast} from 'react-toastify';
import CustomDialog from '../../components/CustomDialog';
import ProductForm from './ProductForm';
import {EyeIcon, PlusIcon} from '@heroicons/react/24/outline';

interface ITenantProductManagementProps {
    onChangeViewMode: (mode: 'tenant' | 'store') => void;
}

const TenantProductManagement: React.FC<ITenantProductManagementProps> = (props) => {
    const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    const {user, accessToken} = useAppSelector((state: IRootState) => state.auth);
    const [products, setProducts] = React.useState<IProduct[]>([]);
    const [productTableData, setProductTableData] = React.useState<IProduct[]>([]);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    const [actionLoading, setActionLoading] = React.useState<boolean>(false);
    const [selectedRow, setSelectedRow] = React.useState<string | number>('');
    const [selectedItem, setSelectedItem] = React.useState<IProduct | null>(null);
    const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiURL}/products?&page=1&pageSize=200`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response) {
                console.log('GET PRODUCT RESPONSE', response);
            }

            if (response?.data?.success) {
                setProducts(response?.data?.data?.results);
                setProductTableData(response?.data?.data?.results);
                setTotalPage(response?.data?.data?.totalPage);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.log('GET PRODUCT RESPONSE', error);
        } finally {
            setLoading(false);
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Hành động',
            type: 'string',
            width: 100,
            renderCell: (params: GridRenderCellParams<any>) => {
                const options = [
                    {
                        id: 'delete',
                        title: 'Xóa sản phẩm',
                        onPress: () => {
                            deleteProduct(params.row?.id);
                        },
                        onActionSuccess: () => getAllProducts(),
                    },
                    {
                        id: 'update',
                        title: 'Cập nhật sản phẩm',
                        onPress: () => {
                            setSelectedItem(params.row as IProduct);
                            setOpenUpdateModal(true);
                        },
                        onActionSuccess: () => getAllProducts(),
                    },
                ];
                return actionLoading && selectedRow == params.row?.id ? (
                    <Spinner size={20}/>
                ) : (
                    <ActionMenu options={options}/>
                );
            },
        },
        {field: 'id', headerName: 'ID', width: 70},
        {
            field: 'upc',
            headerName: 'Mã sản phẩm',
            width: 200,
            renderCell: (params: GridRenderCellParams<any>) => {
                return <div className="text-sm font-semibold text-gray-800">{params.value}</div>;
            },
        },
        {field: 'name', headerName: 'Tên sản phẩm', width: 250},
        {
            field: 'category',
            headerName: 'Danh mục',
            width: 200,
            renderCell: (params: GridRenderCellParams<any>) => {
                return <div className="text-sm font-semibold text-yellow-600">{params.value?.name}</div>;
            },
        },
        {
            field: 'price',
            headerName: 'Giá bán',
            width: 200,
            renderCell: (params: GridRenderCellParams<any>) => {
                return (
                    <div className="text-sm font-semibold text-green-800">{params.value?.displayPrice}</div>
                );
            },
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 150,
            renderCell: (params: GridRenderCellParams<any>) => {
                return <div>{(params.value as string).prettyDate()}</div>;
            },
        },
        {
            field: 'updatedAt',
            headerName: 'Ngày cập nhật',
            width: 150,
            renderCell: (params: GridRenderCellParams<any>) => {
                return <div>{(params.value as string).prettyDate()}</div>;
            },
        },
    ];

    const updateProduct = async (id: string | number, values: Omit<IProduct, 'id'>) => {
        try {
            setActionLoading(true);
            setSelectedRow(id);
            const response = await axios.put(`${apiURL}/products/${id}/`, values, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setActionLoading(false);
                getAllProducts();
                toast.success('Cập nhật sản phẩm thành công');
                setOpenUpdateModal(false);
            } else {
                toast.error(response?.data?.data || response?.data?.error || 'Cập nhật sản phẩm thất bại');
            }
        } catch (error) {
            setActionLoading(false);
            console.log('Client Error', error);
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            setActionLoading(true);
            setSelectedRow(id);
            const response = await axios.delete(`${apiURL}/products/${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setActionLoading(false);
                getAllProducts();
                toast.success('Xóa sản phẩm thành công');
            } else {
                toast.error(response?.data?.data || response?.data?.error || 'Xóa sản phẩm thất bại');
            }
        } catch (error) {
            setActionLoading(false);
            console.log('Client Error', error);
        }
    };

    const createProduct = async (values: Omit<IProduct, 'id'>) => {
        try {
            setActionLoading(true);
            const response = await axios.post(`${apiURL}/products/`, values, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setActionLoading(false);
                getAllProducts();
                toast.success('Thêm sản phẩm thành công');
                setOpenUpdateModal(false);
            } else {
                console.log('Error', response?.data?.data, response?.data?.error);
            }
        } catch (error) {
            setActionLoading(false);
            console.log('Client Error', error);
        }
    };

    React.useEffect(() => {
        getAllProducts();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value?.length > 0) {
            const filteredData = products.filter((user: any) => {
                if (user?.name.toLowerCase().includes(value.toLowerCase())) {
                    return true
                }
            });
            setProductTableData([...filteredData]);
        } else {
            setProductTableData(products)
        }
    }

    return (
        <>
            <MainLayout
                title="Danh sách sản phẩm "
                content={
                    <>
                        <div className="mb-6 flex w-full flex-row gap-x-2 gap-y-2 items-center justify-between">
                            <div className="flex flex-col space-y-2">
                                <label className="font-bold text-gray-600 text-sm">Tìm kiếm sản phẩm</label>
                                <input className="w-[300px] px-4 py-2 border border-gray-200 rounded-xl"
                                       placeholder="John Doe"
                                       onChange={handleSearch}
                                       name="search-user"/>
                            </div>
                            <div className="flex items-center gap-x-4 ">
                                <button
                                    onClick={() => {
                                        setOpenUpdateModal(true);
                                        setSelectedItem(null);
                                    }}
                                    className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
                                >
                                    <PlusIcon className="h-[20px] w-[20px] font-bold text-white"/>
                                    <p>Thêm sản phẩm</p>
                                </button>
                                <button
                                    onClick={() => {
                                        props.onChangeViewMode('store');
                                    }}
                                    className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
                                >
                                    <EyeIcon className="mr-1 h-[20px] w-[20px] font-bold text-white"/>
                                    <p>Xem theo cửa hàng</p>
                                </button>
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
                            <div className="h-[700px] w-full">
                                <DataGrid
                                    loading={isLoading}
                                    rows={productTableData || products}
                                    paginationMode="client"
                                    pageSize={10}
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

            {openUpdateModal ? (
                <CustomDialog
                    title={!!selectedItem ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                    open={openUpdateModal}
                    onClose={() => setOpenUpdateModal(false)}
                    children={
                        <ProductForm
                            onClose={() => setOpenUpdateModal(false)}
                            loading={actionLoading}
                            currentProduct={selectedItem}
                            onConfirm={(productValue) => {
                                if (!!selectedItem) {
                                    updateProduct(selectedItem?.id, productValue);
                                    // setOpenUpdateModal(false);
                                } else {
                                    createProduct({
                                        ...productValue,
                                    });
                                    // setOpenUpdateModal(false);
                                }
                            }}
                        />
                    }
                />
            ) : null}
        </>
    );
};

export default TenantProductManagement;
