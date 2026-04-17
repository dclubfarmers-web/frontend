import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="policy-page" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: '4rem', maxWidth: '900px', margin: '0 auto' }}
        >
          <h1 style={{ marginBottom: '2rem', color: '#1A3D24' }}>Terms of Service</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last updated: April 10, 2026</p>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>1. Agreement to Terms</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and DJAIRINDIA PVT LTD ("we", "us", or "our"), concerning your access to and use of our website.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>2. Intellectual Property Rights</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>3. User Representations</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete; you will maintain the accuracy of such information and promptly update such registration information as necessary.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>4. Prohibited Activities</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
          </section>

          <section>
            <h2 style={{ marginBottom: '1rem' }}>5. Limitation of Liability</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
