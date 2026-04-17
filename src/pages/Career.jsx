import React, { useState, useEffect } from 'react';
// DJAIRINDIA - Career Ecosystem
import { motion } from 'framer-motion';
import { Search, Briefcase, ChevronRight, Compass, Users, Globe, Rocket, MapPin } from 'lucide-react';
// Force Refresh: 1776458273452
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';

const Career = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.get('/api/jobs');
      setJobs(data);
    } catch (err) { console.error('Failed to fetch job board:', err); }
    setLoading(false);
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="career-page">
      {/* Hero Header */}
      <section className="section" style={{ background: '#1A3D24', color: 'white', padding: '140px 0 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hero-pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex' }}>
              <Compass size={16} />
              <span>DJAIRINDIA Careers</span>
            </div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'white' }}>Build the Future of Agriculture</h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
                Join a mission-driven team dedicated to empowering agriprenuers and revolutionizing the food supply chain across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="section" style={{ background: 'white', padding: '100px 0' }}>
        <div className="container">
            <div className="grid grid-cols-2" style={{ gap: '6rem', alignItems: 'center' }}>
                <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold mb-6 text-slate-800">Life at DJAIRINDIA</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                        We believe in radical ownership and ground-level innovation. At DJAIRINDIA, you're not just an employee; you're a builder of systems that directly impact the livelihoods of thousands of farmers and entrepreneurs.
                    </p>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="p-3 bg-green-50 text-[#1A3D24] rounded-2xl h-fit shadow-sm"><Globe size={24}/></div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">Global Vision, Local Impact</h4>
                                <p className="text-sm text-slate-500">Working on international-standard technology that solves specific Indian agrarian challenges.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl h-fit shadow-sm"><Users size={24}/></div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">Collaborative Ecosystem</h4>
                                <p className="text-sm text-slate-500">Collaborate with agronomists, tech-architects, and venture capitalists in one fluid environment.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div style={{ borderRadius: '3rem', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.2)' }}>
                        <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" alt="Culture" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="absolute -bottom-10 -right-10 bg-[#1A3D24] p-10 rounded-3xl text-white shadow-2xl hidden md:block">
                        <Rocket size={40} className="mb-4" />
                        <p className="text-2xl font-black">100%</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Remote friendly</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Jobs Board Section */}
      <section className="section" style={{ background: '#F8FAFC', padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#1A3D24' }}>Open Positions</h2>
            <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                    type="text" 
                    className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-1 focus:ring-[#1A3D24] transition-all" 
                    placeholder="Search by role or location..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20"><Loader /></div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div 
                    key={job.id} 
                    className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#1A3D24] transition-all group flex flex-col cursor-pointer"
                    onClick={() => navigate(`/career/${job.id}`)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-green-50 text-[#1A3D24] rounded-full text-[10px] font-black uppercase tracking-widest">{job.job_type || 'Full Time'}</span>
                    <button className="text-slate-200 group-hover:text-[#1A3D24] transition-all"><ChevronRight size={24} /></button>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#1A3D24]">{job.title}</h3>
                  <p className="text-sm font-bold text-slate-500 mb-6 flex-1 italic">{job.company}</p>
                  
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                        <MapPin size={14} /> {job.location}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{job.salary || 'Competitive'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 italic text-lg font-medium">Currently no open positions match your search. Try another keyword.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Culture Banner */}
      <section className="section" style={{ background: '#0F1E12', color: 'white', padding: '80px 0' }}>
          <div className="container text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">Can't find the right fit?</h2>
              <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">We're always looking for ambitious talent. Send your details to our talent pool and we'll reach out when a suitable role opens up.</p>
              <button onClick={() => navigate('/contact')} className="btn btn-secondary" style={{ padding: '1.25rem 3rem', fontSize: '1rem' }}>General Application</button>
          </div>
      </section>
    </div>
  );
};

export default Career;
