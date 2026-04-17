import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer>
      <div className="container">
        <div className="grid grid-cols-4">
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ color: 'white', marginBottom: '1.5rem' }}>
              <img src="/logo.png" alt="DJAIRINDIA" style={{ height: '200px', objectFit: 'contain' }} />
            </Link>
            <p style={{ opacity: 0.8, marginTop: '1rem' }}>
              Empowering the next generation of agricultural innovators, jobs, and startups.
            </p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/career">Careers</Link></li>
              <li><Link to="/investors">Investors Desk</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3>Legal</h3>
            <ul>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3>Contact Us</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} /> {settings.contactEmail}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} /> {settings.supportNumber}
              </li>
            </ul>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4rem', paddingTop: '2rem', textAlign: 'center', opacity: 0.6 }}>
          <p>© 2026 DJAIRINDIA PVT LTD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
