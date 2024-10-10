import React from "react";

import { XMarkIcon } from "@heroicons/react/20/solid";
import { Formik } from "formik";
import * as yup from "yup";
import InputText from "../../designs/InputText";
import Button from "../../designs/Button";
import RichTextInput from "../../designs/RichTextInput";

interface IProductFormProps {
  currentProduct: IProduct | null;
  onClose: () => void;
  loading: boolean;
}

interface IFormValue extends Omit<IProduct, "id"> {}

const ProductForm: React.FC<IProductFormProps> = (props) => {
  const { currentProduct, onClose, loading } = props;
  const [initialValues, setInitialValues] = React.useState<IFormValue | null>(
    currentProduct || null
  );

  const validationSchema = yup
    .object()
    .shape<{ [k in keyof IFormValue]: any }>({
      name: yup.string().required("Vui lòng điền tên của bạn"),
      upc: yup.string().required("Vui lòng nhập mã sản phẩm"),
    });

  const handleSubmit = async (values: IFormValue) => {
    alert("Submit");
  };

  return (
    <Formik
      initialValues={initialValues as any}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ submitForm, values, handleSubmit }) => {
        return (
          <div className="flex flex-col space-y-10">
            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-2 gap-y-5 items-center justify-between">
                <InputText
                  name="name"
                  value={initialValues?.name}
                  label="Tên sản phẩm"
                  placeholder="Nhập tên sản phẩm"
                />
                <InputText
                  name="upc"
                  value={initialValues?.upc}
                  label="Mã sản phẩm"
                  placeholder="Nhập mã sản phẩm"
                />
              </div>

              <RichTextInput
                name="fullDescription"
                value={initialValues?.fullDescription}
                label="Mô tả"
                placeholder="Mô tả sản phẩm"
              />
            </div>
            <div className="flex justify-between items-center">
              <div></div>
              <div className="flex items-center">
                <Button
                  variant="secondary"
                  onClick={() => onClose()}
                  title="Đóng"
                />
                <Button
                  type="submit"
                  title="Xác nhận"
                  variant="primary"
                  className="ml-2"
                  isLoading={loading}
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

export default ProductForm;
