import React, {useEffect} from 'react';

import {Formik} from 'formik';
import * as yup from 'yup';
import Button from '../../designs/Button';
import BaseInput from '../../components/BaseInput';
import {Divider} from '@mui/material';
import {IOrder} from "../../types/models";

interface IFormValue extends IOrder {
}

interface IOrderForm {
    currentOrder: IOrder | null;
    onConfirm: (values: IFormValue) => void;
    loading?: boolean;
}

const OrderForm: React.FC<IOrderForm> = (props) => {
    const {currentOrder, onConfirm, loading = false} = props;
    const [initialValues, setInitialValues] = React.useState<IFormValue | null>(currentOrder || null);

    //@ts-ignore
    const validationSchema = yup.object().shape<{ [k in keyof IFormValue]: any }>({
        id: yup.number().required('Vui lòng điền mã sản phẩm'),
    } as any);

    const renderOrderStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="text-md font-bold text-yellow-600">Đang chờ xử lý</span>;

            case 'received':
                return <span className="text-md font-bold text-blue-600">Đã nhận đơn</span>;

            case 'processing':
                return <span className="text-md font-bold text-lime-600">Đang xử lý</span>;

            case 'shipping':
                return <span className="text-md font-bold text-blue-600">Đang giao hàng</span>;

            case 'delivered':
                return <span className="text-md font-bold text-orange-600">Đã giao hàng</span>;

            case 'cancelled':
                return <span className="text-md font-bold text-red-600">Đã hủy</span>;
        }
    };

    const submitButtonText = {
        pending: 'Chuyển sang xác nhận',
        received: 'Chuyển sang xử lý',
        processing: 'Chuyển sang giao hàng',
        shipping: 'Chuyển sang đã giao hàng',
        delivered: 'Chuyển sang hoàn thành',
        completed: 'Hoàn thành',
    };

    const handleSubmit = async (values: IFormValue) => {
        onConfirm({
            ...values,
        });
    };

    useEffect(() => {
        setInitialValues(currentOrder as IFormValue);
    }, [currentOrder]);

    return (
        <Formik
            initialValues={initialValues || ({} as any)}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({submitForm, values, handleSubmit, setValues, setFieldValue}) => {
                console.log('values', values);
                return (
                    <div className="flex flex-col space-y-20">
                        <div className="flex flex-col space-y-6">
                            <BaseInput
                                type="text"
                                name="id"
                                value={values?.id}
                                disabled
                                label="Mã đơn hàng"
                                placeholder="Nhập mã đơn hàng"
                            />

                            <div className="flex w-full items-center justify-between">
                                <p className="text-md font-bold text-gray-600">Trạng thái đơn hàng</p>
                                {values?.status && renderOrderStatus(values?.status)}
                            </div>

                            <div className="flex w-full items-center justify-between">
                                <p className="text-md font-bold text-gray-600">Giá trị đơn hàng</p>
                                <p className="text-md font-bold italic text-green-600">
                                    {Number(values?.totalAmount)?.toString().prettyMoney()}{' '}
                                </p>
                            </div>

                            <Divider/>

                            <div
                                className="grid grid-cols-1 items-center justify-between gap-x-2 gap-y-5 tablet:grid-cols-2">
                                <BaseInput
                                    type="text"
                                    name="createdAt"
                                    value={(values?.createdAt as unknown as string)?.prettyDateTime()}
                                    label="Ngày tạo đơn hàng"
                                    placeholder="Nhập ngày tạo đơn hàng"
                                />
                                <BaseInput
                                    type="text"
                                    name="updatedAt"
                                    value={(values?.updatedAt as unknown as string)?.prettyDateTime()}
                                    label="Ngày tạo đơn hàng"
                                    placeholder="Nhập ngày tạo đơn hàng"
                                />
                                <BaseInput
                                    type="text"
                                    name="user.lastName"
                                    value={values?.user?.lastName}
                                    disabled
                                    label="Họ khách hàng"
                                    placeholder="Nhập họ khách hàng"
                                />

                                <BaseInput
                                    type="text"
                                    name="user.firstName"
                                    value={values?.user?.firstName}
                                    disabled
                                    label="Tên khách hàng"
                                    placeholder="Nhập tên khách hàng  "
                                />
                            </div>
                            <Divider/>
                            <div
                                className="grid grid-cols-1 items-center justify-between gap-x-2 gap-y-5 tablet:grid-cols-2">
                                <BaseInput
                                    type="text"
                                    disabled
                                    name="orderAddress.address"
                                    value={values?.orderAddress?.address}
                                    label="Địa chỉ người nhận"
                                    placeholder="Nhập địa chỉ người nhận"
                                />

                                <BaseInput
                                    type="text"
                                    disabled
                                    name="orderAddress.province"
                                    value={values?.orderAddress?.province}
                                    label="Tỉnh thành"
                                    placeholder="Nhập tỉnh thành"
                                />

                                <BaseInput
                                    type="text"
                                    disabled
                                    name="orderAddress.district"
                                    value={values?.orderAddress?.district}
                                    label="Huyện"
                                    placeholder="Nhập huyện"
                                />

                                <BaseInput
                                    type="text"
                                    disabled
                                    name="orderAddress.ward"
                                    value={values?.orderAddress?.ward}
                                    label="Phường xã"
                                    placeholder="Nhập phường, xã"
                                />
                            </div>
                            <Divider/>
                            <div className="mt-8 w-full">
                                <p className="text-md font-bold text-gray-600">Chi tiết đơn hàng</p>
                                <div className="mt-4">
                                    {values?.orderDetails?.map((item: any, index: number) => (
                                        <div className="flex w-1/2 items-center justify-between">
                                            <p>
                                                Sản phẩm <strong>{item?.product?.name}</strong>
                                            </p>
                                            <div className="flex gap-x-2">
                                                <p>{item?.quantity}</p>
                                                <strong className="font-semibold text-green-600">
                                                    ({(Number(item?.price) * 1000).toString().prettyMoney()})
                                                </strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div></div>
                            <div className="flex items-center">
                                <Button
                                    type="submit"
                                    //@ts-ignore
                                    title={submitButtonText?.[values?.status as string]}
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

export default OrderForm;
