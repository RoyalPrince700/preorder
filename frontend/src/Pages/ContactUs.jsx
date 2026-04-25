import React from 'react';

const ContactUs = () => {
  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="page-kicker">Support</span>
        <h1 className="page-title">Contact Preordify</h1>
        <p className="page-subtitle">We'd love to hear from you! Send us a message and our team will get back to you within 24 hours.</p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="page-card !p-10 border-2 border-slate-900 shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <form className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full border-2 border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-orange-500 transition-colors"
                  placeholder="ENTER YOUR NAME"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full border-2 border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-orange-500 transition-colors"
                  placeholder="EMAIL@EXAMPLE.COM"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Message</label>
              <textarea
                id="message"
                rows="6"
                className="w-full border-2 border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-orange-500 transition-colors resize-none"
                placeholder="HOW CAN WE HELP YOU?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-950 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-orange-600 shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
            >
              SEND MESSAGE
            </button>
          </form>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 border-t-2 border-slate-50 pt-10 text-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Direct Call</p>
              <p className="text-lg font-black tracking-tight text-slate-950">07019277357</p>
            </div>
            <div className="hidden md:block h-8 w-px bg-slate-100"></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Support</p>
              <p className="text-lg font-black tracking-tight text-slate-950 uppercase">contact@preordify.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
