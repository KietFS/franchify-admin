import * as React from 'react';
import {DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel} from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import {useAppSelector} from '../../hooks/useRedux';
import {IRootState} from '../../redux';
import {apiURL} from '../../config/constanst';
import {toast} from 'react-toastify';
import PropertiesDialog from './PropertiesDialog';
import CustomFieldDialog from './CustomFieldsDialog';
import CreateCategoryDialog from './CreateCategoryDialog';
import {useDispatch} from 'react-redux';
import {setListCategory} from '../../redux/slices/category';
import SpinnerWrapper from '../../components/SpinnerWrapper';
import Spinner from '../../components/Spinner';
import ActionMenu from '../../components/ActionMenu';
import Button from '../../designs/Button';
import SimpleInput from '../../components/SimpleInput';
import {ICategory} from "../../types/models";

const CategoryManagement = () => {
    const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [actionLoading, setActionLoading] = React.useState<boolean>(false);
    const [selectedRow, setSelectedRow] = React.useState<string | number>('');
    const [openCreateDialog, setOpenCreateDialog] = React.useState<boolean>(false);
    const [categoryTableData, setCategoryTableData] = React.useState<ICategory[]>([]);

    const dispatch = useDispatch();
    const {accessToken} = useAppSelector((state: IRootState) => state.auth);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiURL}/category`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setCategories(response?.data?.data?.data);
                setCategoryTableData(response?.data?.data?.data);
                dispatch(setListCategory(response?.data?.data?.data));
            }
        } catch (error) {
            console.error('Get product category error', error);
        } finally {
            setLoading(false);
        }
    };

    const updateCurrentCategory = async (item: ICategory, onSuccess: () => void) => {
        if (item.id !== null) {
            try {
                const response = await axios.put(`${apiURL}/category/${item.id}`, item, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (response?.data?.success) {
                    onSuccess();
                    toast.success('Cập nhật danh mục thành công');
                } else {
                    onSuccess();
                    toast.error('Cập nhật danh mục thất bại');
                    console.error('Update current category error');
                }
            } catch (error) {
                console.error('Errors is', error);
            }
        }
    };

    const createNewCategory = async (item: Omit<ICategory, 'id'>, onSuccess: () => void) => {
        try {
            const response = await axios.post(`${apiURL}/category/`, item, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                onSuccess();
                await fetchCategories();
                toast.success('Tạo danh mục mới thành công');
            } else {
                onSuccess();
                await fetchCategories();
                toast.error('Tạo danh mục mới thất bại');
            }
        } catch (error) {
            console.error('Errors is', error);
        }
    };

    const removeCategory = async (id: string | number) => {
        try {
            setActionLoading(true);
            setSelectedRow(id);
            const response = await axios.delete(`${apiURL}/category/${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                await fetchCategories();
                toast.success('Xóa danh mục thành công');
            } else {
                console.error('Error', response?.data?.data, response?.data?.error);
            }
        } catch (error) {
            console.error('Client Error', error);
        } finally {
            setActionLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCategories();
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Hành động',
            type: 'string',
            width: 100,
            renderCell: (params: GridRenderCellParams<any>) => {
                const options = [
                    {
                        id: 'delete',
                        title: 'Xóa danh mục',
                        onPress: () => removeCategory(params.row?.id),
                        onActionSuccess: () => fetchCategories(),
                    },
                ];
                return actionLoading && selectedRow === params.row?.id ? (
                    <Spinner size={20}/>
                ) : (
                    <ActionMenu options={options}/>
                );
            },
        },
        {field: 'id', headerName: 'ID', width: 70},
        {
            field: 'name',
            headerName: 'Tên danh mục',
            width: 300,
            renderCell: (params) => (
                <div className="w-[100px]">
                    <ViewHistoryCell
                        category={params.row}
                        onUpdateItem={(returnedParams, actionSuccess) => {
                            updateCurrentCategory(returnedParams, () => {
                                actionSuccess();
                                fetchCategories();
                            });
                        }}
                        onClose={() => fetchCategories()}
                    />
                </div>
            ),
        },
        {
            field: 'properties',
            headerName: 'Các trường',
            renderCell: (params: GridRenderCellParams<string>) => (
                <div className="w-[100px]">
                    <p>
                        {!!params?.row?.properties[0]?.name
                            ? `${params?.row?.properties[0]?.name}...`
                            : 'Chưa có'}
                    </p>
                </div>
            ),
            width: 200,
        },
    ];

    const handleSearch = (value: string) => {
        if (value?.length > 0) {
            const filteredData = categories.filter((category: any) => {
                if (category?.name.toLowerCase().includes(value.toLowerCase())) {
                    return true;
                }
            });
            setCategoryTableData([...filteredData]);
        } else {
            setCategoryTableData(categories);
        }
    };

    return (
        <>
            <MainLayout
                title="Quản lý các danh mục"
                content={
                    <div className="flex flex-col gap-y-5 rounded-2xl bg-white">
                        <div className="flex items-center justify-between">
                            <SimpleInput
                                name="search-user"
                                label="Tìm kiếm danh mục"
                                mode="text"
                                className="max-w-[400px] rounded-xl border border-gray-300 px-4 py-2 text-sm"
                                placeholder="Giày dép"
                                autoComplete="off"
                                onChangeValue={(value) => handleSearch(value as string)}
                            />

                            <Button
                                title="Tạo danh mục"
                                onClick={() => setOpenCreateDialog(true)}

                            />
                        </div>
                        <div className="h-[700px] w-full rounded-xl">
                            <DataGrid
                                sx={{borderRadius: '8px'}}
                                components={{
                                    LoadingOverlay: SpinnerWrapper,
                                }}
                                loading={isLoading}
                                rows={categoryTableData}
                                columns={columns}
                                pageSize={10}
                                disableSelectionOnClick
                                rowsPerPageOptions={[10]}
                                onSelectionModelChange={(newSelectionModel) => {
                                    setDeleteDisable(!deleteDisable);
                                    setSelectionModel(newSelectionModel);
                                }}
                                selectionModel={selectionModel}
                                checkboxSelection={false}
                            />
                        </div>
                    </div>
                }
            />

            {openCreateDialog && (
                <CreateCategoryDialog
                    onClose={() => setOpenCreateDialog(false)}
                    onOpenCustomFields={() => {
                    }}
                    onCreateCategory={(params, actionSuccess) => createNewCategory(params, actionSuccess)}
                    open={openCreateDialog}
                />
            )}
        </>
    );
};

