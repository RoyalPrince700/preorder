import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { GrSearch } from 'react-icons/gr';
import VerticalCard from '../components/VerticalCard';
import { searchLocalProducts, productCategoryOptions } from '../data/localProducts';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q')?.trim() || '';
  const [input, setInput] = useState(q);

  useEffect(() => {
    setInput(q);
  }, [q]);

  // Compute live results based on the current input
  const results = useMemo(() => searchLocalProducts(input), [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = input.trim();
    if (next) {
      setSearchParams({ q: next });
    } else {
      setSearchParams({});
    }
  };

  const hasInput = input.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      {/* Prominent Search Bar at Top */}
      <div className="mb-10">
        <form onSubmit={handleSubmit}>
          <div className="flex w-full items-center rounded-none border-2 border-slate-950 bg-white px-5 py-4 transition-all focus-within:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <GrSearch className="mr-4 shrink-0 text-slate-950 h-6 w-6" />
            <input
              type="search"
              name="q"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="SEARCH DROPS, BRANDS, COLLECTIONS..."
              className="w-full min-w-0 bg-transparent text-base font-black uppercase tracking-widest outline-none placeholder:text-slate-300"
              autoComplete="off"
              autoFocus
            />
            <button
              type="submit"
              className="ml-4 hidden text-xs font-black uppercase tracking-widest text-slate-950 hover:text-orange-600 sm:block"
            >
              SEARCH
            </button>
          </div>
        </form>
      </div>

      <div className="mb-12 border-b-2 border-slate-100 pb-8">
        <h1 className="text-xl font-black uppercase tracking-widest text-slate-950 sm:text-2xl leading-none">
          {hasInput ? "Search Results" : "Discovery"}
        </h1>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
          {hasInput ? `Browsing our preorder catalog for "${input}"` : "Explore curated drops and collections"}
        </p>
      </div>

      {!hasInput && (
        <div className="mb-12 border-2 border-slate-100 p-8 sm:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 mb-6">Explore Collections</p>
          <div className="flex flex-wrap gap-3">
            {productCategoryOptions.map((c) => (
              <Link
                key={c.value}
                to={`/product-category?category=${encodeURIComponent(c.value)}`}
                className="rounded-none border-2 border-slate-100 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-950 transition-all hover:border-orange-500 hover:text-orange-600"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasInput && (
        <section aria-live="polite">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between border-b-2 border-slate-100 pb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-950">
              Live Results for: <span className="text-orange-600">"{input}"</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {results.length} {results.length === 1 ? 'DROP' : 'DROPS'} FOUND
            </p>
          </div>

          {results.length === 0 ? (
            <div className="border-2 border-dashed border-slate-100 py-24 text-center">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No matching drops found</p>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-300">Try a different keyword or browse collections above</p>
            </div>
          ) : (
            <VerticalCard loading={false} data={results} />
          )}
        </section>
      )}

      {!hasInput && (
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Start typing to discover the latest preorders</p>
      )}
    </div>
  );
};

export default SearchPage;
