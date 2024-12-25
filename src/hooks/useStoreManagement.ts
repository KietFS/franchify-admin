import {useState} from 'react';
import axios from 'axios';
import {apiURL} from '@/config/constanst';
import {useAuth} from './useAuth';
import {IStore} from '@/types/models';
import {useAppSelector} from './useRedux';
import {useDispatch} from 'react-redux';
import {setCurrentStore, setListStore} from '@/redux/slices/store';

const useStoreManagement = () => {
  const { listStore, currentStore } = useAppSelector((state) => state.store);
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken, user } = useAuth();

  const dispatch = useDispatch();

  const dispatchSetCurrentStore = (store: IStore) => {
    dispatch(setCurrentStore(store));
  }

  const getAllStores = async (payload?: { overrideCache: boolean; showLoading: boolean }) => {
    const { overrideCache = false, showLoading = false } = payload || {};
    try {
      if (listStore.length === 0 || overrideCache) {
        showLoading && setLoading(true);
        const response = await axios.get(`${apiURL}/store?pageSize=30`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response?.data?.success) {
          showLoading && setLoading(false);
          if (user.role == 'admin') {
            dispatch(
              setListStore([
                ...response?.data?.data?.results,
                {
                  id: 'all',
                  name: 'Tất cả cửa hàng',
                },
              ]),
            );
          } else {
            dispatch(setListStore(response?.data?.data?.results));
            setLoading(false);
          }
          dispatch(setCurrentStore(
              response?.data?.data?.results?.find((store: IStore) => store.id == user.store.id),
          ))
        } else {
          showLoading && setLoading(false);
        }
      }
    } catch (error) {
      overrideCache && setLoading(false);
      console.log('GET STORE ERROR', error);
    }
  };

  const createStore = async (values: any, onSuccess?: () => void) => {
    try {
      const response = await axios.post(`${apiURL}/store`, {
        name: values.name,
        supportPickup: values.supportPickup,
        supportDelivery: values.supportDelivery,
        openTime: values.openTime,
        closeTime: values.closeTime,
        storeCode: Number(values.storeCode),
        lat: values.lat,
        lng: values.lng,
      });

      if (response?.data?.success) {
        onSuccess && onSuccess();
        return response;
      } else {
        console.log('error when creating store');
      }
    } catch (error) {
      console.log('CREATE STORE ERROR', error);
    }
  };

  const updateStore = async (currentStore: any, values: any, onSuccess?: () => void) => {
    try {
      const response = await axios.patch(`${apiURL}/store/${currentStore?.id}`, {
        name: values.name,
        supportPickup: values.supportPickup,
        supportDelivery: values.supportDelivery,
        openTime: values.openTime,
        closeTime: values.closeTime,
        storeCode: Number(values.storeCode),
      });
      if (response?.data?.success) {
        onSuccess && onSuccess();
        return response;
      } else {
        throw new Error(response?.data?.error || 'Error when updating store');
      }
    } catch (error) {
      console.log('UPDATE STORE ERROR', error);
    }
  };

  return {
    currentStore,
    getAllStores,
    createStore,
    updateStore,
    loading,
    listStore,
    dispatchSetCurrentStore,
  };
};

export default useStoreManagement;
