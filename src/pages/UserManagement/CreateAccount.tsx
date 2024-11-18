import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import axios from 'axios'; // Import axios
import Button from '../../designs/Button';
import { apiURL } from '../../config/constanst';
import BaseInput from '../../components/BaseInput';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import CustomDialog from '../../components/CustomDialog';
import SelectComponent from '../../components/Select';
import { CircularProgress } from '@mui/material';

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
  const [stores, setStores] = useState<IStore[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [storeSelected, setStoreSelected] = useState<any | null>(null);
  const [storeLoading, setStoreLoading] = useState<boolean>(false);
  const { accessToken } = useAuth();
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const { user, isAuthorizedForAdmin } = useAuth();

  const listRole =
    user?.role == 'admin'
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
            store: isAuthorizedForAdmin ? storeSelected?.id : currentUser?.store?.id,
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
            store: isAuthorizedForAdmin ? storeSelected?.id : currentUser?.store?.id,
          };
      const response = currentUser
        ? await axios.put(`${apiURL}/tenant/users/${currentUser?.id}`, payload, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : await axios.post(`${apiURL}/tenant/create-${roleSelected?.id}`, payload, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
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

  const getAllStores = async () => {
    try {
      setStoreLoading(true);
      const response = await axios.get(`${apiURL}/store?page=${page}&pageSize=${30}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setStoreLoading(false);
        setStores(response?.data?.data?.results || []);
        setTotalPage(Math.ceil(response?.data?.data?.total / 10));
      }
    } catch (error) {
      setStoreLoading(false);
      console.error('GET STORE ERROR', error);
    } finally {
      setStoreLoading(false);
    }
  };

  useEffect(() => {
    getAllStores();
  }, []);

  useEffect(() => {
    if (currentUser && stores.length > 0) {
      setInitialValues(currentUser);
      setStoreSelected(stores.find((store) => store.id === currentUser?.store?.id));
      setRoleSelected(listRole.find((role) => role.id === currentUser?.role));
    }
  }, [stores]);

  return (
    <>
      {isOpen ? (
        <CustomDialog
          title="Tạo tài khoản người dùng"
          open={isOpen}
          onClose={onClose}
          children={
            <>
              {storeLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <CircularProgress size={40} />
                </div>
              ) : (
                <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                  {({ handleSubmit, values, setFieldValue }) => (
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
                        <Button variant="secondary" onClick={onClose} title="Đóng" />
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
