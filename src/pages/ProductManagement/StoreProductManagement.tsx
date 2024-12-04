import * as React from 'react';
import { useEffect } from 'react';
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
import { PlusIcon } from '@heroicons/react/24/outline';
import SelectComponent from '../../components/Select';
import ImportProductForm from './ImportProducForm';
import StoreProductForm from './StoreProductForm';
import useStoreManagement from '../../hooks/useStoreManagement';
import SpinnerWrapper from '../../components/SpinnerWrapper';
import useProductManagement from '../../hooks/useProductMangement';

interface IStoreManagementProps {
  onChangeViewMode: (mode: 'tenant' | 'store') => void;
}

const StoreProductManagement: React.FC<IStoreManagementProps> = (props) => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const { user, accessToken } = useAppSelector((state: IRootState) => state.auth);

  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>('');
  const [selectedItem, setSelectedItem] = React.useState<IStoreProduct | null>(null);
  const [openImportProductModal, setOpenImportProductModal] = React.useState<boolean>(false);
  const [currentStore, setCurrentStore] = React.useState<IStore | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);

  const { getAllStores, listStore, loading: storeLoading } = useStoreManagement();
  const { getAllStoreProducts, storeProducts, storeProductLoading } = useProductManagement();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'product.upc',
      headerName: 'Mã sản phẩm',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div className="text-sm font-bold text-gray-600">{params.row.product?.upc}</div>;
      },
    },
    {
      field: 'product.name',
      headerName: 'Tên sản phẩm',
      width: 250,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div className="">{params.row.product?.name}</div>;
      },
    },
    {
      field: 'inventory',
      headerName: 'Còn trong kho',
      width: 150,
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
      field: 'product.reatedAt',
      headerName: 'Ngày tạo',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div className="">{(params.row.product?.createdAt as string).prettyDate()}</div>;
      },
    },
    {
      field: 'product.updatedAt',
      headerName: 'Ngày cập nhật',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div className="">{(params.row.product?.updatedAt as string).prettyDate()}</div>;
      },
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'string',
      width: 300,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params: GridRenderCellParams<any>) => {
        const options = [
          {
            id: 'update',
            title: 'Cập nhật sản phẩm',
            onPress: () => {
              setSelectedItem(params.row as IStoreProduct);
              setOpenUpdateModal(true);
            },
            onActionSuccess: () => getAllStoreProducts(),
          },
        ];
        return actionLoading && selectedRow == params.row?.id ? (
          <Spinner size={20} />
        ) : (
          <ActionMenu options={options} />
        );
      },
    },
  ];

  const updateStoreProduct = async (upc: string, values: Omit<IStoreProduct, 'id'>) => {
    try {
      setActionLoading(true);
      const response = await axios.put(
        `${apiURL}/products/${currentStore?.id}/products/${upc}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response?.data?.success) {
        setActionLoading(false);
        toast.success('Cập nhật sản phẩm thành công');
        setOpenUpdateModal(false);
        await getAllStoreProducts();
      } else {
        toast.error(response?.data?.data || response?.data?.error || 'Cập nhật sản phẩm thất bại');
      }
    } catch (error) {
      setActionLoading(false);
      setOpenUpdateModal(false);
      console.log('Client Error', error);
    }
  };

  React.useEffect(() => {
    if (!!currentStore) {
      getAllStoreProducts();
    }
  }, [currentStore]);

  React.useEffect(() => {
    getAllStores();
  }, []);

  useEffect(() => {
    const currentStore = listStore.find((store) => store.id == user.store.id);
    if (currentStore) {
      setCurrentStore(currentStore);
    }
  }, [listStore]);

  return (
    <>
      <MainLayout
        title="Quản lý sản phẩm "
        content={
          <>
            <div className="mb-6 flex w-full items-center justify-between gap-y-2">
              <div className="flex items-center">
                <SelectComponent
                  optionSelected={currentStore}
                  options={listStore}
                  name="currentStore"
                  disabled={user.role == 'admin' ? false : true}
                  label={user.role == 'admin' ? 'Chọn cửa hàng' : 'Cửa hàng'}
                  onSelect={(store) => {
                    if (store.id === 'all') {
                      props.onChangeViewMode('tenant');
                    } else {
                      setCurrentStore(store);
                    }
                  }}
                  placeholder={user.role == 'admin' ? 'Chọn cửa hàng' : 'Cửa hàng'}
                />
              </div>
              <button
                onClick={() => {
                  setOpenImportProductModal(true);
                  setSelectedItem(null);
                }}
                className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
              >
                <PlusIcon className="h-[20px] w-[20px] font-bold text-white" />
                <p>Nhập sản phẩm</p>
              </button>
            </div>

            <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white">
              <div className="h-[700px] w-full">
                <DataGrid
                  sx={{ borderRadius: '8px' }}
                  loading={false}
                  components={{
                    LoadingOverlay: SpinnerWrapper,
                  }}
                  rows={storeProducts}
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

      {openImportProductModal ? (
        <CustomDialog
          title={'Nhập sản phẩm'}
          maxWidth="lg"
          open={openImportProductModal}
          onClose={() => setOpenImportProductModal(false)}
          children={
            <ImportProductForm
              onImportSuccess={() => getAllStoreProducts()}
              storeId={currentStore?.id as number}
              currentStoreProduct={storeProducts}
              open={openImportProductModal}
              onClose={() => setOpenImportProductModal(false)}
            />
          }
        />
      ) : null}

      {openUpdateModal && (
        <CustomDialog
          title={`Chỉnh sửa sản phẩm tại cửa hàng ${currentStore?.name}`}
          maxWidth="md"
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          children={
            <StoreProductForm
              onClose={() => setOpenImportProductModal(false)}
              loading={actionLoading}
              currentProduct={selectedItem}
              onConfirm={(storeProductValue) => {
                if (!!selectedItem) {
                  updateStoreProduct(selectedItem?.product?.upc as string, storeProductValue);
                }
              }}
            />
          }
        />
      )}
    </>
  );
};

export default StoreProductManagement;
