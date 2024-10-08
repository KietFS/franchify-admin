import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import LoginBackground from "../../../assets/images/LoginBackground.png";

//components
import InputPassword from "../../../designs/InputPassword";
import InputEmail from "../../../designs/InputEmail";
import { useAuth } from "../../../hooks/useAuth";
import { useAppSelector } from "../../../hooks/useRedux";
import { IRootState } from "../../../redux";
import BaseInput from "../../../components/BaseInput";
import Spinner from "../../../components/Spinner";
import { CircularProgress } from "@mui/material";
// import { useAppSelector } from "../../../hooks/useRedux";
// import { IRootState } from "../../../redux";
// import { useRouter } from "next/router";

interface ILoginPageProps {}

interface IFormValue {
  phoneNumber: string;
  password: string;
}

const validationSchema = yup.object().shape<{ [k in keyof IFormValue]: any }>({
  phoneNumber: yup.string().required("Vui lòng nhập email của bạn"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải lớn hơn 6 kí tự")
    .required("Vui lòng nhập mật khẩu của bạn"),
});
const LoginPage: React.FC<ILoginPageProps> = () => {
  const { googleLogin, login, loginLoading, loginError } = useAuth();
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const [initialValues, setInitialValues] = useState<IFormValue>({
    phoneNumber: "",
    password: "",
  });

  const handleSubmit = (values: IFormValue) => {
    login(values.phoneNumber, values.password);
  };

  return (
    <>
      <head>
        <title>Sneakry - Đăng nhập</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <div className="flex h-screen items-center laptop:px-36 px-10 bg-gray-100">
        <div className="w-screen bg-white flex flex-col laptop:flex laptop:flex-row justify-center items-center px-2 phone:px-8 h-[450px] tablet:h-[500px] laptop:h-[600px] shadow-2xl drop-shadow-sm border-gray-100 border rounded-2xl">
          <div className="hidden laptop:flex h-screen items-center">
            <img
              src={LoginBackground}
              width={600}
              height={600}
              className="my-auto"
            />
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
                      <h1 className="text-center text-gray-600 text-4xl font-bold">
                        Market Floor
                      </h1>
                      <p className="text-sm text-center text-gray-600 mt-2">
                        Trang dành cho quản trị viên và nhân viên cửa hàng
                      </p>
                    </div>
                    <div className="space-y-5">
                      {loginError && (
                        <p className="text-gray-500">Something wrong happens</p>
                      )}
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

                      <div className="flex justify-between mb-[80px] mt-[-10px]">
                        <div></div>
                        <button className="text-gray-600 text-sm font-semibold">
                          Quên mật khẩu
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={submitForm}
                      className="bg-gray-500 font-bold text-white  rounded-lg w-[250px] phone:w-[300px] laptop:w-[400px] h-[50px]"
                    >
                      {loginLoading ? (
                        <CircularProgress color="inherit" size={25} />
                      ) : (
                        "Đăng nhập"
                      )}
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
