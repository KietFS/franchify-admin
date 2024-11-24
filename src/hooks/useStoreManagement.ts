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

    return {
        getAllStores,
        loading,
        listStore,
    }

}

export default useStoreManagement;
