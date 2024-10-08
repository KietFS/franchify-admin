import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import MainLayout from "../../components/SIdeBar";
import { Pagination } from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import { apiURL } from "../../config/constanst";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import PaymentStatusBadge from "../../components/PaymentStatusBadge";

interface IItemProps {
  id: string;
  name: string;
  startPrice: number;
  imagePath: string;
  username: string;
}

const StoreMangement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const { user, accessToken } = useAppSelector(
    (state: IRootState) => state.auth
  );
  const [products, setProducts] = React.useState<IItemProps[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);

  const getAllStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/bids/revenue?&page=${page - 1}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.success) {
        let formattedResponse = response?.data?.data.map((item: any) => {
          return {
            ...item,
            winner: item?.product?.holder,
            bidClosingDate: item?.product?.bidClosingDate,
            revenue: item?.priceWin / 10,
          };
        });
        setProducts(formattedResponse);
        setTotalPage(response?.data?._totalPage);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("GET PRODUCT RESPONSE", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/bids/revenue?&page=${page - 1}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.success) {
        let formattedResponse = response?.data?.data.map((item: any) => {
          return {
            ...item,
            winner: item?.product?.holder,
            bidClosingDate: item?.product?.bidClosingDate,
            revenue: item?.priceWin / 10,
          };
        });
        setProducts(formattedResponse);
        setTotalPage(response?.data?._totalPage);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("GET PRODUCT RESPONSE", error);
    } finally {
    }
  };

  const columns: GridColDef[] = [
    { field: "Id", headerName: "ID", width: 100 },
    {
      field: "product",
      headerName: "Tên cửa hàng phẩm",
      width: 350,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <div className="flex items-center">
            <div className="w-[120px]">
              <img
                src={params.value?.imagePath?.split("?")[0]}
                width={80}
                height={60}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">{params?.value?.name}</p>
          </div>
        );
      },
    },
  ];

  React.useEffect(() => {
    if (!!user) {
      getAllStores();
    }
  }, [user]);

  return (
    <MainLayout
      title="Danh sách sản phẩm "
      content={
        isLoading ? (
          <div className="w-full h-full px-8 mt-20">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-y-5 bg-white shadow-xl rounded-2xl">
            <div className="flex flex-row justify-between items-center">
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
            <div className="h-[800px] w-full ">
              <DataGrid
                rows={products}
                getRowId={(row) => row.bidId}
                paginationMode="server"
                page={page}
                rowCount={totalPage}
                pageSize={10}
                columns={columns}
                hideFooterPagination
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
        )
      }
    />
  );
};

export default StoreMangement;
