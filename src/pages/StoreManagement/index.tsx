import * as React from 'react';
import { useEffect } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '@/components/MainLayout';
import CreateStoreForm from './CreateStoreForm';
import CustomDialog from '@/components/CustomDialog';
import { toast } from 'react-toastify';
import UpdateStoreForm from './UpdateStoreForm';
import useStoreManagement from '@/hooks/useStoreManagement';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import ActionMenu from '@/components/ActionMenu';
import SpinnerWrapper from '@/components/SpinnerWrapper';
import SimpleInput from '@/components/SimpleInput';
import Button from '@/designs/Button';
import { IStore } from '@/types/models';

interface IStoreProps {
  id: number;
  name: string;
  storeCode: number;
  supportDelivery: boolean;
  supportPickup: boolean;
  openTime: number;
  closeTime: number;
  lng: number | null;
  lat: number | null;
  address: {
    streetAddress: string;
    state: string;
    city: string;
    country: string;
  };
}

const StoreManagement = () => {
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = React.useState<IStoreProps | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false); // Use
  const [openCreateModal, setOpenCreateModal] = React.useState<boolean>(false); // Use // openUpdateModal
  const { getAllStores, listStore, loading } = useStoreManagement();
  const [storeTableData, setStoreTableData] = React.useState<IStore[]>([]);

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        const options = [
          {
            id: 'update',
            title: 'Cập nhật cửa hàng',
            onPress: () => {
              setSelectedItem(params.row as IStoreProps);
              setOpenUpdateModal(true);
            },
            onActionSuccess: () => getAllStores(),
          },
        ];
        return loading && selectionModel.includes(params.row.id) ? (
          <Spinner size={20} />
        ) : (
          <ActionMenu options={options} />
        );
      },
    },
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'name',
      headerName: 'Tên cửa hàng',
      width: 400,
    },
    {
      field: 'supportDelivery',
      headerName: 'Hỗ trợ giao hàng',
      width: 150,
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value ? (
          <p className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-800">
            Có hỗ trợ
          </p>
        ) : (
          <p className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-800">
            Không hỗ trợ
          </p>
        ),
    },
    {
      field: 'supportPickup',
      headerName: 'Hỗ trợ lấy hàng',
      width: 150,
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value ? (
          <p className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-800">
            Có hỗ trợ
          </p>
        ) : (
          <p className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-800">
            Không hỗ trợ
          </p>
        ),
    },
    {
      field: 'openTime',
      headerName: 'Giờ mở cửa',
      width: 150,
    },
    {
      field: 'closeTime',
      headerName: 'Giờ đóng cửa',
      width: 150,
    },
  ];

  React.useEffect(() => {
    if (user) {
      getAllStores();
    }
  }, [user]);

  useEffect(() => {
    if (listStore) {
      setStoreTableData(listStore);
    }
  }, [listStore]);

  const handleSearch = (value: string) => {
    if (value?.length > 0) {
      const filteredData = listStore.filter((category: any) => {
        return category?.name.toLowerCase().includes(value.toLowerCase());
      });
      setStoreTableData([...filteredData]);
    } else {
      setStoreTableData(listStore);
    }
  };

  return (
    <MainLayout
      title="Quản lý cửa hàng"
      content={
        <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white">
          <div className="flex flex-row items-center justify-between">
            <SimpleInput
              name="search-user"
              label="Tìm kiếm cừa hàng"
              mode="text"
              className="max-w-[400px] rounded-xl border border-gray-300 px-4 py-2 text-sm"
              placeholder="John Doe"
              autoComplete="off"
              onChangeValue={(value) => handleSearch(value as string)}
            />
            <div className="flex flex-row gap-x-2">
              <Button
                title="Thêm cửa hàng"
                onClick={() => {
                  setSelectedItem(null);
                  setOpenCreateModal(true);
                }}
                className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
              ></Button>
            </div>
          </div>
          <div className="h-[700px] w-full">
            <DataGrid
              sx={{ borderRadius: '8px' }}
              components={{
                LoadingOverlay: SpinnerWrapper,
              }}
              loading={loading}
              rows={storeTableData}
              getRowId={(row) => row.id}
              paginationMode="client"
              pageSize={10}
              columns={columns}
              disableSelectionOnClick
              onSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
              selectionModel={selectionModel}
              checkboxSelection={false}
            />
          </div>

          {openUpdateModal && (
            <CustomDialog
              title={'Cập nhật cửa hàng'}
              open={openUpdateModal}
              onClose={() => setOpenUpdateModal(false)}
            >
              <UpdateStoreForm
                onClose={() => setOpenUpdateModal(false)}
                onSuccess={async () => {
                  setOpenUpdateModal(false);
                  await getAllStores();
                  toast.success('Cập nhật cửa hàng thành công');
                }}
                // @ts-ignore
                currentStore={selectedItem}
                loading={loading}
              />
            </CustomDialog>
          )}

          {openCreateModal && (
            <CustomDialog
              title={'Thêm cửa hàng'}
              open={openCreateModal}
              onClose={() => setOpenCreateModal(false)}
            >
              <CreateStoreForm
                onClose={() => setOpenCreateModal(false)}
                onSuccess={async () => {
                  setOpenCreateModal(false);
                  await getAllStores();
                  toast.success('Tạo cửa hàng thành công');
                }}
                loading={loading}
              />
            </CustomDialog>
          )}
        </div>
      }
    />
  );
};

export default StoreManagement;
