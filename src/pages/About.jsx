import React from 'react';
import { Target, Eye } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  return (
    <div className="about-page">
      <section className="section" style={{ background: '#F8FAFC', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{settings.aboutHeroTitle}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto' }}>
            {settings.aboutHeroDescription}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Our Mission & Vision</h2>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: '#F2F8F4', padding: '1.5rem', borderRadius: '1rem', flex: 1 }}>
                  <Target size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                  <h3>Our Mission</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{settings.aboutMission}</p>
                </div>
                <div style={{ background: '#ECFDF5', padding: '1.5rem', borderRadius: '1rem', flex: 1 }}>
                  <Eye size={40} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                  <h3>Our Vision</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{settings.aboutVision}</p>
                </div>
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                {settings.aboutMainDescription}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <img 
                src="/images/mission.png"
                alt="Agriculture innovation"
                style={{ width: '90%', borderRadius: '2rem', boxShadow: '20px 20px 60px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {(settings.team && settings.team.length > 0) && (
        <section className="section" style={{ background: '#0F1E12', color: 'white' }}>
            <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>Our Team</h2>
                <p style={{ opacity: 0.8 }}>Meet the visionaries behind {settings.siteName}.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {settings.team.map((member, i) => (
                <div key={i} className="card" style={{ textAlign: 'center' }}>
                    <img src={member.img} alt={member.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem', border: '4px solid var(--primary-light)' }} />
                    <h3 style={{ marginBottom: '0.25rem' }}>{member.name}</h3>
                    <p style={{ fontWeight: '600', color: '#82A95F', marginBottom: '0.5rem' }}>{member.role}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{member.desc}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
      )}
    </div>
  );
};

export default About;
