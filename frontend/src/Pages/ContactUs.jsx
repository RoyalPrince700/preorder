import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(SummaryApi.contactUs.url, {
        method: SummaryApi.contactUs.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error(result.message || 'Failed to send message.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="page-kicker">Support</span>
        <h1 className="page-title">Contact Wifmart</h1>
        <p className="page-subtitle">We'd love to hear from you! Send us a message and our team will get back to you within 24 hours.</p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="page-card !p-10 border-2 border-slate-900 shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-orange-500 transition-colors"
                  placeholder="ENTER YOUR NAME"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  required
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
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-100 bg-slate-50 p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-orange-500 transition-colors resize-none"
                placeholder="HOW CAN WE HELP YOU?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-950 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-orange-600 shadow-[0_12px_28px_rgba(0,0,0,0.15)] disabled:opacity-50"
            >
              {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 border-t-2 border-slate-50 pt-10 text-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Direct Call</p>
              <p className="text-lg font-black tracking-tight text-slate-950">08160881705</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Official WhatsApp checkout line (account details are only shared from this number)
              </p>
            </div>
            <div className="hidden md:block h-8 w-px bg-slate-100"></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Support</p>
              <p className="text-lg font-black tracking-tight text-slate-950 uppercase">contact@Wifmart.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
