import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import { getAllLocalProducts, getLocalCategorySummaries, localProducts } from '../data/localProducts';

const countInCategory = (category) => localProducts.filter((p) => p.category === category).length;

const CategoryList = () => {
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
      aria-labelledby="shop-by-category-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2
              id="shop-by-category-heading"
              className="text-lg font-black uppercase tracking-tight text-slate-950 sm:text-2xl"
            >
              Shop by Category
            </h2>
            <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Swipe to explore drops</p>
          </div>
          <Link
            to="/product-category?all=true"
            className="hidden items-center gap-1 text-sm font-black text-orange-600 transition hover:text-orange-700 sm:inline-flex"
          >
            SEE ALL
            <FaArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div
          className="flex gap-4 overflow-x-auto pb-4 pt-0.5 scrollbar-none [scrollbar-width:none] snap-x snap-mandatory scroll-smooth sm:gap-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categoryRows.map((row) => (
            <Link
              key={row.key}
              to={row.href}
              className="group relative w-[140px] shrink-0 snap-start overflow-hidden rounded-none border-2 border-slate-100 bg-white transition-all duration-300 hover:border-orange-500 sm:w-[160px] md:w-[180px]"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-white">
                {row.image ? (
                  <img
                    src={row.image}
                    alt=""
                    className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-300 uppercase">
                    No image
                  </div>
                )}
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-3 text-center sm:p-4">
                <p className="truncate text-xs font-black uppercase tracking-wider text-slate-950 sm:text-sm">{row.name}</p>
                <div className="mt-1 inline-flex items-center gap-1 rounded-none bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-600">
                  {row.count} ITEMS
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
