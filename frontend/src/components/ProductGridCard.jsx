import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCartPlus } from 'react-icons/fa6';
import displayNARCurrency from '../helpers/displayCurrency';
import scrollTop from '../helpers/scrollTop';
import localAddToCart from '../helpers/localAddToCart';

const ProductGridCard = ({ product }) => {
  const statusRaw = product?.productStatus;
  const statusLabel =
    statusRaw && String(statusRaw).toLowerCase() !== 'preorder' ? statusRaw : '';

  const handleAddToCart = (e) => {
    localAddToCart(e, product);
  };

  return (
    <div className="group flex h-full min-w-0 flex-col overflow-hidden border-2 border-slate-100 bg-white transition-all duration-300 hover:border-orange-500">
      <Link
        to={`/product/${product?._id}`}
        onClick={scrollTop}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-white p-4">
            <img
              src={product?.productImage?.[0]}
              alt={product?.productName}
              className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute left-0 top-0 bg-slate-950 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
            QUICK VIEW
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-3 pb-0 pt-2 md:px-4">
          <p className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-orange-600">
            {product?.category}
          </p>
          <h3 className="mt-0.5 min-w-0 line-clamp-1 text-sm font-black uppercase tracking-tighter text-slate-950 sm:text-base">
            {product?.productName}
          </h3>

          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
            <div className="flex shrink-0 items-center gap-1 text-orange-500">
              <FaStar className="h-3 w-3" />
              <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{product?.rating || 4.5}</span>
            </div>
          </div>

          <div className="mt-1 flex min-w-0 flex-wrap items-end gap-2">
            <span className="text-base font-black tracking-tighter text-slate-950 sm:text-xl">
              {displayNARCurrency(product?.sellingPrice)}
            </span>
            {product?.price > product?.sellingPrice && (
              <span className="text-[11px] font-bold text-slate-400 line-through">
                {displayNARCurrency(product?.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-2 flex items-center justify-between px-3 pb-3 md:px-4 md:pb-4">
        <Link
          to={`/product/${product?._id}`}
          onClick={scrollTop}
          className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-950 hover:text-orange-600 hover:underline underline-offset-4"
        >
          VIEW DETAIL
        </Link>
        <button
          type="button"
          onClick={handleAddToCart}
          className="text-slate-950 transition-colors hover:text-orange-600"
          title="Add to Cart"
        >
          <FaCartPlus size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductGridCard;
