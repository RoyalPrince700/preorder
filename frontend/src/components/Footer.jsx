import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const shopLinks = [
    { label: 'All Products', href: '/product-category' },
    { label: 'Shipping & Delivery', href: '/shipping' },
  ];

  const companyLinks = [
    { label: 'About Wifmart', href: '/about-us' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Orders', href: '/order' },
  ];

  const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    // { label: 'Purchase Protection', href: '/purchase-protection' },
  ];

  return (
    <footer className="mt-14 border-t-4 border-slate-900 bg-slate-950 px-4 py-16 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.5fr,1fr,1fr,1fr]">
          <div>
            <span className="text-3xl font-black uppercase tracking-tighter text-white sm:text-4xl">Wifmart</span>
            <p className="mt-6 max-w-sm text-xs font-bold uppercase leading-6 tracking-widest text-slate-500">
              BE CONFIDENT. PERSONAL PREORDER STORE FOR FASHION, GADGETS, AND EVERYDAY ELECTRONICS.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a className="flex h-10 w-10 items-center justify-center rounded-none border-2 border-slate-800 text-slate-300 transition hover:border-orange-500 hover:text-white" href="https://x.com/Wifmartofficial?t=lrCWxgox2bR5yiHPktXWUw&s=09" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a className="flex h-10 w-10 items-center justify-center rounded-none border-2 border-slate-800 text-slate-300 transition hover:border-orange-500 hover:text-white" href="https://www.instagram.com/wifmartofficial?igsh=MTY5Mnh0c21hbGxlag==" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">Shop Drops</h3>
            <div className="mt-6 space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {shopLinks.map((link) => (
                <a key={link.label} href={link.href} className="block transition-colors hover:text-white hover:translate-x-1 duration-200">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">Company</h3>
            <div className="mt-6 space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {companyLinks.map((link) => (
                <Link key={link.label} to={link.href} className="block transition-colors hover:text-white hover:translate-x-1 duration-200">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">Policies</h3>
            <div className="mt-6 space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {policyLinks.map((link) => (
                <a key={link.label} href={link.href} className="block transition-colors hover:text-white hover:translate-x-1 duration-200">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t-2 border-slate-900 pt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Wifmart. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span className="text-orange-600">Secure Payments</span>
            <span className="h-3 w-px bg-slate-800"></span>
            <span className="text-orange-600">Fast Shipping</span>
            <span className="h-3 w-px bg-slate-800"></span>
            <span className="text-orange-600">Buyer Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
