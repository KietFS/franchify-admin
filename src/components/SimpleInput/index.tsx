import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from 'react';

//icons
import {
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  UserCircleIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

type IInputMode = 'email' | 'password' | 'confirmPassword' | 'text' | 'phoneNumber' | 'name';

interface ISimpleInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  name: string;
  className?: string;
  label?: string | null;
  isRequired?: boolean;
  hasEvent?: boolean;
  onClickEvent?: () => void;
  // use onChangeValue instead of onChange, since Formik will overwrite the onChange
  onChangeValue?: (value: string | number) => void;
  readonly onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  mode?: IInputMode;
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const SimpleInput: React.FC<ISimpleInputProps> = (props) => {
  const {
    name,
    className,
    isRequired,
    label = null,
    hasEvent = false,
    onClickEvent,
    onChangeValue,
    mode = 'text',
    placeholder,
    disabled = false,
    isError = false,
    errorMessage = 'Something went wrong',
  } = props;
  const [focus, setFocus] = useState<boolean>(false);

  const objectTypes = {
    email: {
      icon: <EnvelopeIcon width={20} height={20} color="gray" />,
      placeholder: 'johndoe@gmail.com',
    },
    name: {
      icon: <UserCircleIcon width={20} height={20} color="gray" />,
      placeholder: 'John Doe',
    },
    password: {
      icon: <LockClosedIcon width={20} height={20} color="gray" />,
      placeholder: '**********',
    },

    confirmPassword: {
      icon: <CheckBadgeIcon width={20} height={20} color="gray" />,
      placeholder: '**********',
    },
    phoneNumber: {
      icon: <PhoneIcon width={20} height={20} color="gray" />,
      placeholder: '+84 809 211 211',
    },
    text: {
      icon: <PencilSquareIcon width={20} height={20} color="gray" />,
      placeholder: 'Your text here',
    },
  };

  const handleOnBlur = () => {
    setFocus(false);
  };

  const handleOnFocus = () => {
    setFocus(true);
  };

  return (
    <div className={`w-full rounded-sm ${isError ? 'text-gray-500' : 'text-neutral-300'} `}>
      <div className="flex items-center justify-between">
        <div className="flex">
          <p className="mr-1 text-sm font-bold text-gray-700">{label}</p>
          {isRequired && <p className="font-bold text-gray-500">*</p>}
        </div>
        {hasEvent && (
          <div
            className="cursor-default text-base text-gray-500 duration-300 hover:text-gray-500"
            onClick={() => {
              onClickEvent && onClickEvent();
            }}
          >
            Change
          </div>
        )}
      </div>
      <div
        className={`mt-2 flex w-full border ${
          focus && !isError
            ? 'border-2 border-gray-500'
            : isError
              ? 'border-2 border-red-500'
              : 'border-gray-200'
        } items-center ${
          focus && !isError ? 'bg-gray-50' : isError ? 'bg-red-50' : 'bg-white'
        } h-10 rounded-lg px-2 py-1 ${className}`}
      >
        <div className="border-r border-gray-500 pr-2">
          <>{(objectTypes as any)?.[mode]?.icon}</>
        </div>
        <input
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder || (objectTypes as any)?.[mode]?.placeholder || ''}
          onBlur={handleOnBlur}
          type={mode === 'password' || mode == 'confirmPassword' ? 'password' : 'text'}
          onFocus={handleOnFocus}
          onChange={(e) => onChangeValue?.(e.target.value)}
          className={`px-2 py-1 ring-inset ring-transparent autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
            focus && !isError ? 'bg-gray-50' : isError ? 'bg-red-50' : 'bg-white'
          } h-8 w-80 rounded-lg border-transparent text-sm text-gray-700 outline-none ring-0 focus:border-transparent focus:outline-transparent focus:ring-0`}
        />
      </div>
      {isError && <p className="mt-1 text-xs font-semibold text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default SimpleInput;
