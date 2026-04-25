import React, { useEffect, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import VerticalCard from './VerticalCard';

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 my-12 relative max-w-7xl">
      <h2 className="py-6 text-xs font-black uppercase tracking-[0.3em] text-slate-950 border-t border-slate-100">{heading}</h2>
      <VerticalCard loading={loading} data={data.slice(0, 5)} />
    </div>
  );
};

export default CategoryWiseProductDisplay;
