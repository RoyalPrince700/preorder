import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchHotDealWise from '../helpers/fetchHotDealWise';
import displayNARCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const VerticalHotDealCard = ({ hotDeal, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);

  const scrollElement = useRef();

  const fetchData = async () => {
    setLoading(true);
    const hotDealProduct = await fetchHotDealWise(hotDeal);
    setLoading(false);
    setData(hotDealProduct?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };

  return (
    <div className="mx-auto px-4 my-12 relative max-w-7xl">
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-950 mb-6 border-b-2 border-slate-950 pb-2 inline-block">
        {heading || "Hot Drops"}
      </h2>

      <div className="relative group/scroll">
        {/* Scroll Buttons - Sharp Corners */}
        <button
          className="bg-slate-950 text-white p-3 absolute left-0 top-1/2 transform -translate-y-1/2 hidden md:block z-10 hover:bg-orange-600 transition-colors"
          onClick={scrollLeft}
        >
          <FaAngleLeft className="h-5 w-5" />
        </button>
        <button
          className="bg-slate-950 text-white p-3 absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:block z-10 hover:bg-orange-600 transition-colors"
          onClick={scrollRight}
        >
          <FaAngleRight className="h-5 w-5" />
        </button>

        {/* Card List */}
        <div
          className="flex items-center gap-4 overflow-x-scroll scrollbar-none snap-x snap-mandatory"
          ref={scrollElement}
        >
          {/* Loading Skeleton */}
          {loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className="min-w-[200px] max-w-[200px] bg-white border-2 border-slate-100 h-[280px] flex flex-col"
                >
                  <div className="bg-slate-50 h-[180px] animate-pulse"></div>
                  <div className="p-4 flex-1">
                    <div className="h-4 bg-slate-100 animate-pulse mb-2"></div>
                    <div className="h-4 bg-slate-100 animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))
            : data.map((product, index) => (
                <Link
                  to={'/product/' + product?._id}
                  key={index}
                  className="min-w-[160px] sm:min-w-[180px] md:min-w-[220px] max-w-[220px] bg-white border-2 border-slate-100 hover:border-orange-500 transition-all flex flex-col snap-start group"
                >
                  {/* Product Image */}
                  <div className="bg-white h-[160px] sm:h-[200px] flex justify-center items-center relative overflow-hidden p-4">
                    <img
                      src={product?.productImage[0]}
                      alt={product?.productName}
                      className="object-contain h-full transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-950 truncate">
                      {product?.productName}
                    </p>
                    <div className="flex flex-col mt-2">
                      {product?.price > product?.sellingPrice && (
                        <p className="text-[10px] font-bold text-slate-400 line-through">
                          {displayNARCurrency(product?.price)}
                        </p>
                      )}
                      <p className="text-base font-black tracking-tighter text-orange-600">
                        {displayNARCurrency(product?.sellingPrice)}
                      </p>
                    </div>
                    <div className="mt-3 bg-slate-950 text-white py-2 text-[10px] font-black uppercase tracking-widest text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Quick Drop
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalHotDealCard;
