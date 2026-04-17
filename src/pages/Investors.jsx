import React from 'react';
import { TrendingUp, Users, Rocket, CreditCard, PieChart, Activity, ShieldCheck } from 'lucide-react';

const Investors = () => {
  return (
    <div className="investors-page">
      <section className="section" style={{ background: 'linear-gradient(135deg, #1A3D24, #0F1E12)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'white' }}>Investors Desk</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto 3rem' }}>
            Discover and fund the most innovative agri-startups in India. From smart dairy to vertical farming.
          </p>
          <div className="grid grid-cols-3" style={{ background: 'rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
            {[
              { label: 'Startups Supported', value: '100+' },
              { label: 'Funding Raised', value: '₹5Cr+' },
              { label: 'Registered Investors', value: '1.2K+' }
            ].map((s, i) => (
              <div key={i}>
                <p style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>{s.value}</p>
                <p style={{ opacity: 0.8, textTransform: 'uppercase', fontWeight: '600' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem' }}>Startups Seeking Funding</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline">Industry ▾</button>
              <button className="btn btn-outline">Funding Goal ▾</button>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            {[
              { name: 'RootWise', sector: 'Precision Agriculture', raised: '₹40L', target: '₹1Cr', img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800' },
              { name: 'GreensUp', sector: 'Vertical Farming', raised: '₹80L', target: '₹2.5Cr', img: 'https://images.unsplash.com/photo-1583155700949-0667e4368158?auto=format&fit=crop&q=80&w=800' },
              { name: 'CattleTrack', sector: 'Livestock IoT', raised: '₹15L', target: '₹50L', img: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=800' },
              { name: 'SeedSecure', sector: 'Bio-Technology', raised: '₹2.2Cr', target: '₹5Cr', img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800' },
              { name: 'HarvestHub', sector: 'Supply Chain', raised: '₹12L', target: '₹60L', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' },
              { name: 'AquaFlow', sector: 'Smart Irrigation', raised: '₹35L', target: '₹1.5Cr', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800' }
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={s.img} alt={s.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{s.name}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{s.sector}</p>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <span>Raised: <b>{s.raised}</b></span>
                      <span>Target: <b>{s.target}</b></span>
                    </div>
                    <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--primary)', width: `${(parseInt(s.raised.replace(/[^0-9.]/g, '')) / parseInt(s.target.replace(/[^0-9.]/g, ''))) * 100}%` }}></div>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }}>View Full Pitch</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '0', borderRadius: '2rem', textAlign: 'center', border: 'none', background: 'white', overflow: 'hidden' }}>
            <img src="/images/investors.png" alt="Investors meeting" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            <div style={{ padding: '3rem 1.5rem' }}>
              <ShieldCheck size={64} color="var(--primary)" style={{ marginBottom: '2rem', display: 'inline-block' }} />
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Become a Certified Investor</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3rem' }}>
                Gain access to exclusive agri-deals, market insights, and portfolio management tools. Join a community of over 1,200 successful investors.
              </p>
              <button className="btn btn-secondary" style={{ padding: '1.25rem 2.5rem', fontWeight: '800' }}>Register Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Investors;
