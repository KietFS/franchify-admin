import React, { useEffect } from 'react';

import { XMarkIcon } from '@heroicons/react/20/solid';
import { Formik } from 'formik';
import * as yup from 'yup';
import InputText from '../../designs/InputText';
import Button from '../../designs/Button';
import RichTextInput from '../../designs/RichTextInput';
import InputNumber from '../../designs/InputNumber';
import BaseInput from '../../components/BaseInput';
import { useAppSelector } from '../../hooks/useRedux';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import SelectComponent from '../../components/Select';
import { apiURL } from '../../config/constanst';
import UploadWidget from '../../designs/UploadWidget';
import UploadMultipleWidget from '../../designs/UploadMultipleWidget';

interface IFormValue extends Omit<IStoreProduct, 'id'> {}
interface IProductFormProps {
  currentProduct: IStoreProduct | null;
  onClose: () => void;
  loading: boolean;
  onConfirm: (values: IFormValue) => void;
}

const StoreProductForm: React.FC<IProductFormProps> = (props) => {
  const { currentProduct, onClose, loading, onConfirm } = props;
  const [initialValues, setInitialValues] = React.useState<IFormValue | null>(
    currentProduct || null,
  );
  const { accessToken } = useAppSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = React.useState<IProductCategory | null>(null);
  const [thumbnailSelected, setThumbnailSelected] = React.useState<string>('');
  const [images, setImagesSelected] = React.useState<string[]>([]);

  const validationSchema = yup.object().shape<{ [k in keyof IFormValue]: any }>({
    inventory: yup.number().required('Vui lòng nhập số lượng sản phẩm'),
    product: yup.object().shape({
      name: yup.string().required('Vui lòng điền tên sản phẩm'),
      upc: yup.string().required('Vui lòng nhập mã sản phẩm'),
      price: yup.object().shape<{ [k in keyof ProductPrice]: any }>({
        price: yup.number().required('Vui lòng nhập giá sản phẩm'),
        displayPrice: yup.string().required('Vui lòng nhập giá sản phẩm'),
      }),
    }),
  });

  const handleSubmit = async (values: IFormValue) => {
    onConfirm({
      ...values,
      inventory: Number(values?.inventory),
      price: {
        ...values?.price,
        displayPrice: (values?.price?.displayPrice ||
          values?.product?.price?.displayPrice) as string,
        displaySalePrice: (values?.price?.displaySalePrice ||
          values?.product?.price?.displaySalePrice) as string,
        price: Number(values?.price?.price) || Number(values?.product?.price?.price),
        salePrice: Number(values?.price?.salePrice || Number(values?.product?.price?.salePrice)),
      },
    });
  };

  useEffect(() => {
    if (!!currentProduct) {
      setThumbnailSelected(currentProduct?.product?.thumbnail || '');
      setImagesSelected(currentProduct?.product?.images || []);
    }
  }, [currentProduct]);

  return (
    <Formik
      initialValues={initialValues || ({} as any)}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ submitForm, values, handleSubmit, setValues, setFieldValue }) => {
        return (
          <div className="flex flex-col space-y-10">
            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-1 items-center justify-between gap-x-2 gap-y-5 tablet:grid-cols-2">
                <BaseInput
                  type="text"
                  disabled={true}
                  name="product.name"
                  value={values?.product?.name}
                  label="Tên sản phẩm"
                  placeholder="Nhập tên sản phẩm"
                />
                <BaseInput
                  type="text"
                  disabled={true}
                  name="product.upc"
                  value={values?.product?.upc}
                  label="Mã sản phẩm"
                  placeholder="Nhập mã sản phẩm"
                />
              </div>
              <div className="grid grid-cols-1 items-center justify-between gap-x-2 gap-y-5 tablet:grid-cols-2">
                <BaseInput
                  type="number"
                  mode="text"
                  name="price.price"
                  value={values?.price?.price}
                  label="Giá sản phẩm"
                  placeholder="Nhập giá sản phẩm"
                />
                <BaseInput
                  type="text"
                  name="price.displayPrice"
                  value={values?.price?.displayPrice}
                  label="Giá hiển thị sản phẩm"
                  placeholder="Nhập giá hiển thị sản phẩm"
                />
                <BaseInput
                  type="number"
                  mode="text"
                  name="price.salePrice"
                  value={values?.price?.salePrice}
                  label="Giá sale sản phẩm"
                  placeholder="Nhập giá sale sản phẩm"
                />
                <BaseInput
                  type="text"
                  name="price.displaySalePrice"
                  value={values?.price?.displaySalePrice}
                  label="Giá sale hiển thị sản phẩm"
                  placeholder="Nhập giá sale hiển thị sản phẩm"
                />
              </div>
              <div>
                <BaseInput
                  type="number"
                  name="inventory"
                  value={values?.inventory}
                  label="Số lượng hiện có"
                  placeholder="Nhập số lượng hiện có"
                />
              </div>
              <UploadWidget
                thumbnailUploaded={thumbnailSelected}
                setThumbnailUploaded={(image) => setThumbnailSelected(image)}
              />
              <UploadMultipleWidget
                thumbnailUploaded={images}
                setThumbnailUploaded={(images) => setImagesSelected(images)}
              />

              <RichTextInput
                name="product.fullDescription"
                disabled
                value={values?.product?.fullDescription}
                label="Mô tả"
                placeholder="Mô tả sản phẩm"
              />
            </div>
            <div className="flex items-center justify-between">
              <div></div>
              <div className="flex items-center">
                <Button variant="secondary" onClick={() => onClose()} title="Đóng" />
                <Button
                  type="submit"
                  title="Xác nhận"
                  variant="primary"
                  className="ml-2"
                  isLoading={props?.loading}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default StoreProductForm;
