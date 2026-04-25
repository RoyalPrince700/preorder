import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";
import ROLE from "../common/role";
import Context from "../context";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdArrowDropdown } from "react-icons/io";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/product-category" },
  { label: "Support", to: "/support" },
];

const goSearch = (navigate, value) => {
  const v = value.trim();
  if (v) {
    navigate(`/search?q=${encodeURIComponent(v)}`);
  } else {
    navigate("/search");
  }
};

const Header = () => {
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [visible, setVisible] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const context = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const queryValue = new URLSearchParams(location.search).get("q") || "";
  const [search, setSearch] = useState(queryValue);
  const hideSearchBar = ["/login", "/signup", "/sign-up"].includes(location.pathname);

  const getCartCount = () => {
    return context?.cartProductCount || 0;
  };

  useEffect(() => {
    if (location.pathname === "/search") {
      setSearch(queryValue);
    } else {
      setSearch("");
    }
  }, [location.pathname, queryValue]);

  const handleScroll = () => {
    if (menuDisplay) {
      setMenuDisplay(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuDisplay]);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });
    const data = await fetchData.json();
    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    } else if (data.error) {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu") && menuDisplay) {
        setMenuDisplay(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuDisplay]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    goSearch(navigate, value);
  };

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-50 border-b-2 border-slate-100 bg-white/95 backdrop-blur'>
        <div className='relative mx-auto flex w-full max-w-7xl items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3 lg:px-8'>
        <Link to='/' className='shrink-0'>
          <div className='flex flex-col'>
            <span className='select-none text-xl font-black uppercase tracking-tighter text-slate-950 sm:text-3xl'>
              Preordify
            </span>
            <span className='hidden text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 sm:block'>
              Shop smarter, preorder sooner
            </span>
          </div>
        </Link>

        {!hideSearchBar && (
          <div className='hidden flex-1 items-center px-4 lg:flex'>
            <div className='flex w-full max-w-2xl items-center rounded-none border-2 border-slate-200 bg-slate-50 px-4 py-2.5 transition-colors focus-within:border-orange-500'>
              <GrSearch className='mr-3 text-slate-400' />
              <input
                type='text'
                placeholder='Search products, collections, and preorder drops'
                className='w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400'
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
        )}

        <nav className='hidden items-center gap-1 rounded-none border-x border-slate-100 px-2 xl:flex'>
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
                  isActive ? "text-orange-600 underline decoration-2 underline-offset-4" : "text-slate-600 hover:text-slate-950"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className='ml-auto flex shrink-0 items-center gap-2 sm:gap-5'>
          {!hideSearchBar && (
            <div 
              onClick={() => navigate("/search")}
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-none text-slate-700 transition hover:text-orange-600 lg:hidden'
            >
              <GrSearch className='h-5 w-5' />
            </div>
          )}

          <div className='group relative hidden sm:block'>
            {user ? (
              <>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className='h-9 w-9 cursor-pointer rounded-none border-2 border-slate-200 object-cover' />
                ) : (
                  <div className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-none border-2 border-slate-200 text-slate-700 transition hover:border-orange-500 hover:text-slate-950'>
                    <FaRegCircleUser className='h-5 w-5' />
                  </div>
                )}
                <div className='absolute right-0 hidden pt-4 group-hover:block'>
                  <div className='w-48 rounded-none border-2 border-slate-900 bg-white p-4 text-slate-500 shadow-2xl'>
                    <p className='mb-1 truncate text-xs font-black uppercase text-slate-950'>{user.fullName || user.email}</p>
                    <hr className='mb-3 border-slate-100' />
                    <p className='cursor-pointer text-xs font-bold uppercase transition hover:text-orange-600' onClick={() => navigate('/order')}>Orders</p>
                    <p className='mt-2 cursor-pointer text-xs font-bold uppercase transition hover:text-orange-600' onClick={handleLogout}>Logout</p>
                  </div>
                </div>
              </>
            ) : (
              <Link to='/login' className='flex h-9 w-9 items-center justify-center rounded-none border-2 border-slate-200 text-slate-700 transition hover:border-orange-500 hover:text-slate-950'>
                <FaRegCircleUser className='h-5 w-5' />
              </Link>
            )}
          </div>

          {user?.role === ROLE.ADMIN && (
            <button
              onClick={() => navigate('/admin-overview/overview')}
              className='hidden rounded-none border-2 border-slate-900 bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-slate-900 sm:block'
            >
              Admin
            </button>
          )}

          <Link to='/cart' className='relative hidden h-9 w-9 items-center justify-center rounded-none border-2 border-slate-200 text-slate-700 transition hover:border-orange-500 hover:text-slate-950 sm:flex'>
            <PiShoppingCartSimpleBold className='h-5 w-5' />
            <p className='absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-none bg-orange-600 px-1 text-[10px] font-black text-white'>
              {getCartCount()}
            </p>
          </Link>

          <Link
            to={user ? "/order" : "/login"}
            className='flex items-center justify-center text-slate-700 transition hover:text-slate-950 sm:hidden'
            aria-label={user ? "View profile" : "Log in"}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName || "Profile"} className='h-5 w-5 rounded-none object-cover border border-slate-200' />
            ) : (
              <FaRegCircleUser className='h-5 w-5' />
            )}
          </Link>

          <Link to='/cart' className='relative flex items-center justify-center text-slate-700 transition hover:text-slate-950 sm:hidden'>
            <PiShoppingCartSimpleBold className='h-5 w-5' />
            <p className='absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-none bg-orange-600 px-1 text-[9px] font-black text-white'>
              {getCartCount()}
            </p>
          </Link>

          {/* Mobile Hamburger Menu */}
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="flex h-8 w-8 items-center justify-center xl:hidden"
            aria-label="Open menu"
            aria-expanded={visible}
          >
            <GiHamburgerMenu className="h-6 w-6 cursor-pointer text-slate-900" />
          </button>
        </div>
      </div>
    </header>

      {/* Mobile menu: backdrop + slide-over panel (above header to avoid click/hover bugs) */}
      {visible && (
        <div
          className="fixed inset-0 z-[999] xl:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setVisible(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-[280px] flex-col overflow-y-auto border-l-2 border-slate-900 bg-white shadow-2xl">
            <div className="flex shrink-0 cursor-pointer items-center justify-between border-b-2 border-slate-900 p-5" onClick={() => setVisible(false)}>
              <p className="text-xs font-black uppercase tracking-widest text-slate-950">Menu</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase text-slate-500">Close</p>
                <IoMdArrowDropdown className="h-4 w-4 rotate-180" />
              </div>
            </div>

            <div className="border-b border-slate-100 px-6 py-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Explore</p>
              <div className="mt-6 space-y-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    onClick={() => setVisible(false)}
                    to={link.to}
                    className="block text-sm font-black uppercase tracking-widest text-slate-950 transition hover:text-orange-600"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setVisible(false);
                    navigate("/search");
                  }}
                  className="w-full text-left text-sm font-black uppercase tracking-widest text-slate-950 transition hover:text-orange-600"
                >
                  Search
                </button>
                <NavLink
                  onClick={() => setVisible(false)}
                  to="/cart"
                  className="flex items-center justify-between text-sm font-black uppercase tracking-widest text-slate-950 transition hover:text-orange-600"
                >
                  <span>Cart</span>
                  <span className="rounded-none bg-orange-600 px-2.5 py-1 text-[10px] font-black text-white">{getCartCount()}</span>
                </NavLink>
              </div>
            </div>

            {user ? (
              <>
                <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50 px-6 py-6">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="h-12 w-12 rounded-none border-2 border-white object-cover shadow-sm" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-none border-2 border-white bg-white text-slate-700 shadow-sm">
                      <FaRegCircleUser className="h-6 w-6" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="truncate text-xs font-black uppercase tracking-wider text-slate-950">{user.fullName || "User"}</p>
                    <p className="truncate text-[10px] font-bold text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setVisible(false);
                    navigate("/order");
                  }}
                  className="cursor-pointer border-b border-slate-100 px-6 py-4 text-xs font-black uppercase tracking-widest transition hover:bg-slate-50 hover:text-orange-600"
                >
                  My Orders
                </div>
              </>
            ) : (
              <Link onClick={() => setVisible(false)} to="/login" className="border-b border-slate-100 px-6 py-4 text-xs font-black uppercase tracking-widest transition hover:bg-slate-50 hover:text-orange-600">
                Login / Sign Up
              </Link>
            )}
            {user?.role === ROLE.ADMIN && (
              <NavLink
                onClick={() => setVisible(false)}
                className="border-b border-slate-100 px-6 py-4 text-xs font-black uppercase tracking-widest transition hover:bg-slate-50 hover:text-orange-600"
                to="/admin-overview/overview"
              >
                Admin Panel
              </NavLink>
            )}
            {user && (
              <div
                onClick={() => {
                  setVisible(false);
                  handleLogout();
                }}
                className="cursor-pointer px-6 py-4 text-xs font-black uppercase tracking-widest transition hover:bg-slate-50 hover:text-orange-600"
              >
                Logout
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;