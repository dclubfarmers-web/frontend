import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Hash, Clock, BookOpen, FileText } from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const categories = ["All", "Farming Tips", "AgriTech", "Startups", "Government Schemes", "Market Trends"];

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const data = await api.get('/api/blogs');
            setBlogs(data);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
        }
        setLoading(false);
    };

    const filteredBlogs = blogs.filter(b => 
        (b.title.toLowerCase().includes(search.toLowerCase()) || 
        b.content.toLowerCase().includes(search.toLowerCase())) &&
        b.is_published
    );

    return (
        <div className="blog-page">
            <section className="section" style={{ background: '#F2F8F4', textAlign: 'center', padding: '100px 0' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: '#1A3D24' }}>Agri Insights</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Deep dives, industry news, and expert perspectives from the frontline of Indian agriculture.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
                        {categories.map((cat, i) => (
                            <button key={i} className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                                <Hash size={14} /> {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
                        {loading ? (
                            <div className="col-span-2 text-center py-20"><Loader /></div>
                        ) : filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog) => (
                                <div key={blog.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <div style={{ height: '300px', background: '#F8FAFC' }}>
                                        {blog.image_url ? (
                                            <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E2E8F0' }}>
                                                <FileText size={80} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '2.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', trackingWidest: '0.1em' }}>Article</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Clock size={16} /> {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', lineHeight: '1.3', color: '#0C4A6E' }}>{blog.title}</h2>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', lineClamp: '3', overflow: 'hidden' }}>
                                            {blog.excerpt || 'Read the full story to discover more about this development in the agritech sector.'}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ background: '#E2E8F0', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <BookOpen size={18} color="var(--primary)" />
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>DJAIRINDIA Editorial</span>
                                            </div>
                                            <button onClick={() => alert('Article reading feature coming soon!')} className="btn btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                                                Read Article <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-20 text-slate-400 font-medium italic">No published articles matching your search.</div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
