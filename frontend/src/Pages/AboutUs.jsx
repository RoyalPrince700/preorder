import React from 'react';

const AboutUs = () => {
  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="page-kicker">Our Story</span>
        <h1 className="page-title">About Preordify</h1>
        <p className="page-subtitle">
          Pioneering a high-energy, marketplace-first approach to preorder campaigns and exclusive limited drops.
        </p>
      </header>

      <div className="page-grid">
        <div className="space-y-8">
          <section className="page-card">
            <h2 className="page-card-title">Our Mission</h2>
            <p className="page-copy">
              At Preordify, our mission is to redefine how exclusive products are launched and discovered. 
              We provide a high-octane, high-energy shopping experience from first drop to final checkout. 
              We are committed to empowering creators and brands with a platform built for speed, transparency, 
              and exclusive access for their most dedicated supporters.
            </p>
          </section>

          <section className="page-card-muted">
            <h2 className="page-card-title">The Marketplace Vibe</h2>
            <p className="page-copy">
              Preordify isn't just an e-commerce store; it's a launchpad for what's next. We curate 
              the most anticipated preorder drops across multiple categories, ensuring you're 
              always at the front of the line for the hottest releases.
            </p>
            <p className="mt-4 page-copy">
              Our platform is designed for the high-energy collector, the trend-setter, and the 
              early adopter who values being first. Every drop on Preordify is a limited-time 
              opportunity to secure a piece of the future.
            </p>
          </section>
        </div>

        <div className="space-y-8">
          <section className="page-card">
            <h2 className="page-card-title">What We Offer</h2>
            <ul className="page-list">
              <li className="page-list-item">
                <span className="page-list-bullet">1</span>
                <span>Exclusive access to limited-run preorder campaigns</span>
              </li>
              <li className="page-list-item">
                <span className="page-list-bullet">2</span>
                <span>Real-time drop tracking and campaign updates</span>
              </li>
              <li className="page-list-item">
                <span className="page-list-bullet">3</span>
                <span>Secure, high-speed checkout optimized for high-traffic launches</span>
              </li>
              <li className="page-list-item">
                <span className="page-list-bullet">4</span>
                <span>Direct-to-brand preorder fulfillment and buyer protection</span>
              </li>
              <li className="page-list-item">
                <span className="page-list-bullet">5</span>
                <span>A curated marketplace of the most innovative upcoming products</span>
              </li>
            </ul>
          </section>

          <section className="page-dark-card">
            <h2 className="page-card-title !text-white">Get In Touch</h2>
            <p className="mb-6 opacity-80 text-sm">Have questions about a drop or need help with a preorder? Our team is standing by.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="page-contact-label">Phone</span>
                <span className="text-sm font-bold">07019277357</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="page-contact-label">Email</span>
                <span className="text-sm font-bold">contact@preordify.com</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
