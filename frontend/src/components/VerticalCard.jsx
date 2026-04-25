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
              <div className="p-4">
                <div className="mb-2 h-4 animate-pulse rounded bg-slate-200"></div>
                <div className="mb-4 h-4 w-3/4 animate-pulse rounded bg-slate-200"></div>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 animate-pulse bg-slate-100"></div>
                  <div className="h-10 w-10 animate-pulse bg-slate-100"></div>
                </div>
              </div>
            </div>
          ))
        : data.map((product) => <ProductGridCard key={product?._id} product={product} />)}
    </div>
  );
};



export default VerticalCard;
