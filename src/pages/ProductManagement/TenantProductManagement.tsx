import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import Spinner from '../../components/Spinner';
import { apiURL } from '../../config/constanst';
import ActionMenu from '../../components/ActionMenu';
import { toast } from 'react-toastify';
import CustomDialog from '../../components/CustomDialog';
import ProductForm from './ProductForm';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import useProductManagement from '../../hooks/useProductMangement';

interface ITenantProductManagementProps {
  onChangeViewMode: (mode: 'tenant' | 'store') => void;
}

const TenantProductManagement: React.FC<ITenantProductManagementProps> = (props) => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const { user, accessToken } = useAppSelector((state: IRootState) => state.auth);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>('');
  const [selectedItem, setSelectedItem] = React.useState<IProduct | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);
  const { getAllProducts, createProduct, productTableData, loading, handleSearch } =
    useProductManagement();

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
          <Spinner size={20} />
        ) : (
          <ActionMenu options={options} />
        );
      },
    },
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'upc',
      headerName: 'Mã sản phẩm',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div className="text-sm font-semibold text-gray-800">{params.value}</div>;
      },
    },
    { field: 'name', headerName: 'Tên sản phẩm', width: 250 },
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

  React.useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      <MainLayout
        title="Danh sách sản phẩm "
        content={
          <>
            <div className="mb-6 flex w-full flex-row items-center justify-between gap-x-2 gap-y-2">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-gray-600">Tìm kiếm sản phẩm</label>
                <input
                  className="w-[300px] rounded-xl border border-gray-200 px-4 py-2 text-sm"
                  placeholder="Trà sữa"
                  onChange={(e) => handleSearch(e.target.value)}
                  name="search-user"
                />
              </div>
              <div className="flex items-center gap-x-4">
                <button
                  onClick={() => {
                    setOpenUpdateModal(true);
                    setSelectedItem(null);
                  }}
                  className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
                >
                  <PlusIcon className="h-[20px] w-[20px] font-bold text-white" />
                  <p>Thêm sản phẩm</p>
                </button>
                <button
                  onClick={() => {
                    props.onChangeViewMode('store');
                  }}
                  className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
                >
                  <EyeIcon className="mr-1 h-[20px] w-[20px] font-bold text-white" />
                  <p>Xem theo cửa hàng</p>
                </button>
              </div>
            </div>

            <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
              <div className="h-[700px] w-full">
                <DataGrid
                  sx={{ borderRadius: '8px' }}
                  loading={loading}
                  rows={productTableData}
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
                } else {
                  createProduct(
                    {
                      ...productValue,
                    },
                    () => setOpenUpdateModal(false),
                  );
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
