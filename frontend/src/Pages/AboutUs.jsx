import React from 'react';

const AboutUs = () => {
  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="page-kicker">Our Story</span>
        <h1 className="page-title">About Wifmart</h1>
        <p className="page-subtitle">
          Be Confident. Wifmart is my personal preorder store for fashion, gadgets, and everyday electronics — built for cleaner launches, faster discovery, and a smooth journey from browse to checkout.
        </p>
      </header>

      <div className="page-grid">
        <div className="space-y-8">
          <section className="page-card">
            <h2 className="page-card-title">Our Mission</h2>
            <p className="page-copy">
              At Wifmart, the mission is simple: help you shop confidently for the things you actually use and wear. 
              From sharp outfits to useful gadgets and home electronics, the store is designed to make browsing, ordering, 
              and checkout feel clear, modern, and stress-free.
            </p>
          </section>

          <section className="page-card-muted">
            <h2 className="page-card-title">The Wifmart Experience</h2>
            <p className="page-copy">
              Wifmart brings style and tech together in one personal storefront. You can find fashion, gadgets, and home 
              electronics in the same place, with a layout that makes it easy to move from category to category.
            </p>
            <p className="mt-4 page-copy">
              The preorder flow is focused on clarity: see what you’re buying, understand how it will be delivered, and complete 
              your order through a guided checkout that connects you directly with Wifmart on WhatsApp when it’s time to pay.
            </p>
          </section>
        </div>

        <div className="space-y-8">
          <section className="page-card">
            <h2 className="page-card-title">What We Offer</h2>
            <ul className="page-list">
              <li className="page-list-item">
                <span className="page-list-bullet">1</span>
                <span>Fashion & wears — suits, shirts, ties, kaftans, shoes, and more.</span>
              </li>
              <li className="page-list-item">
                <span className="page-list-bullet">2</span>
                <span>Gadgets — smart watches, power banks, tablets, and everyday tech accessories.</span>
              </li>
              <li className="page-list-item">
                <span className="page-list-bullet">3</span>
                <span>Electronics & home — blenders, kitchen appliances, and other everyday electronics.</span>
              </li>
              <li className="page-list-item">
                <span className="page-list-bullet">4</span>
                <span>Modern preorder storefront with product discovery, categories, search, and detailed product pages.</span>
              </li>
              <li className="page-list-item">
                <span className="page-list-bullet">5</span>
                <span>A smooth cart, checkout, and order history experience connected to the Wifmart backend.</span>
              </li>
            </ul>
          </section>

          <section className="page-dark-card">
            <h2 className="page-card-title !text-white">Get In Touch</h2>
            <p className="mb-6 opacity-80 text-sm">Have questions about a drop or need help with a preorder? Our team is standing by.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="page-contact-label">Phone</span>
                <span className="text-sm font-bold">08160881705</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="page-contact-label">Email</span>
                <span className="text-sm font-bold">contact@Wifmart.com</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
