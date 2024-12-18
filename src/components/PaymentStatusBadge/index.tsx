import React from 'react';

interface IPaymentStatusBadgeProps {
  status: any;
}

const PaymentStatusBadge: React.FC<IPaymentStatusBadgeProps> = (props) => {
  const { status } = props;
  return (
    <>
      {!status && (
        <p className="w-fit rounded-full bg-red-100 px-[8px] py-[2px] text-[10px] text-sm font-semibold text-red-800">
          Không có thông tin
        </p>
      )}
      {status == 'PENDING' && (
        <p className="w-fit rounded-full bg-yellow-100 px-[8px] py-[2px] text-[10px] text-sm font-semibold text-yellow-800">
          Đang đợi thanh toán
        </p>
      )}
      {status == 'COMPLETED' && (
        <p className="w-fit rounded-full bg-green-100 px-[8px] py-[2px] text-[10px] text-sm font-semibold text-green-800">
          Đã thanh toán
        </p>
      )}
      {status == 'OVERDUE' && (
        <p className="w-fit rounded-full bg-gray-100 px-[8px] py-[2px] text-[10px] text-sm font-semibold text-gray-800">
          Đã hết hạn thanh toán
        </p>
      )}
    </>
  );
};

export default PaymentStatusBadge;
