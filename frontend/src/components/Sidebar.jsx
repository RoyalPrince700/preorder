import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdOutlineBarChart } from 'react-icons/md';
import { IoCartOutline, IoArrowBackOutline } from 'react-icons/io5';
import { TbCurrencyNaira } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { AiFillProduct } from 'react-icons/ai';
import { IoMdMenu } from 'react-icons/io';

const SIDEBAR_ITEMS = [
  { name: 'Overview', icon: MdOutlineBarChart, href: '/admin-overview/overview' },
  { name: 'Orders', icon: IoCartOutline, href: '/admin-overview/admin-order-page' },
  { name: 'Products', icon: AiFillProduct, href: '/admin-overview/all-products' },
  { name: 'Users', icon: CgProfile, href: '/admin-overview/user-page' },
  { name: 'Sales', icon: TbCurrencyNaira, href: '/admin-overview/sale-page' },
  { name: 'Back to Store', icon: IoArrowBackOutline, href: '/' },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r-2 border-slate-900 bg-slate-950 text-white transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
          {isSidebarOpen && (
            <div>
              <p className="text-lg font-black uppercase tracking-tighter">Wifmart</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-500">
                Admin
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-white/20 transition-colors hover:border-orange-500 hover:text-orange-500"
            aria-label="Toggle sidebar"
          >
            <IoMdMenu size={20} />
          </button>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {isSidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
