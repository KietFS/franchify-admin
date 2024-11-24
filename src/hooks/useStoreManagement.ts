import {useState} from 'react'
import axios from "axios";
import {apiURL} from "../config/constanst";
import {useAuth} from "./useAuth";


const useStoreManagement = () => {
    const [listStore, setListStore] = useState<IStore[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentStore, setCurrentStore] = useState<IStore>();
    const {accessToken, user} = useAuth();


    const getAllStores = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiURL}/store?pageSize=30`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setLoading(false);
                if (user.role == 'admin') {
                    setListStore([
                        ...response?.data?.data?.results,
                        {
                            id: 'all',
                            name: 'Tất cả cửa hàng',
                        },
                    ]);
                } else {
                    setListStore(response?.data?.data?.results);
                    setLoading(false);
                }
                setCurrentStore(
                    response?.data?.data?.results?.find((store: IStore) => store.id == user.store.id),
                );
            } else {
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
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
                throw new Error(response?.data?.error || 'Error when creating store')
            }
        } catch (error) {
            console.log('CREATE STORE ERROR', error);
        }
    }

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
                throw new Error(response?.data?.error || 'Error when updating store')
            }
        } catch (error) {
            console.log('UPDATE STORE ERROR', error);
        }
    }

    return {
        getAllStores,
        createStore,
        updateStore,
        loading,
        listStore,
    }

}

export default useStoreManagement;
