import React from 'react';

const Shipping = () => {
  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="page-kicker">Policy Center</span>
        <h1 className="page-title">Shipping & Delivery</h1>
        <p className="page-subtitle">
          Delivery guidance for Wifmart orders where shipping and delivery details are agreed directly between you and Wifmart before payment.
        </p>
      </header>

      <div className="page-grid">
        <section className="page-card">
          <h2 className="page-card-title">Delivery agreements</h2>
          <div className="space-y-4">
            <div className="page-soft-panel">
              <p className="font-semibold text-slate-900">Agreement-based timelines</p>
              <p className="mt-1 text-sm text-slate-600">
                Delivery timelines are agreed between you and Wifmart for each order, based on your location, product type, and courier availability.
                There is no fixed standard delivery window.
              </p>
            </div>
            <div className="page-soft-panel">
              <p className="font-semibold text-slate-900">WhatsApp coordination</p>
              <p className="mt-1 text-sm text-slate-600">
                Delivery details are usually confirmed via our official WhatsApp business line 08160881705 after you start checkout from the website.
              </p>
            </div>
            <div className="page-soft-panel">
              <p className="font-semibold text-slate-900">Changes and exceptions</p>
              <p className="mt-1 text-sm text-slate-600">
                If delivery circumstances change, Wifmart will communicate updated options with you so a new arrangement can be agreed before dispatch.
              </p>
            </div>
          </div>
        </section>

        <section className="page-card-muted">
          <h2 className="page-card-title">Shipping costs and coverage</h2>
          <p className="page-copy">
            Shipping rates and coverage are discussed and agreed with you before you pay. Fees can vary based on distance, package size, courier, and any
            special handling requests.
          </p>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="page-list-item">
              <span className="page-list-bullet">1</span>
              <span>Exact delivery fees are shared with you and agreed before you complete payment.</span>
            </div>
            <div className="page-list-item">
              <span className="page-list-bullet">2</span>
              <span>Fees may differ by city, distance, and courier service level.</span>
            </div>
            <div className="page-list-item">
              <span className="page-list-bullet">3</span>
              <span>International or special deliveries may be available on request and are agreed individually.</span>
            </div>
          </div>
        </section>
      </div>

      <section className="page-dark-card mt-6">
          <h2 className="text-2xl font-bold">Order tracking</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
            Wifmart keeps buyers informed with order status updates by WhatsApp, SMS, email, and any courier tracking links available for your order.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><span className="page-contact-label">Phone / WhatsApp:</span><div className="mt-2 text-white">08160881705</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><span className="page-contact-label">Email:</span><div className="mt-2 text-white">support@Wifmart.com</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><span className="page-contact-label">Hours:</span><div className="mt-2 text-white">Mon-Fri 9AM-6PM</div></div>
        </div>
      </section>

      <section className="page-card mt-6">
        <h2 className="page-card-title text-center">Important shipping notes</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="page-soft-panel text-center">
            <p className="text-2xl">📦</p>
            <h3 className="mt-3 font-semibold text-slate-900">Secure packaging</h3>
            <p className="mt-2 text-sm text-slate-600">Orders are packed to reduce damage during transit and preserve presentation.</p>
          </div>
          <div className="page-soft-panel text-center">
            <p className="text-2xl">🚚</p>
            <h3 className="mt-3 font-semibold text-slate-900">Reliable logistics</h3>
            <p className="mt-2 text-sm text-slate-600">We work with vetted delivery partners for consistent handoff and tracking.</p>
          </div>
          <div className="page-soft-panel text-center">
            <p className="text-2xl">📞</p>
            <h3 className="mt-3 font-semibold text-slate-900">Delivery support</h3>
            <p className="mt-2 text-sm text-slate-600">Support is available if you need help with delivery timing or tracking issues.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shipping;