import React from 'react';

interface ILoadingSkeletonProps {}

const LoadingSkeleton: React.FC<ILoadingSkeletonProps> = (props) => {
  return (
    <>
      <div className="mt-10 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="mt-4 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="mt-4 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="mt-4 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="mt-4 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="mt-4 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="mt-4 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="mt-4 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="mt-4 h-[50px] w-full animate-pulse rounded-md bg-gray-200"></div>
    </>
  );
};

export default LoadingSkeleton;
