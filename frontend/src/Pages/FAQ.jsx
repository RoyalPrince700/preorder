import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqCategories = [
    {
      title: "Ordering & Payment",
      faqs: [
        {
          question: "How do I place an order?",
          answer: "Browse our collection, add items to your cart, and proceed to checkout. Checkout is via WhatsApp only — you will be redirected to message us so we can confirm your order details and next steps."
        },
        {
          question: "What payment methods do you accept?",
          answer: "Payment is agreed with the Wifmart team, mostly by bank transfer. After checkout on WhatsApp, send payment to 08160881705. Online payment on the website is disabled for now."
        },
        {
          question: "Is it safe to make payments on your website?",
          answer: "Website payment is currently disabled. You pay by the method agreed with our team (usually transfer) to 08160881705 after we confirm your order on WhatsApp."
        },
        {
          question: "Can I modify my order after placing it?",
          answer: "Yes, you can modify your order if the product has not been produced yet. Contact us on WhatsApp at 08160881705 as soon as possible."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      faqs: [
        {
          question: "How long does delivery take?",
          answer: "Delivery time varies depending on the product. Readymade items are usually faster; custom or made-to-order pieces take longer while we produce them. We will give you an expected timeline when we confirm your order."
        },
        {
          question: "Do you offer free shipping?",
          answer: "Free shipping is negotiable depending on the nature of the product, your location, and the order. We will discuss shipping fees with you before you pay."
        },
        {
          question: "Can I track my order?",
          answer: "Yes. Track your order on the Orders page in your account. You will also receive email updates whenever your order status changes."
        },
        {
          question: "What if my package is damaged during delivery?",
          answer: "Take photos of the damaged product and packaging, then contact us immediately on WhatsApp at 08160881705 or by email at contact@wifmart.com."
        }
      ]
    }
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="page-kicker">Support Center</span>
        <h1 className="page-title">Frequently Asked Questions</h1>
        <p className="page-subtitle">
          Quick answers about ordering, payments, shipping, and order issues on Wifmart.
        </p>
      </header>

      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="page-card">
            <h2 className="mb-6 border-b border-slate-200 pb-4 text-2xl font-bold text-slate-900">
              {category.title}
            </h2>

            <div className="space-y-4">
              {category.faqs.map((faq, faqIndex) => {
                const globalIndex = `${categoryIndex}-${faqIndex}`;
                return (
                  <div key={faqIndex} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <button
                      className="flex w-full items-center justify-between text-left font-semibold text-slate-900 transition-colors hover:text-amber-700 focus:outline-none"
                      onClick={() => toggleFaq(globalIndex)}
                    >
                      <span className="pr-4">{faq.question}</span>
                      <span className="flex-shrink-0 text-xl font-bold text-amber-600">
                        {activeIndex === globalIndex ? '−' : '+'}
                      </span>
                    </button>
                    {activeIndex === globalIndex && (
                      <div className="mt-4 rounded-xl bg-white p-4 text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="page-dark-card mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Still Have Questions?</h2>
        <p className="mb-6 text-center opacity-80">
          Can't find what you're looking for? Reach us by phone, email, or WhatsApp.
        </p>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950">
              <span className="font-bold text-xl">📞</span>
            </div>
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="opacity-80">08160881705</p>
            <p className="text-sm opacity-60">Mon-Fri 9AM-6PM</p>
          </div>
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950">
              <span className="font-bold text-xl">✉️</span>
            </div>
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p className="opacity-80">contact@wifmart.com</p>
            <p className="text-sm opacity-60">We reply as soon as we can</p>
          </div>
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950">
              <span className="font-bold text-xl">💬</span>
            </div>
            <h3 className="font-semibold mb-2">WhatsApp</h3>
            <p className="opacity-80">08160881705</p>
            <p className="text-sm opacity-60">Orders & checkout</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
