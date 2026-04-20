import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Rocket, TrendingUp, CheckCircle2, Star, Users, Globe, FileText, Search, Upload, Sliders, MapPin, ChevronRight } from 'lucide-react';
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
        <div className="hero-image-container" style={{ backgroundImage: 'url(/hero.jpeg)' }}></div>
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

      {/* Job Seeker Section */}
      <section className="section" style={{ background: '#EBF5FF', padding: '100px 0' }}>
        <div className="container">
            {/* Centered Job List Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              style={{ maxWidth: '900px', margin: '0 auto' }}
              className="w-full"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#1A3D24' }}>Search Agriculture Jobs</h2>
                <Link to="/career" style={{ color: '#1A3D24', fontWeight: '800' }}>View All →</Link>
              </div>

              {/* Search Bar */}
              <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Job title or keywords..."
                    className="w-full p-5 pl-14 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#1A3D24]"
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-5 bg-[#F0F9FF] text-[#034D75] border border-blue-100 font-bold rounded-2xl hover:bg-blue-100 transition-all">
                  <Sliders size={20} /> Filters
                </button>
              </div>

              {/* Job List Preview */}
              <div className="space-y-4">
                {loading ? (
                  <div className="py-10 text-center"><Loader /></div>
                ) : jobs.length > 0 ? (
                  jobs.map((job, i) => (
                    <div 
                      key={i} 
                      className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between group cursor-pointer"
                      onClick={() => navigate('/career')}
                    >
                      <div>
                        <h3 className="text-xl font-bold text-[#034D75] group-hover:text-[#023B59] mb-1">{job.title}</h3>
                        <div className="flex items-center gap-4 text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.job_type}</span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <span className="font-bold text-[#034D75] text-lg">{job.salary}</span>
                        <ChevronRight size={24} className="text-slate-300 group-hover:text-[#034D75] transition-all" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 italic py-10">No live positions currently. Check back later.</p>
                )}
              </div>
            </motion.div>
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
