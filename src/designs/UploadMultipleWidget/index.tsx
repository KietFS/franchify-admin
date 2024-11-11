import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface IUploadMultipleWidgetProps {
  thumbnailUploaded: string[];
  setThumbnailUploaded: (image: string[]) => void;
}

const UploadMultipleWidget: React.FC<IUploadMultipleWidgetProps> = (props) => {
  const cloudinaryRef = useRef() as any;
  const widgetRef = useRef() as any;
  const { thumbnailUploaded } = props;

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: 'dfnuzzpe3',
        uploadPreset: 'ml_default',
      },
      function (error: any, result: any) {
        if (result?.data?.event == 'queues-end') {
          props.setThumbnailUploaded(
            result?.data?.info?.files?.map((file: any) => file?.uploadInfo?.secure_url),
          );
          //   toast.success("Đăng các ảnh khác thành công");
        } else {
          //   toast.error("Đăng thumbnail thất bại");
        }
      },
    );
  }, [widgetRef]);

  return (
    <>
      <p className="text-md mr-1 font-bold text-gray-700">Upload các ảnh khác</p>
      <button
        className="rounded-lg border-gray-300 bg-gray-200 px-4 py-2 text-sm text-gray-600"
        onClick={() => widgetRef.current?.open()}
      >
        {props.thumbnailUploaded?.length > 0 ? 'Các ảnh' : 'Đăng các ảnh khác'}
      </button>

      <div className="flex w-full flex-wrap gap-x-2 gap-y-1">
        {props.thumbnailUploaded?.length > 0 &&
          props.thumbnailUploaded.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="thumbnail"
              className="h-20 w-20 rounded-lg object-cover"
            />
          ))}
      </div>
    </>
  );
};

export default UploadMultipleWidget;
