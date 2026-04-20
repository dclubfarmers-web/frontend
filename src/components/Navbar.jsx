import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, Rocket } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Careers', path: '/career' },
    { label: 'Investors Desk', path: '/investors' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <nav className="site-nav">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="DJAIRINDIA" style={{ height: '100px', objectFit: 'contain' }} />
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="cta-nav">
            <Link to="/contact" className="btn btn-primary">Join Now</Link>
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
           <Link to="/" onClick={() => setIsOpen(false)} className="mobile-logo">
             <img src="/logo.png" alt="DJAIRINDIA" style={{ height: '80px', objectFit: 'contain' }} />
           </Link>
           <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
             <X size={28} />
           </button>
        </div>
        <ul className="mobile-nav-links">
          {links.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: '2.5rem' }}>
            <Link to="/contact" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }} onClick={() => setIsOpen(false)}>Join Now</Link>
          </li>
        </ul>
        <div className="mobile-drawer-footer">
           <p>© 2026 DJAIRINDIA PVT LTD</p>
           <p style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>Premier Agriculture Solutions</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
