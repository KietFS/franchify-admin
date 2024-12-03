import axios from 'axios';
import { apiURL } from '../config/constanst';
import { useState } from 'react';
import * as React from 'react';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

const useProductManagement = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productTableData, setProductTableData] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { accessToken } = useAuth();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/products?&page=1&pageSize=200`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response) {
        console.log('GET PRODUCT RESPONSE', response);
      }

      if (response?.data?.success) {
        setProducts(response?.data?.data?.results);
        setProductTableData(response?.data?.data?.results);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log('GET PRODUCT RESPONSE', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    if (value?.length > 0) {
      const filteredData = products.filter((user: any) => {
        if (user?.name.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
      });
      setProductTableData([...filteredData]);
    } else {
      setProductTableData(products);
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
        getAllProducts();
        toast.success('Thêm sản phẩm thành công');
        onSuccess?.();
      } else {
        console.log('Error', response?.data?.data, response?.data?.error);
      }
    } catch (error) {
      setActionLoading(false);
      console.log('Client Error', error);
    }
  };

  return {
    handleSearch,
    getAllProducts,
    createProduct,

    //state
    productTableData,
    loading,
  };
};

export default useProductManagement;
