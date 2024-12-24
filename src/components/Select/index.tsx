import { MenuItem, Select } from '@mui/material';
import React, { ReactNode, useRef } from 'react';

interface ISelectProps<T = any> {
  name: string;
  label: string;
  placeholder: string;
  options: T[];
  optionSelected: T;
  disabled?: boolean;
  onSelect: (option: T) => void;
  keyValue?: string;
  keyLabel?: string;
  renderOption?: (item: T[]) => ReactNode;
  error?: string;
}

const SelectComponent: React.FC<ISelectProps> = (props) => {
  const ref = useRef();
  const {
    name,
    label,
    placeholder = '',
    options,
    optionSelected,
    disabled = false,
    keyValue = 'id',
    keyLabel = 'name',
    onSelect,
    renderOption,
    error = '',
  } = props;

  return (
    <div className="flex flex-col gap-y-1">
      <p className="mb-1 mr-1 text-sm font-bold text-gray-600">{label}</p>
      <Select
        ref={ref}
        className="border border-gray-300"
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        value={optionSelected}
        style={{
          width: '100%',
          height: 40,
          background: 'white',
          borderRadius: 7,
          maxHeight: 100,
        }}
        aria-placeholder={placeholder}
        renderValue={(value) => (
          <div className="flex h-full items-center">
            <p className="items-center text-sm text-gray-900">{optionSelected[keyLabel]}</p>
          </div>
        )}
        sx={{
          boxShadow: 'none',
          '.MuiOutlinedInput-notchedOutline': { border: 0 },
        }}
      >
        {renderOption
          ? renderOption(options)
          : options.map((option, index) => (
              <MenuItem
                value={option[keyValue]}
                onClick={() => onSelect(option)}
                key={index.toString()}
              >
                {option[keyLabel]}
              </MenuItem>
            ))}
      </Select>
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default SelectComponent;
