import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="policy-page" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: '4rem', maxWidth: '900px', margin: '0 auto' }}
        >
          <h1 style={{ marginBottom: '2rem', color: '#1A3D24' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last updated: April 10, 2026</p>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: '#1A3D24' }}>1. Introduction</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Welcome to DJAIRINDIA PVT LTD ("Company", "we", "our", "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at privacy@djairindia.com.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>2. Information We Collect</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>3. How We Use Your Information</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>4. Sharing Your Information</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
          </section>

          <section>
            <h2 style={{ marginBottom: '1rem' }}>5. Contact Us</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              If you have questions or comments about this notice, you may email us at support@djairindia.com or by post to our official address.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
