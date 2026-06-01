import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';
import Header from '../common/Header';
import { adminBtnPrimary } from '../common/adminUi';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();
    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Products" subtitle="Manage suits, shoes, wear, gadgets & more" />

      <div className="border-b-2 border-slate-100 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {allProduct.length} product{allProduct.length !== 1 ? 's' : ''} listed
          </p>
          <button type="button" className={adminBtnPrimary} onClick={() => setOpenUploadProduct(true)}>
            Upload Product
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-5">
          {allProduct.length > 0 ? (
            allProduct.map((product, index) => (
              <AdminProductCard
                data={product}
                key={product?._id || index}
                fetchdata={fetchAllProduct}
              />
            ))
          ) : (
            <div className="w-full border-2 border-dashed border-slate-100 py-20 text-center">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                No products available
              </p>
            </div>
          )}
        </div>
      </div>

      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
