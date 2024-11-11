import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import { XCircleIcon } from '@heroicons/react/20/solid';

interface IUploadImageProps {
  onSelect: (listImage: any[]) => void;
}

const UploadImage: React.FC<IUploadImageProps> = (props) => {
  const { onSelect } = props;
  const [baseImage, setBaseImage] = useState<any[]>([]);
  const [imgShow, setImgShow] = useState<any[]>([]);

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);

    onSelect([...baseImage, file]);
    setBaseImage([...baseImage, file]);
    setImgShow([...imgShow, base64]);
  };

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <div className="mt-1 w-full">
      <p className="mb-1 text-sm font-bold text-gray-600">Chọn thumbnail cho sản phẩm</p>
      <input
        value=""
        type="file"
        onChange={(e) => uploadImage(e)}
        className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-gray-100"
      />
      <div className="my-4 flex h-[210px] w-[210px] cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-300 p-1 shadow-lg hover:opacity-80">
        {imgShow.length !== 0 && (
          <Tooltip
            onClick={() => {
              setImgShow([]);
              setBaseImage([]);
            }}
            children={
              <XCircleIcon className="float-right mb-2 h-5 w-5 text-gray-400 hover:text-gray-800" />
            }
            title="Xóa"
          />
        )}

        {imgShow.length === 0 ? (
          <p className="mx-auto text-center text-lg font-bold text-gray-500">Vui lòng chọn ảnh</p>
        ) : (
          <img src={imgShow[0] as any} width={200} height={150} />
        )}
      </div>
    </div>
  );
};

export default UploadImage;
