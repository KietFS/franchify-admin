import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import MainLayout from "../../components/SIdeBar";
import { Button, Pagination, Skeleton, TablePagination } from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import Spinner from "../../components/Spinner";
import { apiURL } from "../../config/constanst";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ActionMenu from "../../components/ActionMenu";
import { toast } from "react-toastify";

interface IProductHomePageResponse {
  id: string;
  name: string;
  startPrice: number;
  imagePath: string;
  username: string;
}

const ProductManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const { user, accessToken } = useAppSelector(
    (state: IRootState) => state.auth
  );
  const [products, setProducts] = React.useState<IProductHomePageResponse[]>(
    []
  );
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>("");

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/products?&page=${page - 1}&size=10&sort=bidCreatedDate,desc`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.success) {
        setProducts(response?.data?.data);
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
        `${apiURL}/products?&page=${page - 1}&size=10&sort=bidCreatedDate,desc`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.success) {
        setProducts(response?.data?.data);
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
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Tên sản phẩm", width: 460 },
    {
      field: "currentPrice",
      headerAlign: "left",
      align: "left",
      headerName: "Giá hiện tại   ",
      type: "number",
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <div className="w-[120px]">
            <p>{params.value?.toString()?.prettyMoney()}</p>
          </div>
        );
      },
    },

    {
      field: "imagePath",
      headerName: "Hình ảnh",
      type: "string",
      width: 200,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <div className="w-[120px]">
            <img src={params.value?.split("?")[0]} width={80} height={60} />
          </div>
        );
      },
    },
    {
      field: "holder",
      headerName: "Người đang giữ giá",
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <div className="w-[120px]">
            {!!params?.value ? (
              <p className="text-gray-500 text-sm font-semibold underline">
                {params?.value}
              </p>
            ) : (
              <p>{params?.value || "Chưa có"}</p>
            )}
          </div>
        );
      },
      width: 200,
    },
    {
      field: "actions",
      headerName: "Hành động",
      type: "string",
      width: 300,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const removeProduct = async (
          id: string | number,
          status: "PENDING" | "APPROVED"
        ) => {
          try {
            setActionLoading(true);
            setSelectedRow(id);
            //THIS NEED TO FIX
            const response = await axios.delete(`${apiURL}/products/${id}/`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response?.data?.success) {
              setActionLoading(false);

              refreshProducts();
              toast.success("Xóa sản phẩm thành công");
            } else {
              console.log("Error", response?.data?.data, response?.data?.error);
            }
          } catch (error) {
            setActionLoading(false);
            console.log("Client Error", error);
          }
        };
        const options = [
          {
            id: "delete",
            title: "Xóa sản phẩm",
            onPress: () => removeProduct(params.row?.id, "APPROVED"),
            onActionSuccess: () => refreshProducts(),
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

  React.useEffect(() => {
    getAllProducts();
  }, [page]);

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
        )
      }
    />
  );
};

export default ProductManagement;
