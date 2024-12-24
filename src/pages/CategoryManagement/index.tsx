import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '@/components/MainLayout';
import PropertiesDialog from './PropertiesDialog';
import CustomFieldDialog from './CustomFieldsDialog';
import CreateCategoryDialog from './CreateCategoryDialog';
import SpinnerWrapper from '@/components/SpinnerWrapper';
import ActionMenu from '@/components/ActionMenu';
import Button from '@/designs/Button';
import SimpleInput from '@/components/SimpleInput';
import { ICategory } from '@/types/models';
import useCategoryManagement from '@/hooks/useCategoryManagement';
import { useAuth } from '@/hooks/useAuth';

const CategoryManagement = () => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [openCreateDialog, setOpenCreateDialog] = React.useState<boolean>(false);
  const {
    fetchCategories,
    listCategory,
    loading,
    handleSearch,
    updateCurrentCategory,
    createNewCategory,
    removeCategory,
    actionLoading,
  } = useCategoryManagement();

  const { accessToken } = useAuth();

  React.useEffect(() => {
    fetchCategories({
      overrideCache: false,
      addLoading: true,
    });
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
        return <ActionMenu options={options} />;
      },
    },
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Tên danh mục',
      width: 300,
      renderCell: (params) => (
        <div className="w-[100px]">
          <ViewHistoryCell
            category={params.row}
            onUpdateItem={async (returnedParams, actionSuccess) => {
              await updateCurrentCategory(returnedParams, async () => {
                actionSuccess();
                await fetchCategories();
              });
            }}
            onClose={async () => await fetchCategories()}
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

              <Button title="Tạo danh mục" onClick={() => setOpenCreateDialog(true)} />
            </div>
            <div className="h-[700px] w-full rounded-xl">
              <DataGrid
                sx={{ borderRadius: '8px' }}
                components={{
                  LoadingOverlay: SpinnerWrapper,
                }}
                loading={loading}
                rows={listCategory}
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
  category: ICategory;
  onUpdateItem: (item: ICategory, actionSuccess: () => void) => void;
  onClose: () => void;
}

const ViewHistoryCell: React.FC<IViewCustomFieldCellProps> = (props) => {
  const [openPropertyDialog, setOpenPropertyDialog] = React.useState<boolean>(false);
  const [openCustomField, setOpenCustomField] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<ICategory | null>(null);

  const { category } = props;

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

          props.onUpdateItem({ ...category, properties: [...cloned] }, actionSuccess);
          setOpenCustomField(false);
        }}
        options={(currentItem as any)?.options as any}
      />
    </div>
  );
};
