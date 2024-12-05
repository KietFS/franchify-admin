import axios from 'axios';
import { apiURL } from '../config/constanst';
import { useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';
import { setProducts, setStoreProducts } from '../redux/slices/product';
import { useDispatch } from 'react-redux';
import { useAppSelector } from './useRedux';

const useProductManagement = () => {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [storeProductLoading, setStoreProductLoading] = useState(false);
  const { accessToken, user } = useAuth();
  const dispatch = useDispatch();
  const [productResponse, setProductResponse] = useState<IProduct[]>([]);
  const [storeProductResponse, setStoreProductResponse] = useState<IProduct[]>([]);
  const { products, storeProducts } = useAppSelector((state) => state.products);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/products?&page=1&pageSize=1000`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response) {
        console.log('GET PRODUCT RESPONSE', response);
      }

      if (response?.data?.success) {
        dispatch(setProducts(response?.data?.data?.results));
        setProductResponse(response?.data?.data?.results);
      } else {
        dispatch(setProducts([]));
      }
    } catch (error) {
      console.log('GET PRODUCT RESPONSE', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    if (value?.length > 0) {
      const filteredData = productResponse.filter((user: any) => {
        if (user?.name.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
      });
      dispatch(setProducts([...filteredData]));
    } else {
      dispatch(setProducts(productResponse));
    }
  };

  const createProduct = async (values: Omit<IProduct, 'id'>, onSuccess?: () => void) => {
    try {
      setActionLoading(true);
      const response = await axios.post(`${apiURL}/products/`, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setActionLoading(false);
        toast.success('Thêm sản phẩm thành công');
        onSuccess?.();
        await getAllProducts();
      } else {
        toast.error(response?.data?.error || 'Thêm sản phẩm thất bại');
        console.log('Error', response?.data?.data, response?.data?.error);
      }
    } catch (error) {
      setActionLoading(false);
      console.log('Client Error', error);
    }
  };

  const updateProduct = async (
    id: string | number,
    values: Omit<IProduct, 'id'>,
    onSuccess?: () => void,
  ) => {
    try {
      setActionLoading(true);
      const response = await axios.put(`${apiURL}/products/${id}/`, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setActionLoading(false);
        toast.success('Cập nhật sản phẩm thành công');
        onSuccess?.();
        await getAllProducts();
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
      const response = await axios.delete(`${apiURL}/products/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setActionLoading(false);
        await getAllProducts();
        toast.success('Xóa sản phẩm thành công');
      } else {
        toast.error(response?.data?.data || response?.data?.error || 'Xóa sản phẩm thất bại');
      }
    } catch (error) {
      setActionLoading(false);
      console.log('Client Error', error);
    }
  };

  const getAllStoreProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/products/by-store?storeId=${user?.store?.id}&page=${1}&pageSize=1000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response?.data?.success) {
        setStoreProductResponse(response?.data?.data?.results);
        dispatch(setStoreProducts(response?.data?.data?.results));
      } else {
        setStoreProductResponse([]);
        dispatch(setStoreProducts([]));
      }
    } catch (error) {
      console.log('GET PRODUCT RESPONSE', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllProducts,
    createProduct,
    updateProduct,
    handleSearch,
    deleteProduct,
    getAllStoreProducts,

    // state
    products,
    loading,
    storeProductLoading,
    storeProducts,
    actionLoading,
  };
};

export default useProductManagement;
