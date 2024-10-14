import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/SIdeBar';
import { Pagination } from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import { apiURL } from '../../config/constanst';
import LoadingSkeleton from '../../components/LoadingSkeleton';

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
}

const StoreMangement = () => {
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const { user, accessToken } = useAppSelector((state: IRootState) => state.auth);
  const [stores, setStores] = React.useState<IStoreProps[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(1);

  // Function to get stores data
  const getAllStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiURL}/store?page=${page}&pageSize=10`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setStores(response?.data?.data?.results || []);
        setTotalPage(Math.ceil(response?.data?.data?.total / 10)); // Update total page count
      }
    } catch (error) {
      console.error('GET STORE ERROR', error);
    } finally {
      setLoading(false);
    }
  };

  // Column configuration for the DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'name',
      headerName: 'Tên cửa hàng',
      width: 250,
    },
    {
      field: 'supportDelivery',
      headerName: 'Hỗ trợ giao hàng',
      width: 150,
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value === true ? (
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
        params.value === true ? (
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
    {
      field: 'address',
      headerName: 'Địa chỉ',
      width: 400,
      valueGetter: (params) => {
        const { streetAddress, state, city, country } = params.row.address || {};

        // Kiểm tra nếu bất kỳ trường nào bị thiếu
        if (!streetAddress || !state || !city || !country) {
          return 'Chưa có địa chỉ';
        }

        return `${streetAddress}, ${state}, ${city}, ${country}`;
      },
    },
  ];

  React.useEffect(() => {
    if (!!user) {
      getAllStores();
    }
  }, [user, page]);

  return (
    <MainLayout
      title="Danh sách cửa hàng"
      content={
        isLoading ? (
          <div className="mt-20 h-full w-full px-8">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
            <div className="flex flex-row items-center justify-between">
              <div></div>
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
                rows={stores}
                getRowId={(row) => row.id}
                paginationMode="server"
                page={page}
                rowCount={totalPage}
                pageSize={10}
                columns={columns}
                hideFooterPagination
                disableSelectionOnClick
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectionModel(newSelectionModel);
                }}
                selectionModel={selectionModel}
                checkboxSelection={false}
              />
            </div>
          </div>
        )
      }
    />
  );
};

export default StoreMangement;
