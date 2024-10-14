import React, { useEffect } from "react";
import { useAppSelector } from "../../hooks/useRedux";
import { apiURL } from "../../config/constanst";
import axios from "axios";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Pagination } from "@mui/material";
import { toast } from "react-toastify";

interface IImportProductFormProps {
  open: boolean;
  onClose: () => void;
  currentStoreProduct: IStoreProduct[];
  storeId: number;
  onImportSuccess: () => void;
}

const ImportProductForm: React.FC<IImportProductFormProps> = (props) => {
  const { open, onClose, storeId, onImportSuccess } = props;
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [listCategory, setListCategory] = React.useState<IProductCategory[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const { accessToken } = useAppSelector((state) => state.auth);
  const [selectedItem, setSelectedItem] = React.useState<IProduct[]>([]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "upc",
      headerName: "Mã sản phẩm",
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <div className="text-gray-800 font-semibold text-sm">
            {params.value}
          </div>
        );
      },
    },
    { field: "name", headerName: "Tên sản phẩm", width: 250 },
    {
      field: "category",
      headerName: "Danh mục",
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <div className="text-yellow-600 font-semibold text-sm">
            {params.value?.name}
          </div>
        );
      },
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
  ];

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/products?&page=${page}&pageSize=10`,
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
        const filteredProducts = response?.data?.data?.results.filter(
          (product: IProduct) => {
            console.log("product", product);
            return !props.currentStoreProduct.find(
              (storeProduct) => storeProduct?.product?.upc == product.upc
            );
          }
        );

        setProducts([...filteredProducts]);
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

  const importProduct = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/products/link-to-store`,
        {
          productIds: selectedItem.map((item) => item.id),
          storeId: storeId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.success) {
        onClose();
        onImportSuccess();
      } else {
        toast.error(
          response?.data?.data ||
            response?.data?.error ||
            "Có lỗi xảy ra khi thêm sản phẩm vào cửa hàng"
        );
        onClose();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào cửa hàng");
      console.log("IMPORT PRODUCT ERROR", error);
      onClose();
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [page]);

  return (
    <>
      {open ? (
        <div className="h-[900px] py-4">
          <div className="flex flex-row-reverse gap-y-2 gap-x-2 w-full mb-6">
            <button
              onClick={() => importProduct()}
              className="bg-gray-500 text-white  w-fit h-[40px] px-3 py-1 font-bold rounded-lg flex items-center hover:opacity-80"
            >
              <p>Thêm vào cửa hàng</p>
            </button>
          </div>
          <DataGrid
            rows={products}
            paginationMode="server"
            page={page}
            sx={{ height: "700px" }}
            rowCount={totalPage}
            pageSize={10}
            columns={columns}
            onSelectionModelChange={(newSelection) => {
              let mappedProducts = newSelection.map((item) => {
                return products.find((product) => product.id === item);
              });

              setSelectedItem([...mappedProducts] as any[]);
            }}
            hideFooterPagination
            checkboxSelection
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
      ) : null}
    </>
  );
};

export default ImportProductForm;
