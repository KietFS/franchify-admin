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
import SelectComponent from "../../components/Select";
import ImportProductForm from "./ImportProducForm";
import StoreProductForm from "./StoreProductForm";

interface IStoreManagementProps {
  onChangeViewMode: (mode: "tenant" | "store") => void;
}

const StoreProductManagement: React.FC<IStoreManagementProps> = (props) => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  const { user, accessToken } = useAppSelector(
    (state: IRootState) => state.auth
  );
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>("");
  const [selectedItem, setSelectedItem] = React.useState<IProduct | null>(null);
  const [openImportProductModal, setOpenImportProductModal] =
    React.useState<boolean>(false);
  const [currentStore, setCurrentStore] = React.useState<IStore | null>(null);
  const [listStore, setListStore] = React.useState<IStore[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);
  const [storeLoading, setStoreLoading] = React.useState<boolean>(false);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/products/by-store?storeId=${currentStore?.id}&page=${page}&pageSize=10`,
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
        setTotalPage(response?.data?.data?.totalPage);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("GET PRODUCT RESPONSE", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllStores = async () => {
    try {
      setStoreLoading(true);
      const response = await axios.get(`${apiURL}/store`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setStoreLoading(false);
        if (user.role == "admin") {
          setListStore([
            ...response?.data?.data?.results,
            {
              id: "all",
              name: "Tất cả cửa hàng",
            },
          ]);
        } else {
          setListStore(response?.data?.data?.results);
          setStoreLoading(false);
        }
        setCurrentStore(response?.data?.data?.results?.[0]);
      } else {
        setStoreLoading(false);
      }
    } catch (error) {
      setStoreLoading(false);
      console.log("GET STORE ERROR", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "product.upc",
      headerName: "Mã sản phẩm",
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div className="">{params.row.product?.upc}</div>;
      },
    },
    {
      field: "product.name",
      headerName: "Tên sản phẩm",
      width: 250,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div className="">{params.row.product?.name}</div>;
      },
    },
    {
      field: "inventory",
      headerName: "Còn trong kho",
      width: 150,
    },
    {
      field: "price",
      headerName: "Giá bán",
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <div className="text-green-800 font-semibold text-sm">
            {params.value?.displayPrice}
          </div>
        );
      },
    },
    {
      field: "product.reatedAt",
      headerName: "Ngày tạo",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <div className="">
            {(params.row.product?.createdAt as string).prettyDate()}
          </div>
        );
      },
    },
    {
      field: "product.updatedAt",
      headerName: "Ngày cập nhật",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <div className="">
            {(params.row.product?.updatedAt as string).prettyDate()}
          </div>
        );
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
            id: "update",
            title: "Cập nhật sản phẩm",
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
  ];

  const updateProduct = async (
    id: string | number,
    values: Omit<IProduct, "id">
  ) => {
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
        toast.success("Cập nhật sản phẩm thành công");
        setOpenImportProductModal(false);
      } else {
        toast.error(
          response?.data?.data ||
            response?.data?.error ||
            "Cập nhật sản phẩm thất bại"
        );
      }
    } catch (error) {
      setActionLoading(false);
      console.log("Client Error", error);
    }
  };

  React.useEffect(() => {
    if (!!currentStore) {
      getAllProducts();
    }
  }, [page, currentStore]);

  React.useEffect(() => {
    getAllStores();
  }, []);

  return (
    <>
      <MainLayout
        title="Danh sách sản phẩm "
        content={
          <>
            <div className="flex justify-between gap-y-2 w-full mb-6 items-center">
              <div className="flex items-center">
                <SelectComponent
                  optionSelected={currentStore}
                  options={listStore}
                  name="currentStore"
                  label="Chọn cửa hàng"
                  onSelect={(store) => {
                    if (store.id === "all") {
                      props.onChangeViewMode("tenant");
                    } else {
                      setCurrentStore(store);
                    }
                  }}
                  placeholder="Chọn cửa hàng"
                />
              </div>
              <button
                onClick={() => {
                  setOpenImportProductModal(true);
                  setSelectedItem(null);
                }}
                className="bg-gray-500 text-white  w-fit h-[40px] px-3 py-1 font-bold rounded-lg flex items-center hover:opacity-80"
              >
                <PlusIcon className="w-[20px] h-[20px] text-white font-bold" />
                <p>Nhập sản phẩm</p>
              </button>
            </div>

            <div className="w-full flex flex-col gap-y-5 bg-white shadow-xl rounded-2xl">
              <div className="h-[700px] w-full ">
                <DataGrid
                  loading={isLoading || storeLoading}
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
          </>
        }
      />

      {openImportProductModal ? (
        <CustomDialog
          title={"Nhập sản phẩm"}
          maxWidth="lg"
          open={openImportProductModal}
          onClose={() => setOpenImportProductModal(false)}
          children={
            <ImportProductForm
              onImportSuccess={() => getAllProducts()}
              storeId={currentStore?.id as number}
              currentStoreProduct={products}
              open={openImportProductModal}
              onClose={() => setOpenImportProductModal(false)}
            />
          }
        />
      ) : null}

      {openUpdateModal && (
        <CustomDialog
          title="Chỉnh sửa sản phẩm"
          maxWidth="md"
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          children={
            <StoreProductForm
              onClose={() => setOpenImportProductModal(false)}
              loading={actionLoading}
              currentProduct={selectedItem}
              onConfirm={(productValue) => {
                if (!!selectedItem) {
                  updateProduct(selectedItem?.id, productValue);
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
