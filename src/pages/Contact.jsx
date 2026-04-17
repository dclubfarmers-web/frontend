import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/api/contacts', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="contact-page">
      <section className="section" style={{ background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ position: 'relative' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'white' }}>Contact Us</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto' }}>
            We're here to help you grow. Whether you're a job seeker or an investor, our team is ready to assist.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '4rem' }}>
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Get in Touch</h2>
              <div className="card" style={{ marginBottom: '2rem' }}>
                {success ? (
                  <div className="p-10 text-center animate-scale-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">Thank you for reaching out. Our team will get back to you shortly.</p>
                    <button onClick={() => setSuccess(false)} className="btn btn-primary" style={{ display: 'inline-block' }}>Send Another Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="label">Your Name</label>
                      <input 
                        type="text" 
                        required
                        className="input" 
                        placeholder="e.g. John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="input" 
                        placeholder="e.g. john@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Subject</label>
                      <select 
                        className="input"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      >
                        <option>General Inquiry</option>
                        <option>Business Partnership</option>
                        <option>Careers</option>
                        <option>Investor Relations</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Message</label>
                      <textarea 
                        required
                        className="textarea" 
                        rows="4" 
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                    </div>
                    {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '1.25rem' }}
                    >
                      {loading ? 'Sending...' : 'Send Message'} <Send size={20} />
                    </button>
                  </form>
                )}
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: '#F0F9FF', border: 'none' }}>
                  <HelpCircle size={32} color="var(--primary)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
                  <h3>Support</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Help center & community.</p>
                </div>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: '#ECFDF5', border: 'none' }}>
                  <MessageCircle size={32} color="var(--secondary)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
                  <h3>Chat</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Live support (9am-6pm).</p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Contact Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '1rem' }}>
                    <Mail size={32} color="white" />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Email</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{settings.contactEmail}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We typically respond within 24 hours.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--secondary)', padding: '1rem', borderRadius: '1rem' }}>
                    <Phone size={32} color="white" />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Phone</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{settings.supportNumber}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mon-Sat | 10:00 AM to 6:00 PM IST.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '1rem' }}>
                    <MapPin size={32} color="white" />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Location</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{settings.address}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Headquarters & Operations Center.</p>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '3rem' }}>
                <iframe 
                  title="DJAIRINDIA Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497699.9973874144!2d77.35073573351911!3d12.953847725577607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1712760000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0, borderRadius: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
