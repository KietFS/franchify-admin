import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface IUploadWidgetProps {
  thumbnailUploaded: string;
  setThumbnailUploaded: (image: string) => void;
}

const UploadWidget: React.FC<IUploadWidgetProps> = (props) => {
  const cloudinaryRef = useRef() as any;
  const widgetRef = useRef() as any;

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: 'dfnuzzpe3',
        uploadPreset: 'ml_default',
      },
      function (error: any, result: any) {
        if (result.event == 'success') {
          props.setThumbnailUploaded(result?.info?.secure_url);
          //   toast.success("Đăng thumbnail thành công");
        } else {
          //   toast.error("Đăng thumbnail thất bại");
        }
      },
    );
  }, []);

  return (
    <>
      <p className="text-md mr-1 font-bold text-gray-700">Upload ảnh</p>
      <button
        className="mt-2 flex flex-wrap rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600"
        onClick={() => widgetRef.current?.open()}
      >
        {!!props.thumbnailUploaded ? props.thumbnailUploaded : 'Đăng thumbnail'}
      </button>
      {props.thumbnailUploaded && (
        <img
          src={props.thumbnailUploaded}
          alt="thumbnail"
          className="h-20 w-20 rounded-lg object-cover"
        />
      )}
    </>
  );
};

export default UploadWidget;
