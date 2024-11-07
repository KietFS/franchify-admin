import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import Spinner from '../../components/Spinner';
import { apiURL } from '../../config/constanst';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ActionMenu from '../../components/ActionMenu';
import { toast } from 'react-toastify';
import PropertiesDialog from './PropertiesDialog';
import CustomFieldDialog from './CustomFieldsDialog';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useHistory } from 'react-router-dom';
import CreateCategoryDialog from './CreateCategoryDialog';
import { useDispatch } from 'react-redux';
import { setListCategory } from '../../redux/slices/category';

const CategoryManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [categories, setCategories] = React.useState<IProductCategory[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>('');
  const [openCreateDialog, setOpenCreateDialog] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const { user, accessToken } = useAppSelector((state: IRootState) => state.auth);
  const history = useHistory();

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
        dispatch(setListCategory(response?.data?.data?.data));
      }
    } catch (error) {
      console.error('GET PRODUCT CATEGORY ERROR', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentCategory = async (item: IProductCategory, onSuccess: () => void) => {
    console.log('item', item);
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

  const createNewCategory = async (item: Omit<IProductCategory, 'id'>, onSuccess: () => void) => {
    try {
      const response = await axios.post(`${apiURL}/category/`, item, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        onSuccess();
        fetchCategories();
        toast.success('Tạo danh mục mới thành công');
      } else {
        onSuccess();
        fetchCategories();
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
        fetchCategories();
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
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Tên danh mục',
      width: 460,
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
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'string',
      width: 300,
      headerAlign: 'left',
      align: 'left',
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
          <Spinner size={20} />
        ) : (
          <ActionMenu options={options} />
        );
      },
    },
  ];

  return (
    <>
      <MainLayout
        title="Danh sách các danh mục"
        content={
          <div className="flex flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
            <div className="flex justify-between">
              <div></div>
              <button
                onClick={() => setOpenCreateDialog(true)}
                className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
              >
                <PlusIcon className="h-[20px] w-[20px] font-bold text-white" />
                <p>Thêm danh mục</p>
              </button>
            </div>
            <div className="h-[700px] w-full">
              <DataGrid
                loading={isLoading}
                rows={categories}
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
          onOpenCustomFields={() => {}}
          onCreateCategory={(params, actionSuccess) => createNewCategory(params, actionSuccess)}
          open={openCreateDialog}
        />
      )}
    </>
  );
};

export default CategoryManagement;

interface IViewCustomFieldCellProps {
  category: IProductCategory;
  onUpdateItem: (item: IProductCategory, actionSuccess: () => void) => void;
  onClose: () => void;
}

const ViewHistoryCell: React.FC<IViewCustomFieldCellProps> = (props) => {
  const [openPropertyDialog, setOpenPropertyDialog] = React.useState<boolean>(false);
  const [openCustomField, setOpenCustomField] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<IProductCategoryProperty | null>(null);
  const { user } = useAppSelector((state: IRootState) => state.auth);

  const { category, onUpdateItem } = props;

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
            props.onUpdateItem(fields, actionSuccess);
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

          props.onUpdateItem({ ...category, properties: [...cloned] }, actionSuccess);
          setOpenCustomField(false);
        }}
        options={currentItem?.options}
      />
    </div>
  );
};
