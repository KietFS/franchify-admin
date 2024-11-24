import React, {useState} from 'react';
import {Formik} from 'formik';
import Button from '../../designs/Button';
import SwitchListSecondary from './SwitchListSecondary';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {StaticTimePicker} from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs';
import BaseInput from '../../components/BaseInput';
import StoreMap from './StoreMap';
import useStoreManagement from "../../hooks/useStoreManagement";
import {toast} from "react-toastify";

interface IStoreFormValue {
    id: number | null;
    name: string;
    storeCode: string;
    supportDelivery: boolean;
    supportPickup: boolean;
    openTime: number | null;
    closeTime: number | null;
    lat: number | null;
    lng: number | null;
}

interface IStoreFormProps {
    currentStore: IStoreFormValue | null;
    onClose: () => void;
    loading: boolean;
    onSuccess: (values: IStoreFormValue) => void;
}

const UpdateStoreForm: React.FC<IStoreFormProps> = ({
                                                        currentStore,
                                                        onClose,
                                                        loading,
                                                        onSuccess,
                                                    }) => {
    const [initialValues, setInitialValues] = useState<IStoreFormValue>(
        currentStore || {
            id: null,
            name: '',
            storeCode: '', // Changed to empty string
            supportDelivery: false,
            supportPickup: false,
            openTime: null,
            closeTime: null,
            lat: 10.8231,
            lng: 106.6297,
        },
    );
    const {updateStore} = useStoreManagement()

    const handleSubmit = async (values: IStoreFormValue) => {
        try {
            await updateStore(currentStore, values, () => onSuccess(values));
        } catch (error) {
            toast.error('Cập nhật cửa hàng thất bại');
        }

    };

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
            {({handleSubmit, values, setFieldValue}) => (
                <div className="flex flex-col space-y-10">
                    <div className="flex flex-col space-y-5">
                        {/* Name and StoreCode */}
                        <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
                            <BaseInput
                                type="text"
                                name="name"
                                value={values.name}
                                label="Tên cửa hàng"
                                placeholder="Nhập tên cửa hàng"
                                onChange={(e) => setFieldValue('name', e.target.value)}
                            />
                            <BaseInput
                                type="text" // Changed to text for compatibility
                                name="storeCode"
                                value={values.storeCode}
                                label="Mã cửa hàng"
                                placeholder="Nhập mã cửa hàng"
                                onChange={(e) => setFieldValue('storeCode', e.target.value)}
                            />
                        </div>

                        {/* Support Options */}
                        <SwitchListSecondary
                            onChangeSupportDelivery={(value: boolean) => {
                                setFieldValue('supportDelivery', value);
                            }}
                            onChangeSupportPickup={(value: boolean) => {
                                setFieldValue('supportPickup', value);
                            }}
                            initialValues={{
                                supportDelivery: values.supportDelivery,
                                supportPickup: values.supportPickup,
                            }}
                        />

                        {/* Time Pickers */}
                        <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <StaticTimePicker
                                    label="Giờ mở cửa"
                                    value={values.openTime ? dayjs().hour(values.openTime) : null}
                                    onChange={(newValue) => setFieldValue('openTime', newValue?.hour())}
                                    renderInput={(params) => (
                                        // @ts-ignore
                                        <BaseInput {...params} />
                                    )}
                                />
                                <StaticTimePicker
                                    label="Giờ đóng cửa"
                                    value={values.closeTime ? dayjs().hour(values.closeTime) : null}
                                    onChange={(newValue) => setFieldValue('closeTime', newValue?.hour())} // Store
                                    renderInput={(params) => (
                                        // @ts-ignore
                                        <BaseInput {...params} />
                                    )}
                                />
                            </LocalizationProvider>
                        </div>
                        <div>
                            <h2 className="mb-2 text-lg font-semibold">Địa chỉ</h2>
                            <StoreMap/>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                        <Button variant="secondary" onClick={onClose} title="Đóng"/>
                        <Button
                            type="button"
                            title="Xác nhận"
                            variant="primary"
                            isLoading={loading}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default UpdateStoreForm;
