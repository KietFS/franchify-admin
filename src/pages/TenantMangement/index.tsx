import * as React from 'react';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import BaseInput from '../../components/BaseInput';
import { Formik } from 'formik';
import * as yup from 'yup';
import RichTextInput from '../../designs/RichTextInput';
import Button from '../../designs/Button';
import { apiURL } from '../../config/constanst';
import UploadWidget from '../../designs/UploadWidget';
import { CircularProgress } from '@mui/material';

interface IFormValue {
  name: string;
  email: string;
  fullDescription?: string;
  slogan?: string;
  logoUrl?: string;
  companyPhoneNumber: string;
  companyLegalName: string;
  primaryColorScheme?: string;
}

const TenantManagement = () => {
  const [initialValues, setInitalValues] = React.useState<IFormValue>({
    name: '',
    email: '',
    companyPhoneNumber: '',
    companyLegalName: '',
  });
  const [logoSelected, setLogoSelected] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const validationSchema = yup.object().shape<{ [k in keyof IFormValue]: any }>({
    name: yup.string().required('Vui lòng nhập tên thương hiệu'),
    email: yup.string().email('Vui lòng nhập đúng định dạng email'),
    companyPhoneNumber: yup.string().required('Vui lòng nhập số điện thoại công ty'),
    companyLegalName: yup.string().required('Vui lòng nhập tên pháp lý công ty'),
  });

  const getTenantConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/tenant/config`);
      if (response?.data?.success) {
        setLoading(false);
        setInitalValues(response.data?.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: IFormValue) => {
    try {
      const response = await axios.put(`${apiURL}/tenant/config`, {
        ...values,
        logoUrl: logoSelected,
      });
      if (response?.data?.success) {
        console.log('Update tenant config success');
        await getTenantConfig();
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getTenantConfig();
  }, []);

  React.useEffect(() => {
    setLogoSelected(initialValues?.logoUrl);
  }, [initialValues]);

  return (
    <MainLayout
      title="Quản lý thương hiệu"
      content={
        <>
          {loading ? (
            <div className="flex h-full min-h-[300px] w-full items-center justify-center">
              <CircularProgress size={50} sx={{ color: 'black' }} />
            </div>
          ) : (
            <Formik
              initialValues={initialValues || ({} as any)}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ submitForm, values, handleSubmit, setValues, setFieldValue }) => {
                return (
                  <div className="flex flex-col space-y-10 px-10">
                    <div className="flex flex-col space-y-5">
                      <div className="grid grid-cols-1 items-center justify-between gap-x-8 gap-y-5 tablet:grid-cols-2">
                        <BaseInput
                          type="text"
                          name="name"
                          value={values?.name}
                          label="Tên thương hiệu"
                          placeholder="Nhập tên thương hiệu"
                        />
                        <BaseInput
                          type="text"
                          name="email"
                          value={values?.email}
                          label="Email công ty"
                          placeholder="Nhập email của công ty"
                        />
                      </div>
                      <div className="grid grid-cols-1 items-center justify-between gap-x-8 gap-y-5 tablet:grid-cols-2">
                        <BaseInput
                          mode="text"
                          name="companyLegalName"
                          value={values?.companyLegalName}
                          label="Tên pháp lý công ty"
                          placeholder=""
                        />
                        <BaseInput
                          type="phoneNumber"
                          name="companyPhoneNumber"
                          value={values?.companyPhoneNumber}
                          label="Số điện thoại công ty"
                          placeholder="Nhập số điện thoại công ty"
                        />
                        <BaseInput
                          type="text"
                          name="slogan"
                          value={values?.slogan}
                          label="Slogan"
                          placeholder="Nhập slogan của công ty"
                        />
                        <BaseInput
                          type="text"
                          name="primaryColorScheme"
                          value={values?.primaryColorScheme}
                          label="Màu chủ đạo"
                          placeholder="Màu chủ đạo"
                        />
                      </div>

                      <RichTextInput
                        name="fullDescription"
                        value={values?.fullDescription}
                        label="Mô tả đày đủ của công ty"
                        placeholder="Mô tả đầy đủ của công ty"
                      />

                      <UploadWidget
                        thumbnailUploaded={logoSelected}
                        setThumbnailUploaded={(image) => setLogoSelected(image)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div></div>
                      <div className="flex items-center">
                        <Button variant="secondary" onClick={() => {}} title="Hủy bỏ" />
                        <Button
                          type="submit"
                          title="Xác nhận"
                          variant="primary"
                          className="ml-2"
                          isLoading={false}
                          onClick={handleSubmit}
                        />
                      </div>
                    </div>
                  </div>
                );
              }}
            </Formik>
          )}
        </>
      }
    />
  );
};

export default TenantManagement;
