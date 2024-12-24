import React, { useEffect, useState } from 'react';

//styles
import { Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '@/designs/Button';

interface ICustomFieldDialogProps {
  onClose: () => void;
  open: boolean;
  options?: string[];
  onUpdateOptions: (value: string[], actionSuccess: () => void) => void;
}

const CustomFieldDialog: React.FC<ICustomFieldDialogProps> = ({
  onClose,
  open,
  options,
  onUpdateOptions,
}) => {
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    if (!!options && options?.length > 0) {
      setValues(options);
    } else {
      setValues([]);
    }
  }, [options]);

  const handleCreateNewOption = () => {
    let clonedValues = [...values];
    clonedValues.push('');
    setValues([...clonedValues]);
  };

  const handleConfirmUpdate = () => {
    onUpdateOptions(values, () => {});
    onClose();
  };

  const handleRemoveOption = (index: number) => {
    let clonedValues = [...values];
    clonedValues.splice(index, 1);
    setValues(clonedValues);
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      className="rounded-lg"
      maxWidth="xs"
      key={`property-dialog`}
      fullWidth={true}
    >
      <DialogContent className="max-h-[900px]">
        <div className="flex flex-col gap-y-5">
          <div className="flex items-center justify-between">
            <h1 className="mb-2 text-2xl font-bold text-gray-600">
              Quản lý các trường của danh mục
            </h1>
            <Tooltip onClick={onClose} title="Đóng">
              <XMarkIcon className="h-8 w-8 cursor-pointer rounded-full p-1 hover:bg-gray-200" />
            </Tooltip>
          </div>
          <div className="flex flex-col gap-y-5">
            {!!values && values?.length > 0 ? (
              <>
                <div
                  className="flex w-full items-center justify-between gap-x-5 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-lg"
                  key="header"
                >
                  <div className="w-1/2">
                    <p>Trường</p>
                  </div>
                  <div className="flex w-1/2 flex-row-reverse">
                    <p>Hành động</p>
                  </div>
                </div>
                {values?.map((item, index) => (
                  <div
                    className="flex w-full items-center justify-between gap-x-5 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-lg"
                    key={index.toString()}
                  >
                    <div className="w-1/2">
                      <input
                        className="rounded-lg border border-gray-300 py-1 pl-4"
                        defaultValue={item}
                        value={values?.[index]}
                        onChange={(text) => {
                          let clonedValues = values;
                          clonedValues[index] = text.target.value;
                          setValues([...clonedValues]);
                        }}
                      />
                    </div>
                    <div className="flex w-1/2 flex-row-reverse items-center">
                      <button
                        onClick={() => {
                          handleRemoveOption(index);
                        }}
                      >
                        <TrashIcon className="h-4 w-4 font-bold text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center">
                <InformationCircleIcon width={20} height={20} />
                <p className="ml-2">Không có giá trị nào để hiển thị</p>
              </div>
            )}
            <div className="flex w-full justify-center">
              <IconButton onClick={handleCreateNewOption}>
                <PlusCircleIcon className="h-6 w-6 text-gray-500" />
              </IconButton>
            </div>
          </div>

          <div className="mt-8 flex w-full justify-between">
            <div></div>
            <div className="flex gap-x-2">
              <Button variant="secondary" title="Đóng" onClick={() => onClose()} />
              <Button title="Cập nhật" onClick={() => handleConfirmUpdate()} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomFieldDialog;
