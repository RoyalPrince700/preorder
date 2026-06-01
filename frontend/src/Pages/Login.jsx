import React, { useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import {
  FaShirt,
  FaShoePrints,
  FaMobileScreen,
  FaShieldHalved,
  FaTruckFast,
} from 'react-icons/fa6';
import Context from '../context';

const perks = [
  { icon: FaShirt, label: 'Suits, casual wear & everyday style' },
  { icon: FaShoePrints, label: 'Footwear for every occasion' },
  { icon: FaMobileScreen, label: 'Gadgets, tech & lifestyle picks' },
  { icon: FaTruckFast, label: 'Track orders from cart to delivery' },
  { icon: FaShieldHalved, label: 'Secure sign-in with Google' },
];

const Login = () => {
  const { signInWithGoogle } = useContext(Context);

  return (
    <section
      id="login"
      className="flex min-h-screen flex-col bg-white lg:flex-row"
    >
      {/* Brand panel */}
      <div className="relative flex flex-1 flex-col justify-between border-b-2 border-slate-900 bg-slate-950 px-6 py-10 text-white sm:px-10 lg:border-b-0 lg:border-r-2 lg:py-14">
        <div>
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black uppercase tracking-tighter sm:text-4xl">
              Wifmart
            </span>
            <span className="mt-3 block text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
              Suits · Shoes · Wear · Gadgets & more
            </span>
          </Link>
        </div>

        <div className="my-12 hidden max-w-md lg:block">
          <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Wifmart Store
          </span>
          <h1 className="mt-6 text-4xl font-black uppercase leading-none tracking-tighter xl:text-5xl">
            Dress sharp.
            <br />
            Shop smart.
          </h1>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest leading-relaxed text-slate-400">
            Your one-stop shop for men&apos;s suits, shoe wear, general fashion,
            gadgets, and everyday essentials — sign in with Google to save your
            cart and follow every order.
          </p>
          <ul className="mt-10 space-y-4">
            {perks.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-white/20 bg-white/5">
                  <Icon className="h-4 w-4 text-orange-500" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          &copy; {new Date().getFullYear()} Wifmart. All rights reserved.
        </p>
      </div>

      {/* Auth card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 border-b-2 border-slate-100 pb-8 lg:hidden">
            <span className="inline-flex items-center rounded-none bg-orange-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
              Sign In
            </span>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-tighter text-slate-950 sm:text-3xl">
              Welcome to Wifmart
            </h2>
          </div>

          <div className="border-2 border-slate-900 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="hidden lg:block">
              <span className="inline-flex items-center rounded-none bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                Sign In
              </span>
              <h2 className="mt-4 text-2xl font-black uppercase tracking-tighter text-slate-950 sm:text-3xl">
                Welcome to Wifmart
              </h2>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                Continue with your Google account
              </p>
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-widest leading-relaxed text-slate-500 lg:mt-8">
              Sign in to shop suits, footwear, apparel, gadgets, and more —
              with your basket, orders, and updates in one place.
            </p>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="mt-8 flex w-full items-center justify-center gap-3 border-2 border-slate-900 bg-white py-5 text-sm font-black uppercase tracking-[0.15em] text-slate-950 transition-colors hover:bg-slate-950 hover:text-white"
            >
              <FcGoogle className="h-6 w-6 shrink-0" />
              Continue with Google
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-slate-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Google only
                </span>
              </div>
            </div>

            <p className="text-center text-[10px] font-bold uppercase leading-relaxed tracking-widest text-slate-400">
              Email and password sign-in is disabled. Use Google to create or
              access your Wifmart account securely.
            </p>
          </div>

          <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
            New here?{' '}
            <Link
              to="/sign-up"
              className="text-slate-950 underline decoration-2 underline-offset-4 transition-colors hover:text-orange-600"
            >
              Create account
            </Link>
          </p>

          <Link
            to="/"
            className="mt-4 block text-center text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-orange-600"
          >
            &larr; Back to Wifmart store
          </Link>

          <ul className="mt-10 space-y-3 border-t-2 border-slate-100 pt-8 lg:hidden">
            {perks.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500"
              >
                <Icon className="h-4 w-4 shrink-0 text-orange-600" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Login;
