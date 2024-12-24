import { useState } from 'react';
import { ICategory } from '@/types/models';
import axios from 'axios';
import { apiURL } from '@/config/constanst';
import { setListCategory } from '@/redux/slices/category';
import { useAuth } from './useAuth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAppSelector } from './useRedux';

const useCategoryManagement = () => {
  const [categoryTableData, setCategoryTableData] = useState<ICategory[]>([]);
  const { listCategory } = useAppSelector((state) => state.categories);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { accessToken } = useAuth();

  const dispatch = useDispatch();

  const fetchCategories = async (payload?: { overrideCache: boolean; addLoading: boolean }) => {
    const { overrideCache = false, addLoading = false } = payload || {};

    console.log('fetchcategories', overrideCache);

    try {
      addLoading && setLoading(true);
      if (listCategory.length === 0 || overrideCache) {
        const response = await axios.get(`${apiURL}/category`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response?.data?.success) {
          dispatch(setListCategory(response?.data?.data?.data));
          setCategoryTableData(response?.data?.data?.data);
        }
      }
    } catch (error) {
      console.error('Get product category error', error);
    } finally {
      addLoading && setLoading(false);
    }
  };

  const updateCurrentCategory = async (item: ICategory, onSuccess: () => void) => {
    if (item.id !== null) {
      try {
        const response = await axios.put(`${apiURL}/category/${item.id}`, item, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response?.data?.success) {
          onSuccess();
          toast.success('Cập nhật danh mục thành công');
        } else {
          onSuccess();
          toast.error('Cập nhật danh mục thất bại');
          console.error('Update current category error');
        }
      } catch (error) {
        console.error('Errors is', error);
      }
    }
  };

  const createNewCategory = async (item: Omit<ICategory, 'id'>, onSuccess: () => void) => {
    try {
      const response = await axios.post(`${apiURL}/category/`, item, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        onSuccess();
        await fetchCategories();
        toast.success('Tạo danh mục mới thành công');
      } else {
        onSuccess();
        await fetchCategories();
        toast.error('Tạo danh mục mới thất bại');
      }
    } catch (error) {
      console.error('Errors is', error);
    }
  };

  const removeCategory = async (id: string | number) => {
    try {
      setActionLoading(true);
      const response = await axios.delete(`${apiURL}/category/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        await fetchCategories();
        toast.success('Xóa danh mục thành công');
      } else {
        console.error('Error', response?.data?.data, response?.data?.error);
      }
    } catch (error) {
      console.error('Client Error', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (searchValue: string) => {
    const searchResult = categoryTableData.filter((category) => {
      return category.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    dispatch(setListCategory(searchResult));
  };

  return {
    listCategory,
    loading,
    actionLoading,
    fetchCategories,
    updateCurrentCategory,
    createNewCategory,
    removeCategory,
    handleSearch,
  };
};

export default useCategoryManagement;
