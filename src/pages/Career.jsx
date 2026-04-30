import React, { useState, useEffect } from 'react';
// DJAIRINDIA - Career Ecosystem
import { motion } from 'framer-motion';
import { Search, Briefcase, ChevronRight, Compass, Users, Globe, Rocket, MapPin, FileText, Upload, Sliders } from 'lucide-react';
// Force Refresh: 1776458273452
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useFileUpload } from '../hooks/useFileUpload';

const Career = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabsRef = React.useRef(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('job-seeker'); // 'job-seeker' or 'dream-achiever'

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      // Give some time for the page to render then scroll
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.state]);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const { upload, uploading, fileUrl: dprFileUrl, setFileUrl: setDprFileUrl } = useFileUpload();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    resumeUrl: '',
    // DPR Specific
    projectTitle: '',
    investmentTarget: '',
    location: '',
    tenure: '',
    approxOutcome: ''
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const businessCategories = [
    {
      id: 'livestock',
      title: 'Livestock',
      icon: '🐄',
      color: 'bg-orange-50 text-orange-600 border-orange-100',
      subs: ['Dairy', 'Poultry', 'Goat', 'Sheep']
    },
    {
      id: 'aqua',
      title: 'Aqua',
      icon: '🐟',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      subs: ['Fish', 'Shrimp', 'Aquaponics']
    },
    {
      id: 'crop',
      title: 'Crop',
      icon: '🌾',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      subs: ['Field Crops', 'Horticulture']
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      icon: '🏭',
      color: 'bg-slate-50 text-slate-600 border-slate-100',
      subs: ['Food Processing', 'Dairy', 'Packaging']
    },
    {
      id: 'other',
      title: 'Other',
      icon: '✨',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      subs: ['Custom Project', 'Innovation', 'Not Listed']
    }
  ];

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

  const handleFileUpload = async (e, fieldPrefix = 'resume') => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { url, key } = await upload(file);
      if (fieldPrefix === 'resume') {
        setFormData(prev => ({ ...prev, resumeUrl: url, resumeKey: key }));
      } else {
        setFormData(prev => ({ ...prev, dprUrl: url, dprKey: key }));
      }
    } catch (err) {
      alert('File Upload Failed: ' + err.message);
    }
  };

  const handleSubmission = async (e, type) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (type === 'dream') {
        const dprJob = jobs.find(j => j.title === 'Dream Achiever Program');
        const investment = parseInt(formData.investmentTarget.replace(/[^0-9]/g, '')) || 0;
        const outcome = parseInt(formData.approxOutcome.replace(/[^0-9]/g, '')) || 0;
        const multiplier = investment > 0 ? (outcome / investment).toFixed(2) : 1.0;

        await api.post('/api/applications', {
          jobId: dprJob?._id || dprJob?.id || 'general',
          ...formData,
          tenure: formData.tenure,
          expected_profit: multiplier,
          investment_value: investment,
          expected_outcome: outcome
        });
      } else {
        await api.post('/api/applications', {
          jobId: 'general', // Backend handles 'general' as a fallback
          ...formData
        });
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ 
            fullName: '', email: '', phone: '', summary: '', resumeUrl: '', resumeKey: '',
            projectTitle: '', investmentTarget: '', timeline: '', category: '', subcategory: '', 
            location: '', dprUrl: '', dprKey: '', tenure: '', approxOutcome: ''
        });
      }, 5000);
    } catch (err) {
      alert('Submission Error: ' + err.message);
    }
    setSubmitting(false);
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
                  <div className="p-3 bg-green-50 text-[#1A3D24] rounded-2xl h-fit shadow-sm"><Globe size={24} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Global Vision, Local Impact</h4>
                    <p className="text-sm text-slate-500">Working on international-standard technology that solves specific Indian agrarian challenges.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl h-fit shadow-sm"><Users size={24} /></div>
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

      {/* Tabs Selection */}
      <section ref={tabsRef} style={{ background: '#F8FAFC', padding: '40px 0 0' }}>
        <div className="container">
          <div className="tabs-header shadow-2xl" style={{
            background: 'white',
            padding: '8px',
            borderRadius: '100px',
            display: 'flex',
            width: 'fit-content',
            margin: '0 auto',
            border: '1px solid #E2E8F0',
            position: 'relative',
            top: '-50px',
            zIndex: 10
          }}>
            <button
              onClick={() => setActiveTab('job-seeker')}
              style={{
                padding: '16px 32px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: activeTab === 'job-seeker' ? '#F8FAFC' : 'transparent',
                color: activeTab === 'job-seeker' ? '#1A3D24' : '#64748B',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                border: activeTab === 'job-seeker' ? '1px solid #E2E8F0' : '1px solid transparent'
              }}
            >
              <Briefcase size={20} /> Job Seeker
            </button>
            <button
              onClick={() => setActiveTab('dream-achiever')}
              style={{
                padding: '16px 32px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: activeTab === 'dream-achiever' ? '#F8FAFC' : 'transparent',
                color: activeTab === 'dream-achiever' ? '#1A3D24' : '#64748B',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                border: activeTab === 'dream-achiever' ? '1px solid #E2E8F0' : '1px solid transparent'
              }}
            >
              <Rocket size={20} /> Dream Achiever
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'job-seeker' ? (
          <motion.section
            key="job-seeker"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="section"
            style={{ background: '#EBF5FF', padding: '100px 0' }}
          >
            <div className="container">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left Column: Quick Resume Upload */}
                <div className="lg:col-span-5">
                  <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#034D75' }}>Quick Resume Upload</h2>
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                    <form onSubmit={(e) => handleSubmission(e, 'job')} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-[#034D75] mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#034D75] outline-none transition-all"
                          value={formData.fullName}
                          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#034D75] mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. john@example.com"
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#034D75] outline-none transition-all"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#034D75] mb-2">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 9876543210"
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#034D75] outline-none transition-all"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#034D75] mb-2">Resume (PDF)</label>
                        <div className="relative">
                          <input
                            type="file"
                            id="resume-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e)}
                            accept=".pdf"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-[#034D75] transition-all bg-slate-50 group"
                          >
                            <Upload size={32} className="text-slate-400 group-hover:text-[#034D75] mb-4" />
                            <span className="text-sm font-medium text-slate-500 group-hover:text-[#034D75]">
                              {uploading ? 'Uploading...' : formData.resumeUrl ? 'Resume Uploaded!' : 'Click or drag file to upload'}
                            </span>
                          </label>
                        </div>
                      </div>
                      <button
                        disabled={submitting || uploading}
                        className="w-full py-5 bg-[#034D75] hover:bg-[#023B59] text-white font-bold rounded-2xl transition-all shadow-lg text-lg"
                      >
                        {submitting ? 'Submitting...' : 'Submit My Profile'}
                      </button>
                      {success && <p className="text-center text-green-600 font-bold mt-4">Application Sent Successfully!</p>}
                    </form>
                  </div>
                </div>

                {/* Right Column: Search Agriculture Jobs */}
                <div className="lg:col-span-7">
                  <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1A3D24' }}>Search Agriculture Jobs</h2>

                  {/* Search & Filter Bar */}
                  <div className="flex gap-4 mb-8">
                    <div className="flex-1 relative">
                      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Job title or keywords..."
                        className="w-full p-5 pl-14 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#1A3D24]"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-5 bg-[#F0F9FF] text-[#034D75] border border-blue-100 font-bold rounded-2xl hover:bg-blue-100 transition-all">
                      <Sliders size={20} /> Filters
                    </button>
                  </div>

                  {/* Job List */}
                  <div className="space-y-4">
                    {loading ? (
                      <div className="py-20 text-center"><Loader /></div>
                    ) : filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <div
                          key={job.id}
                          className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between group cursor-pointer"
                          onClick={() => navigate(`/career/${job.id}`)}
                        >
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#034D75] group-hover:text-[#023B59] mb-1">{job.title}</h3>
                            <div className="flex items-center gap-4 text-slate-500 font-medium">
                              <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                              <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.job_type || 'Full-time'}</span>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <span className="font-bold text-[#034D75] text-lg">{job.salary || 'Competitive'}</span>
                            <ChevronRight size={24} className="text-slate-300 group-hover:text-[#034D75] transition-all" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <Briefcase size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-medium italic">No jobs found matching your search.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="dream-achiever"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="section"
            style={{ background: '#F8FAFC', padding: '60px 0 100px' }}
          >
            <div className="container">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-50 text-amber-700 rounded-full font-bold text-xs uppercase tracking-widest border border-amber-100 mb-6">
                  <Rocket size={14} /> Elite Incubation Program
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Launch Your Business</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">Select a category, share your vision, and get professional DPR support from the DJAIRINDIA ecosystem.</p>
              </div>

              {/* Top Area: Category Selection */}
              <div className="space-y-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {businessCategories.map((cat) => (
                    <motion.div
                      key={cat.id}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setFormData({ ...formData, category: cat.title, subcategory: '' });
                      }}
                      className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${selectedCategory?.id === cat.id ? 'border-[#1A3D24] bg-white shadow-xl' : 'border-transparent bg-white shadow-sm hover:shadow-md'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center text-2xl mb-3 border`}>
                        {cat.icon}
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">{cat.title}</h3>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight">Professional support for {cat.title}.</p>
                    </motion.div>
                  ))}
                </div>

                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap items-center gap-3"
                  >
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-4">Select Sub-Category:</h3>
                    {selectedCategory.subs.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setFormData({ ...formData, subcategory: sub })}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${formData.subcategory === sub ? 'bg-[#1A3D24] text-white border-[#1A3D24]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#1A3D24]'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Bottom Area: Wide & Short Form */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-2xl relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#1A3D24] opacity-[0.02] rounded-bl-full -mr-24 -mt-24"></div>

                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-1">DPR Ingested</h3>
                    <p className="text-xs text-slate-500">Vision for {formData.subcategory} transmitted to our strategic team.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmission(e, 'dream')} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Finalize DPR Application</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest italic">Precision Submission Engine</p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          disabled={submitting || uploading || !formData.subcategory}
                          className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-3 uppercase text-[10px] tracking-[0.2em] ${formData.subcategory ? 'bg-[#1A3D24] hover:bg-[#1A3D24]/90 text-white shadow-[#1A3D24]/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                          {submitting ? 'Sending...' : 'Transmit DPR'} <Rocket size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                      {/* Column 1: Industry & Vision */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Industry Category</label>
                          {formData.category === 'Other' ? (
                            <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-[#1A3D24] outline-none" placeholder="Specify Category" value={formData.subcategory === 'Not Listed' ? '' : formData.subcategory} onChange={e => setFormData({ ...formData, subcategory: e.target.value })} />
                          ) : (
                            <div className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-between">
                              <span>{formData.category || 'Select Above'} {formData.subcategory && `> ${formData.subcategory}`}</span>
                              {selectedCategory && <span className="text-lg">{selectedCategory.icon}</span>}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Project Title</label>
                          <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-bold" placeholder="e.g. Smart Dairy Farm" value={formData.projectTitle} onChange={e => setFormData({ ...formData, projectTitle: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Primary Location</label>
                          <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-medium" placeholder="e.g. Nashik, Maharashtra" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        </div>
                      </div>

                      {/* Column 2: Financial Projections */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Investment Target (₹)</label>
                          <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-bold" placeholder="e.g. 5,00,000" value={formData.investmentTarget} onChange={e => setFormData({ ...formData, investmentTarget: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Tenure (Months)</label>
                            <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-medium" placeholder="24" value={formData.tenure} onChange={e => setFormData({ ...formData, tenure: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Expected Outcome (₹)</label>
                            <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-medium" placeholder="e.g. 12,50,000" value={formData.approxOutcome} onChange={e => setFormData({ ...formData, approxOutcome: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Applicant Full Name</label>
                          <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-medium" placeholder="e.g. Rahul Sharma" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>
                      </div>

                      {/* Column 3: Identity & Documentation */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Email Address</label>
                            <input required type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-medium" placeholder="rahul@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Phone Number</label>
                            <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-medium" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Supporting Artifact (PDF)</label>
                          <div className="relative">
                            <input type="file" className="hidden" id="dpr-upload" onChange={(e) => handleFileUpload(e, 'dpr')} accept=".pdf,.doc,.docx" />
                            <label htmlFor="dpr-upload" className={`w-full p-4 flex items-center justify-between bg-white border-2 border-dashed ${formData.dprUrl ? 'border-[#1A3D24] bg-green-50' : 'border-slate-100'} rounded-2xl cursor-pointer hover:border-[#1A3D24] transition-all group`}>
                              <span className="text-[11px] text-slate-500 font-bold group-hover:text-[#1A3D24]">{uploading ? 'Processing...' : formData.dprUrl ? 'Document Attached' : 'Select Preliminary File'}</span>
                              <FileText className={formData.dprUrl ? 'text-[#1A3D24]' : 'text-slate-300'} size={18} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">Project Vision & Strategic Summary</label>
                      <textarea rows="3" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-1 focus:ring-[#1A3D24] text-xs font-medium resize-none leading-relaxed" placeholder="Describe the primary goals, target demographic, and innovation factor of your vision..." value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Culture Banner / Footer CTA */}
      <section className="section" style={{ background: '#0F1E12', color: 'white', padding: '80px 0' }}>
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Can't find the right fit?</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">We're always looking for ambitious talent. Send your details to our talent pool and we'll reach out when a suitable role opens up.</p>
          <button
            onClick={() => {
              setActiveTab('dream-achiever');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="btn btn-secondary"
            style={{ padding: '1.25rem 3rem', fontSize: '1rem' }}
          >
            Submit General Application
          </button>
        </div>
      </section>
    </div>
  );
};

export default Career;
