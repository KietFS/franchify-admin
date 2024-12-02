import {useState} from "react";
import axios from "axios";
import {useAuth} from "./useAuth";
import {apiURL} from "../config/constanst";
import {toast} from "react-toastify";
import {useAppSelector} from "./useRedux";
import {setUsers} from "../redux/slices/user";
import {useDispatch} from "react-redux";

const useUserManagement = () => {
    const {user, accessToken, isAuthorizedForAdmin, isAuthorizedForManager} = useAuth();
    const {users} = useAppSelector((state) => state.users);
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const getAllUser = async (params?: { addLoadingEffect?: boolean, overrideCache?: boolean }) => {
        const {addLoadingEffect, overrideCache} = params || {};
        if (users?.length == 0 || overrideCache == true) {
            try {
                addLoadingEffect && setLoading(true);
                const requestURl = isAuthorizedForAdmin
                    ? `${apiURL}/tenant/users`
                    : `${apiURL}/tenant/staffs/${user?.store?.id}`;
                const response = await axios.get(`${requestURl}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    } as any,
                });
                if (response?.data?.success == true) {
                    dispatch(setUsers(response?.data?.data));
                    setTotalPage(response?.data?._totalPage);
                }
            } catch (error) {
                console.log('GET USER ERROR', error);
            } finally {
                addLoadingEffect && setLoading(false);
            }
        } else {
            return Promise.resolve()
        }
    };

    const handleDeactivateUser = async (id: string | number) => {
        try {
            const payload = {
                isActive: false,
                store: 8,
            };
            const response = await axios.put(`${apiURL}/tenant/users/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response?.data?.success == true) {
                toast.success('Vô hiệu hóa tài khoản thành công');
                await getAllUser({addLoadingEffect: true});
            } else {
            }
        } catch (error) {
            console.log('error');
        }
    };

    const handleActivateUser = async (id: string | number) => {
        try {
            const payload = {
                isActive: true,
                store: 8,
            };
            const response = await axios.put(`${apiURL}/tenant/users/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response?.data?.success == true) {
                toast.success('Kích hoạt tài khoản thành công');
                getAllUser({addLoadingEffect: false});
            } else {
            }
        } catch (error) {
            console.log('error');
        }
    };

    const updateUser = async (currentUser: any, payload: any) => {
        return await axios.put(`${apiURL}/tenant/users/${currentUser?.id}`, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
    }

    const createUser = async (roleSelected: { id: string, name: string }, payload: any) => {
        return await axios.post(`${apiURL}/tenant/create-${roleSelected?.id}`, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }


    return {
        getAllUser,
        handleDeactivateUser,
        handleActivateUser,
        updateUser,
        createUser,
        setUsers,

        totalPage,
        loading,
        users,

    }
}

export default useUserManagement;