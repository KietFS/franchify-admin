import React, {useEffect, useMemo, useState} from 'react';
import {Formik} from 'formik';
import Button from '../../designs/Button';
import BaseInput from '../../components/BaseInput';
import {toast} from 'react-toastify';
import {useAuth} from '../../hooks/useAuth';
import CustomDialog from '../../components/CustomDialog';
import SelectComponent from '../../components/Select';
import {CircularProgress} from '@mui/material';
import useStoreManagement from '../../hooks/useStoreManagement';
import useUserManagement from '../../hooks/useUserManagement';

interface IUserFormValue {
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    password?: string;
}

interface ICreateStaffFormProps {
    onClose: () => void;
    onSuccess?: () => void;
    isOpen: boolean;
    currentUser?: any;
}

const CreateAccountForm: React.FC<ICreateStaffFormProps> = ({
                                                                onClose,
                                                                isOpen,
                                                                onSuccess,
                                                                currentUser,
                                                            }) => {
    const [initialValues, setInitialValues] = useState<IUserFormValue>({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
    });

    const [storeSelected, setStoreSelected] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const {user, isAuthorizedForAdmin} = useAuth();
    const {getAllStores, listStore: stores, loading: storeLoading} = useStoreManagement();
    const {updateUser, createUser} = useUserManagement();

    const listRole = useMemo(() => {
        return user?.role === 'admin'
            ? [
                {
                    id: 'staff',
                    name: 'Nhân viên',
                },
                {
                    id: 'manager',
                    name: 'Cửa hàng trưởng',
                },
            ]
            : [
                {
                    id: 'staff',
                    name: 'Nhân viên',
                },
            ];
    }, [user?.role]);

    const [roleSelected, setRoleSelected] = useState<any>(listRole[0]);

    const handleSubmit = async (values: IUserFormValue) => {
        try {
            setActionLoading(true);
            const payload = currentUser
                ? {
                    username: values.username,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phoneNumber: values.phoneNumber,
                    email: values.email,
                    store: isAuthorizedForAdmin ? storeSelected?.id : user?.store?.id,
                    role: roleSelected?.id,
                }
                : {
                    username: values.username,
                    role: roleSelected?.id,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phoneNumber: values.phoneNumber,
                    email: values.email,
                    password: values?.password,
                    store: isAuthorizedForAdmin ? storeSelected?.id : user?.store?.id,
                };
            const response: any = currentUser
                ? await updateUser(currentUser, payload)
                : await createUser(roleSelected, payload);
            if (response?.data?.success) {
                onSuccess && onSuccess?.();
                onClose();
                setActionLoading(false);
                currentUser
                    ? toast.success('Cập nhật người dùng thành công')
                    : toast.success('Tạo người dùng thành công');
            }
        } catch (error) {
            console.log('ERROR', error);
            currentUser
                ? toast.error((error as any)?.response?.data?.message || 'Cập nhật người dùng thất bại')
                : toast.error((error as any)?.response?.data?.message || 'Tạo người dùng thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        getAllStores();
    });

    useEffect(() => {
        if (currentUser && stores.length > 0) {
            setInitialValues(currentUser);
            setStoreSelected(stores.find((store) => store.id === currentUser?.store?.id));
            setRoleSelected(listRole.find((role) => role.id === currentUser?.role));
        }
    }, [stores, currentUser, listRole]);

    return (
        <>
            {isOpen ? (
                <CustomDialog
                    title={!!currentUser ? 'Cập nhật người dùng' : 'Tạo người dùng'}
                    open={isOpen}
                    onClose={onClose}
                    children={
                        <>
                            {storeLoading ? (
                                <div className="flex h-full w-full items-center justify-center">
                                    <CircularProgress size={40}/>
                                </div>
                            ) : (
                                <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                                    {({handleSubmit, values, setFieldValue}) => (
                                        <div className="flex flex-col gap-y-10">
                                            <div className="flex flex-col gap-y-5">
                                                {/* Name and StoreCode */}
                                                <BaseInput
                                                    type="text"
                                                    name="username"
                                                    value={values.username}
                                                    label="Username"
                                                    placeholder="Nhập username người dùng"
                                                    onChange={(e) => setFieldValue('username', e.target.value)}
                                                />
                                                <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
                                                    <BaseInput
                                                        type="text" // Changed to text for compatibility
                                                        name="firstName"
                                                        value={values.firstName}
                                                        label="Họ người dùng"
                                                        placeholder="Nhập họ người dùng"
                                                        onChange={(e) => setFieldValue('firstName', e.target.value)}
                                                    />
                                                    <BaseInput
                                                        type="text" // Changed to text for compatibility
                                                        name="lastName"
                                                        value={values.lastName}
                                                        label="Tên người dùng"
                                                        placeholder="Tên họ người dùng"
                                                        onChange={(e) => setFieldValue('lastName', e.target.value)}
                                                    />
                                                </div>

                                                <BaseInput
                                                    type="phoneNumber"
                                                    name="phoneNumber"
                                                    value={values.phoneNumber}
                                                    label="Số điện thoại"
                                                    placeholder="Nhập số điện thoại người dùng"
                                                    onChange={(e) => setFieldValue('phoneNumber', e.target.value)}
                                                />

                                                <BaseInput
                                                    type="email"
                                                    name="email"
                                                    value={values.email}
                                                    label="Email"
                                                    placeholder="Nhập email người dùng"
                                                    onChange={(e) => setFieldValue('email', e.target.value)}
                                                />

                                                {currentUser ? null : (
                                                    <BaseInput
                                                        type="password"
                                                        name="password"
                                                        mode="password"
                                                        value={values.password}
                                                        label="Mật khẩu"
                                                        placeholder="Nhập mật khẩu người dùng"
                                                        onChange={(e) => setFieldValue('password', e.target.value)}
                                                    />
                                                )}

                                                <SelectComponent
                                                    options={listRole}
                                                    name="role"
                                                    placeholder="Chọn vai trò cho user"
                                                    label="Chọn vai trò"
                                                    optionSelected={roleSelected}
                                                    keyLabel="name"
                                                    keyValue="id"
                                                    onSelect={(role) => setRoleSelected(role)}
                                                />

                                                {isAuthorizedForAdmin && (
                                                    <SelectComponent
                                                        options={stores}
                                                        name="store"
                                                        placeholder="Chọn cửa hàng cho user"
                                                        label="Chọn cửa hàng"
                                                        optionSelected={storeSelected}
                                                        keyLabel="name"
                                                        keyValue="id"
                                                        onSelect={(store) => setStoreSelected(store)}
                                                    />
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-row-reverse items-center gap-x-4">
                                                <Button
                                                    type="button" // Changed to button
                                                    title="Xác nhận"
                                                    variant="primary"
                                                    isLoading={actionLoading}
                                                    onClick={handleSubmit} // Directly calling submitForm
                                                />
                                                <Button variant="secondary" onClick={onClose} title="Đóng"/>
                                            </div>
                                        </div>
                                    )}
                                </Formik>
                            )}
                        </>
                    }
                />
            ) : null}
        </>
    );
};

export default CreateAccountForm;