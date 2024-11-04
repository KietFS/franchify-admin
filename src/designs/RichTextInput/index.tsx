import { useField, useFormikContext } from 'formik';
import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, useEffect } from 'react';

interface IRichTextInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  name: string;
  className?: string;
  label?: string | null;
  subLabel?: string;
  disabled?: boolean;
  requigray?: boolean;
  placeholder?: string;
  hasEvent?: boolean;
  isBorder?: boolean;
  onClickEvent?: () => void;
  onChangeValue?: (value: string | number) => void;
  readonly onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const RichTextInput: React.FC<IRichTextInputProps> = (props) => {
  const {
    name,
    className,
    required,
    label = null,
    subLabel = '',
    hasEvent = false,
    onClickEvent,
    autoComplete = 'off',
    onChangeValue,
    isBorder = true,
    ...rest
  } = props;
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props.name);
  useEffect(() => {
    onChangeValue && onChangeValue(field.value || '');
  }, [field.value]);

  const isError: boolean = !!meta.touched && !!meta.error;

  const onValueChange = (phoneNumber: string) => {
    setFieldValue(name, phoneNumber);
  };

  return (
    <div className={`w-full rounded-sm ${isError ? 'text-gray-500' : 'text-neutral-300'}`}>
      <div className="flex items-center justify-between">
        <div className="flex">
          <p className="mb-1 mr-1 text-sm font-bold text-gray-600">{label}</p>
          {required && <p className="font-bold text-red-500">*</p>}
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
        className={`flex h-[100px] w-full items-center rounded-lg bg-gray-100 py-1 focus-within:bg-gray-50`}
      >
        <textarea
          placeholder="abcdefg@gmail.com"
          {...(rest as any)}
          {...field}
          multiline
          onChange={(e) => onValueChange(e.target.value)}
          className={`h-[100px] w-full rounded-lg border-transparent bg-gray-100 px-2 py-1 text-sm text-gray-700 outline-none outline-white ring-0 focus:border-transparent focus:bg-gray-50 focus:outline-transparent focus:ring-0`}
        />
      </div>
      {isError && <p className="mt-1 text-xs font-semibold text-red-500">{meta.error}</p>}
    </div>
  );
};

export default RichTextInput;
