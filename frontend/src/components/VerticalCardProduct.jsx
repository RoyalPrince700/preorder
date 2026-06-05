import React, { useEffect, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import fetchAllProducts from '../helpers/fetchAllProducts';
import ProductGridCard from './ProductGridCard';

const VerticalCardProduct = ({ category, heading, showHeading = true }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(10).fill(null);

  const fetchData = async () => {
    setLoading(true);
    let productData;
    if (category === "all") {
      productData = await fetchAllProducts();
    } else {
      productData = await fetchCategoryWiseProduct(category);
    }
    setLoading(false);
    setData(productData?.data);
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className={`w-full px-1.5 sm:px-10 lg:px-16 ${showHeading ? 'py-5 sm:py-10' : 'pb-5 pt-0 sm:pb-10 sm:pt-0'}`}>
      <section className="mx-auto max-w-7xl">
      {showHeading && (
        <div className="mb-10 text-center sm:mb-12 border-b-2 border-slate-100 pb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-950">
            {heading || "Trending Preorders"}
          </h2>
          <p className="mt-3 px-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-600 sm:px-0">
            Curated preorders from our live catalog
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
          {loadingList.map((_, index) => (
            <div key={index} className="overflow-hidden border-2 border-slate-100 bg-white">
              <div className="aspect-square animate-pulse bg-white"></div>
              <div className="p-3">
                <div className="mb-1 h-2.5 w-1/2 animate-pulse bg-slate-100"></div>
                <div className="mb-1.5 h-3.5 w-full animate-pulse bg-slate-50"></div>
                <div className="mb-1 h-2.5 w-1/3 animate-pulse bg-slate-100"></div>
                <div className="h-4 w-2/3 animate-pulse bg-slate-50"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
          {data?.map((product) => (
            <ProductGridCard key={product?._id} product={product} />
          ))}
        </div>
      )}
      </section>
    </div>
  );
};

export default VerticalCardProduct;
