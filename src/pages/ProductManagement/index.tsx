import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import MainLayout from "../../components/SIdeBar";
import {
  Button,
  Dialog,
  Pagination,
  Skeleton,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import Spinner from "../../components/Spinner";
import { apiURL } from "../../config/constanst";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ActionMenu from "../../components/ActionMenu";
import { toast } from "react-toastify";
import CustomDialog from "../../components/CustomDialog";
import ProductForm from "./ProductForm";
import { PlusIcon } from "@heroicons/react/24/outline";

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
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>("");
  const [selectedItem, setSelectedItem] = React.useState<IProduct | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/products?&page=${page - 1}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response) {
        console.log("GET PRODUCT RESPONSE", response);
      }

      if (response?.data?.success) {
        setProducts(response?.data?.data?.results);
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
        `${apiURL}/products?&page=${page - 1}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.success) {
        setProducts(response?.data?.data?.results);
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
    { field: "upc", headerName: "Mã sản phẩm", width: 200 },
    { field: "name", headerName: "Tên sản phẩm", width: 250 },
    {
      field: "price",
      headerName: "Giá bán",
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div>{params.value?.displayPrice}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div>{(params.value as string).prettyDate()}</div>;
      },
    },
    {
      field: "updatedAt",
      headerName: "Ngày cập nhật",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div>{(params.value as string).prettyDate()}</div>;
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      type: "string",
      width: 300,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const options = [
          {
            id: "delete",
            title: "Xóa sản phẩm",
            onPress: () => removeProduct(params.row?.id),
            onActionSuccess: () => refreshProducts(),
          },
          {
            id: "update",
            title: "Cập nhật sản phẩm",
            onPress: () => {
              setSelectedItem(params.row as IProduct);
              setOpenUpdateModal(true);
            },
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

  const removeProduct = async (id: string | number) => {
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

  const updateProduct = async (
    id: string | number,
    values: Omit<IProduct, "id">
  ) => {
    try {
      setActionLoading(true);
      setSelectedRow(id);
      const response = await axios.put(`${apiURL}/products/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setActionLoading(false);
        refreshProducts();
        toast.success("Cập nhật sản phẩm thành công");
        setOpenUpdateModal(false);
      } else {
        console.log("Error", response?.data?.data, response?.data?.error);
      }
    } catch (error) {
      setActionLoading(false);
      console.log("Client Error", error);
    }
  };

  const createProduct = async (values: Omit<IProduct, "id">) => {
    try {
      setActionLoading(true);
      const response = await axios.post(`${apiURL}/products/`, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setActionLoading(false);
        refreshProducts();
        toast.success("Thêm sản phẩm thành công");
        setOpenUpdateModal(false);
      } else {
        console.log("Error", response?.data?.data, response?.data?.error);
      }
    } catch (error) {
      setActionLoading(false);
      console.log("Client Error", error);
    }
  };

  React.useEffect(() => {
    getAllProducts();
  }, [page]);

  return (
    <>
      <MainLayout
        title="Danh sách sản phẩm "
        content={
          isLoading ? (
            <div className="w-full h-full px-8 mt-20">
              <LoadingSkeleton />
            </div>
          ) : (
            <div className="w-full flex flex-col gap-y-5 bg-white shadow-xl rounded-2xl">
              <div className="flex flex-row-reverse gap-y-2 w-full">
                <button
                  onClick={() => {
                    setOpenUpdateModal(true);
                    setSelectedItem(null);
                  }}
                  className="bg-gray-500 text-white  w-fit h-[40px] px-3 py-1 font-bold rounded-lg flex items-center hover:opacity-80"
                >
                  <PlusIcon className="w-[20px] h-[20px] text-white font-bold" />
                  <p>Thêm sản phẩm</p>
                </button>
              </div>
              <div className="h-[700px] w-full ">
                <DataGrid
                  rows={products}
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
                <div className="flex gap-x-2 mt-4 flex-row-reverse">
                  <Pagination
                    onChange={(event, changedPage) => setPage(changedPage)}
                    count={totalPage}
                    defaultPage={1}
                    page={page}
                  />
                </div>
              </div>
            </div>
          )
        }
      />

      {openUpdateModal ? (
        <CustomDialog
          title={!!selectedItem ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
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

export default ProductManagement;
