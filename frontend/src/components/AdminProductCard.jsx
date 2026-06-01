import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import AdminDeleteProduct from './AdminDeleteProduct';
import displayNGNCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(false);

    return (
        <div className="group w-52 border-2 border-slate-100 bg-white p-4 transition-colors hover:border-orange-500">
            <div className="mb-3 flex h-36 w-full items-center justify-center border-2 border-slate-50 bg-slate-50 p-2">
                <img
                    src={data?.productImage[0] || '/placeholder-image.png'}
                    className="h-full w-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                    alt={data?.productName || "Product Image"}
                />
            </div>

            <h3 className="line-clamp-2 text-xs font-black uppercase tracking-widest text-slate-950 leading-tight">
                {data?.productName || "Unnamed Product"}
            </h3>

            {data?.category && (
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                    {data.category}
                </p>
            )}

            {data.sellingPrice > 0 && (
                <p className="mt-2 text-sm font-black tracking-tighter text-slate-950">
                    {displayNGNCurrency(data.sellingPrice)}
                </p>
            )}

            <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center border-2 border-slate-900 text-slate-950 transition-colors hover:bg-slate-950 hover:text-white"
                    onClick={() => setEditProduct(true)}
                    title="Edit Product"
                >
                    <MdModeEditOutline className="text-lg" />
                </button>
                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center border-2 border-red-600 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                    onClick={() => setDeleteProduct(true)}
                    title="Delete Product"
                >
                    <MdDelete className="text-lg" />
                </button>
            </div>

            {editProduct && (
                <AdminEditProduct
                    productData={data}
                    onClose={() => setEditProduct(false)}
                    fetchdata={fetchdata}
                />
            )}

            {deleteProduct && (
                <AdminDeleteProduct
                    productId={data?._id}
                    onClose={() => setDeleteProduct(false)}
                    fetchData={fetchdata}
                />
            )}
        </div>
    );
};

export default AdminProductCard;
