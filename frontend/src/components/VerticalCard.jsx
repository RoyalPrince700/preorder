import React from 'react';
import ProductGridCard from './ProductGridCard';

const VerticalCard = ({ loading, data = [] }) => {
  const loadingList = new Array(10).fill(null);

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5">
      {loading
        ? loadingList.map((_, index) => (
            <div
              key={index}
              className="overflow-hidden border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-square animate-pulse bg-slate-200"></div>
              <div className="p-3">
                <div className="mb-1 h-2.5 w-1/2 animate-pulse rounded bg-slate-300"></div>
                <div className="mb-1.5 h-3.5 w-full animate-pulse rounded bg-slate-200"></div>
                <div className="mb-1 h-2.5 w-1/3 animate-pulse rounded bg-slate-300"></div>
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200"></div>
              </div>
            </div>
          ))
        : data.map((product) => <ProductGridCard key={product?._id} product={product} />)}
    </div>
  );
};



export default VerticalCard;