export default CategoryManagement;

interface IViewCustomFieldCellProps {
    category: ICategory;
    onUpdateItem: (item: ICategory, actionSuccess: () => void) => void;
    onClose: () => void;
}

const ViewHistoryCell: React.FC<IViewCustomFieldCellProps> = (props) => {
    const [openPropertyDialog, setOpenPropertyDialog] = React.useState<boolean>(false);
    const [openCustomField, setOpenCustomField] = React.useState<boolean>(false);
    const [currentItem, setCurrentItem] = React.useState<ICategory | null>(null);

    const {category} = props;

    const handleOpenCustomField = (item: any) => {
        setOpenCustomField(true);
        setCurrentItem(item);
    };

    return (
        <div className="">
            <button className="flex-start w-[120px]" onClick={() => setOpenPropertyDialog(true)}>
                <p className="mr-10 text-left">{props.category?.name}</p>
            </button>
            {openPropertyDialog && (
                <PropertiesDialog
                    category={category}
                    open={openPropertyDialog}
                    onClose={() => setOpenPropertyDialog(false)}
                    onOpenCustomFields={handleOpenCustomField}
                    onUpdateFields={(fields, actionSuccess) => {
                        props.onUpdateItem(fields as any, actionSuccess);
                    }}
                />
            )}

            <CustomFieldDialog
                open={openCustomField}
                onClose={() => setOpenCustomField(false)}
                onUpdateOptions={(value, actionSuccess) => {
                    let cloned = category?.properties;
                    category?.properties?.forEach((property, propertyIndex) => {
                        if (property?.name === currentItem?.name) {
                            cloned[propertyIndex].options = value;
                        }
                    });

                    props.onUpdateItem({...category, properties: [...cloned]}, actionSuccess);
                    setOpenCustomField(false);
                }}
                options={(currentItem as any)?.options as any}
            />
        </div>
    );
};
