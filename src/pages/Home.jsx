import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Rocket, TrendingUp, CheckCircle2, Star, Users, Globe, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [jobsData, blogsData] = await Promise.all([
        api.get('/api/jobs'),
        api.get('/api/blogs')
      ]);
      setJobs(jobsData.slice(0, 4));
      setBlogs(blogsData.slice(0, 3));
    } catch (err) {
      console.error('Failed to sync public records:', err);
    }
    setLoading(false);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="section hero" style={{ 
        minHeight: 'calc(100vh - var(--nav-height))', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative', 
        overflow: 'hidden', 
        paddingTop: '60px',
        paddingBottom: '60px'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="hero-pill" style={{ display: 'inline-flex' }}>
              <Star size={16} fill="currentColor" />
              <span>India's #1 Agricultural Career Hub</span>
            </div>
            <h1 className="hero-title">
              Empowering the Next <br />
              <span style={{ 
                background: 'linear-gradient(to right, #22C55E, #16A34A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>Generation of Agriprenuers</span>
            </h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
              We're bridge the gap between agricultural talent, cutting-edge innovation, and global venture investment.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/career')} className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>Explore Careers <Briefcase size={20} /></button>
              <button onClick={() => navigate('/career')} className="btn btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', background: 'white' }}>Launch Startup <Rocket size={20} /></button>
            </div>

            
          </motion.div>
        </div>
        <div className="hero-image-container" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=100&w=2070")' }}></div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Ecosystem</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Everything you need to succeed in the modern agricultural landscape.</p>
          </div>
          <div className="grid grid-cols-3">
            {[
              { icon: <Briefcase size={40} color="var(--primary)" />, title: 'Jobs', desc: 'Find agriculture jobs easily. Tailored opportunities for every skill set.', link: '/career' },
              { icon: <Rocket size={40} color="#1A3D24" />, title: 'Startups', desc: 'Launch your agri business from scratch with expert guidance and DPR support.', link: '/career' },
              { icon: <TrendingUp size={40} color="#1A3D24" />, title: 'Investors', desc: 'Connect with funding from top agricultural venture capitalists and angel investors.', link: '/investors' }
            ].map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(f.link)}>
                <div style={{ marginBottom: '1.5rem', background: 'rgba(26, 61, 36, 0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {f.icon}
                </div>
                <h3 style={{ marginBottom: '1rem', color: '#1A3D24' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#1A3D24' }}>Latest Jobs</h2>
            <Link to="/career" style={{ color: '#1A3D24', fontWeight: '700' }}>View All Jobs →</Link>
          </div>
          <div className="grid grid-cols-2">
            {loading ? (
              <div className="col-span-2 text-center py-10"><Loader /></div>
            ) : jobs.length > 0 ? (
              jobs.map((job, i) => (
                <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                    <p style={{ fontWeight: '600', color: '#1A3D24' }}>{job.company}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>📍 {job.location} | 💼 {job.job_type}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{job.salary}</p>
                    <button onClick={() => navigate('/career')} className="btn btn-outline" style={{ padding: '0.5rem 1rem', color: '#1A3D24', borderColor: '#1A3D24' }}>Apply</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-slate-400 italic">No live positions currently. Check back later.</p>
            )}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#1A3D24' }}>Agri Insights</h2>
                <Link to="/blog" style={{ color: '#1A3D24', fontWeight: '700' }}>Read More →</Link>
            </div>
            <div className="grid grid-cols-3">
                {loading ? (
                    <div className="col-span-3 text-center py-10"><Loader/></div>
                ) : blogs.length > 0 ? (
                    blogs.map(blog => (
                        <div key={blog.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ height: '200px', background: '#F8FAFC' }}>
                                {blog.image_url ? (
                                    <img src={blog.image_url} className="w-full h-full object-cover" alt={blog.title}/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200"><FileText size={40}/></div>
                                )}
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', height: '3.3rem', overflow: 'hidden', color: '#1A3D24' }}>{blog.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', height: '2.5rem', overflow: 'hidden' }}>{blog.excerpt || 'Latest news from the agrarian sector...'}</p>
                                <button onClick={() => navigate('/blog')} className="text-[#1A3D24] font-bold text-xs uppercase tracking-widest flex items-center gap-2">Learn More →</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-slate-400 italic">Articles are currently being cultivated.</div>
                )}
            </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section" style={{ paddingBottom: '0' }}>
        <div className="container" style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', 
          borderRadius: '2rem 2rem 0 0', 
          padding: '5rem 2rem', 
          textAlign: 'center', 
          color: 'white' 
        }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'white' }}>Join the Agri Revolution</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto 3rem' }}>
            Whether you're looking for your next career move or launching the next big agritech startup, DJAIRINDIA PVT LTD is your home.
          </p>
          <button onClick={() => navigate('/contact')} className="btn btn-secondary" style={{ padding: '1.5rem 3rem', fontSize: '1.2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>Get Started Now</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
