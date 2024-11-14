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

interface IUserFormValue {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  password: string;
}

interface ICreateStaffFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  isOpen: boolean;
}

const CreateAccountForm: React.FC<ICreateStaffFormProps> = ({ onClose, isOpen, onSuccess }) => {
  const [initialValues, setInitialValues] = useState<IUserFormValue>({
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [stores, setStores] = useState<IStore[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [storeSelected, setStoreSelected] = useState<any | null>(null);
  const { accessToken } = useAuth();

  const handleSubmit = async (values: IUserFormValue) => {
    try {
      // Call the API
      const response = await axios.post(
        `${apiURL}/tenant/create-staff`,
        {
          username: values.username,
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber, // Ensure this is in the correct format (e.g., 8 for 8 AM)
          email: values.email, // Ensure this is in the correct format (e.g., 21 for 9 PM)
          password: values?.password,
          store: storeSelected?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response?.data?.success) {
        onClose();
        toast.success('Tạo người dùng thành công');
        onSuccess && onSuccess?.();
      }
    } catch (error) {
      toast.error('Tạo người dùng thất bại');
    }
  };

  const getAllStores = async () => {
    try {
      const response = await axios.get(`${apiURL}/store?page=${page}&pageSize=${30}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setStores(response?.data?.data?.results || []);
        setTotalPage(Math.ceil(response?.data?.data?.total / 10));
      }
    } catch (error) {
      console.error('GET STORE ERROR', error);
    } finally {
    }
  };

  useEffect(() => {
    getAllStores();
  }, []);

  return (
    <>
      {isOpen ? (
        <CustomDialog
          title="Tạo tài khoản người dùng"
          open={isOpen}
          onClose={onClose}
          children={
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

                    <BaseInput
                      type="password"
                      name="password"
                      mode="password"
                      value={values.password}
                      label="Mật khẩu"
                      placeholder="Nhập mật khẩu người dùng"
                      onChange={(e) => setFieldValue('password', e.target.value)}
                    />

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
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row-reverse items-center gap-x-4">
                    <Button
                      type="button" // Changed to button
                      title="Xác nhận"
                      variant="primary"
                      isLoading={loading}
                      onClick={handleSubmit} // Directly calling submitForm
                    />
                    <Button variant="secondary" onClick={onClose} title="Đóng" />
                  </div>
                </div>
              )}
            </Formik>
          }
        />
      ) : null}
    </>
  );
};

export default CreateAccountForm;
