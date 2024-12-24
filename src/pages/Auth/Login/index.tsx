import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import LoginBackground from '@/assets/images/LoginBackground.png';

//components
import { useAuth } from '@/hooks/useAuth';
import BaseInput from '@/components/BaseInput';
import { CircularProgress } from '@mui/material';

interface ILoginPageProps {}

interface IFormValue {
  phoneNumber: string;
  password: string;
}

const validationSchema = yup.object().shape<{ [k in keyof IFormValue]: any }>({
  phoneNumber: yup.string().required('Vui lòng nhập email của bạn'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải lớn hơn 6 kí tự')
    .required('Vui lòng nhập mật khẩu của bạn'),
});
const LoginPage: React.FC<ILoginPageProps> = () => {
  const { login, loginLoading } = useAuth();
  const [initialValues, setInitialValues] = useState<IFormValue>({
    phoneNumber: '',
    password: '',
  });

  const handleSubmit = (values: IFormValue) => {
    login(values.phoneNumber, values.password);
  };

  return (
    <>
      <head>
        <title>Market Floor Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <div className="flex h-screen items-center bg-gray-100 px-10 laptop:px-36">
        <div className="flex h-[450px] w-screen flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-2 shadow-2xl drop-shadow-sm phone:px-8 tablet:h-[500px] laptop:flex laptop:h-[600px] laptop:flex-row">
          <div className="hidden h-screen items-center laptop:flex">
            <img src={LoginBackground} width={600} height={600} className="my-auto" />
          </div>
          <div className="flex justify-center">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, submitForm, errors }) => {
                return (
                  <div className="space-y-7">
                    <div className="space-x-1">
                      <h1 className="text-center text-4xl font-bold text-gray-600">Market Floor</h1>
                      <p className="mt-2 text-center text-sm text-gray-600">
                        Trang dành cho quản trị viên và nhân viên cửa hàng
                      </p>
                    </div>
                    <div className="space-y-5">
                      <BaseInput
                        mode="phoneNumber"
                        name="phoneNumber"
                        label="Phone number"
                        required
                        type="phoneNumber"
                        className="w-[250px] phone:w-[300px] tablet:w-[400px]"
                      />
                      <BaseInput
                        name="password"
                        label="Mật khẩu"
                        required
                        mode="password"
                        className="w-[250px] phone:w-[300px] tablet:w-[400px]"
                      />

                      <div className="mb-[80px] mt-[-10px] flex justify-between">
                        <div></div>
                        <button className="text-sm font-semibold text-gray-600">
                          Quên mật khẩu
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={submitForm}
                      className="h-[50px] w-[250px] rounded-lg bg-gray-500 font-bold text-white phone:w-[300px] laptop:w-[400px]"
                    >
                      {loginLoading ? <CircularProgress color="inherit" size={25} /> : 'Đăng nhập'}
                    </button>
                  </div>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
