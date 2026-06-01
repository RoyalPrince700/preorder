import React from 'react';

const StatCard = ({ name, icon: Icon, value }) => {
  return (
    <div className="border-2 border-slate-100 bg-white p-5 transition-colors hover:border-orange-500">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
        <Icon size={16} className="text-orange-600" />
        {name}
      </div>
      <p className="mt-3 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
