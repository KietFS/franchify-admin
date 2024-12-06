import { XMarkIcon } from '@heroicons/react/24/outline';
import { CloseSharp } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import React from 'react';

interface ICustomDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CustomDialog: React.FC<ICustomDialogProps> = (props) => {
  const { open, onClose, children, title, maxWidth = 'md' } = props;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      className="rounded-lg"
      maxWidth={maxWidth}
      fullWidth={true}
    >
      <DialogContent className="max-h-[1200px]">
        <div className="flex justify-between pb-6 pt-4">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">{title}</h1>
          <IconButton onClick={onClose}>
            <XMarkIcon className="h-8 w-8 text-gray-800" />
          </IconButton>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
