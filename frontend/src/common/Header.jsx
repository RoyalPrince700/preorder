import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <header className="border-b-2 border-slate-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
          Wifmart Admin
        </span>
        <h1 className="mt-4 text-2xl font-black uppercase tracking-tighter text-slate-950 sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
