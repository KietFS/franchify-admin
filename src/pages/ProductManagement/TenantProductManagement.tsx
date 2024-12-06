import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';
import Spinner from '../../components/Spinner';
import ActionMenu from '../../components/ActionMenu';
import CustomDialog from '../../components/CustomDialog';
import ProductForm from './ProductForm';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import SpinnerWrapper from '../../components/SpinnerWrapper';
import useProductManagement from '../../hooks/useProductMangement';
import SimpleInput from '../../components/SimpleInput';
import Button from '../../designs/Button';

interface ITenantProductManagementProps {
  onChangeViewMode: (mode: 'tenant' | 'store') => void;
}

const TenantProductManagement: React.FC<ITenantProductManagementProps> = (props) => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [selectedRow, setSelectedRow] = React.useState<string | number>('');
  const [selectedItem, setSelectedItem] = React.useState<IProduct | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);
  const {
    getAllProducts,
    deleteProduct,
    actionLoading,
    handleSearch,
    products,
    loading,
    createProduct,
    updateProduct,
  } = useProductManagement();

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
            onPress: async () => {
              setSelectedRow(params.row?.id);
              await deleteProduct(params.row?.id);
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
        return <p className="text-sm font-semibold text-gray-800">{params.value}</p>;
      },
    },
    { field: 'name', headerName: 'Tên sản phẩm', width: 250 },
    {
      field: 'category',
      headerName: 'Danh mục',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <p className="text-sm font-semibold text-yellow-600">{params.value?.name}</p>;
      },
    },
    {
      field: 'price',
      headerName: 'Giá bán',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <p className="text-sm font-semibold text-green-800">{params.value?.displayPrice}</p>;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <p className="font-semibold text-gray-600">{(params.value as string).prettyDate()}</p>
        );
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Ngày cập nhật',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <p className="font-semibold text-gray-600">{(params.value as string).prettyDate()}</p>
        );
      },
    },
  ];

  React.useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      <MainLayout
        title="Quản lý sản phẩm "
        content={
          <>
            <div className="mb-6 flex w-full flex-row items-center justify-between gap-x-2 gap-y-2">
              <div className="flex flex-col space-y-2">
                <SimpleInput
                  name="search-user"
                  label="Tìm kiếm sản phẩm"
                  mode="text"
                  className="max-w-[400px] rounded-xl border border-gray-300 px-4 py-2 text-sm"
                  placeholder="Trà sữa"
                  autoComplete="off"
                  onChangeValue={(value) => handleSearch(value as string)}
                />
              </div>
              <div className="flex items-center gap-x-4">
                <Button
                  title="Thêm sản phẩm"
                  onClick={() => {
                    setOpenUpdateModal(true);
                    setSelectedItem(null);
                  }}
                  className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
                ></Button>
                <Button
                  title="Xem theo cửa hàng"
                  onClick={() => {
                    props.onChangeViewMode?.('store');
                  }}
                  className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-6 py-1 font-bold text-white hover:opacity-80"
                ></Button>
              </div>
            </div>

            <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
              <div className="h-[750px] w-full shadow-lg">
                <DataGrid
                  sx={{ borderRadius: '8px' }}
                  components={{
                    LoadingOverlay: SpinnerWrapper,
                  }}
                  loading={loading}
                  rows={products}
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
              onConfirm={async (productValue) => {
                if (!!selectedItem) {
                  setSelectedRow(selectedItem?.id);
                  await updateProduct(selectedItem?.id, productValue, () =>
                    setOpenUpdateModal(false),
                  );
                } else {
                  await createProduct(
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
