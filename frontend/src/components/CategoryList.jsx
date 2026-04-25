import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllLocalProducts, getLocalCategorySummaries, localProducts } from '../data/localProducts';

const countInCategory = (category) => localProducts.filter((p) => p.category === category).length;

const CategoryList = ({ activeCategory, onCategoryClick }) => {
  const categoryRows = useMemo(() => {
    const allProducts = getAllLocalProducts();
    const featured = allProducts[0];
    const summaries = getLocalCategorySummaries();
    return [
      {
        key: 'all',
        name: 'All',
        href: '/product-category?all=true',
        image: featured?.productImage?.[0],
        count: allProducts.length,
      },
      ...summaries.map((s) => ({
        key: s.category,
        name: s.label,
        href: `/product-category?category=${s.category}`,
        image: s.productImage?.[0],
        count: countInCategory(s.category),
      })),
    ];
  }, []);

  return (
    <section
      className="w-full px-3 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="flex flex-nowrap gap-3 overflow-x-auto pb-2 pt-2 scrollbar-none [scrollbar-width:none]"
        >
          {categoryRows.map((row) => {
            const isActive = activeCategory === row.key;
            
            const content = (
              <>
                <span className={`text-xs font-black uppercase tracking-widest transition-colors sm:text-sm ${
                  isActive ? 'text-slate-950' : 'text-slate-950 group-hover:text-white'
                }`}>
                  {row.name}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black transition-colors ${
                  isActive 
                    ? 'bg-slate-950 text-orange-500' 
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-800 group-hover:text-orange-500'
                }`}>
                  {row.count}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-slate-950" />
                )}
              </>
            );

            if (onCategoryClick) {
              return (
                <button
                  key={row.key}
                  onClick={() => onCategoryClick(row.key)}
                  className={`group relative flex shrink-0 items-center gap-2 rounded-full border-2 px-5 py-2.5 transition-all duration-300 ${
                    isActive 
                      ? 'border-slate-950 bg-white' 
                      : 'border-slate-100 bg-white hover:border-slate-950 hover:bg-slate-950'
                  }`}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={row.key}
                to={row.href}
                className={`group relative flex shrink-0 items-center gap-2 rounded-full border-2 px-5 py-2.5 transition-all duration-300 ${
                  isActive 
                    ? 'border-slate-950 bg-white' 
                    : 'border-slate-100 bg-white hover:border-slate-950 hover:bg-slate-950'
                }`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
