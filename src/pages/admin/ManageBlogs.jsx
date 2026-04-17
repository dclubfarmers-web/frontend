import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Search, Edit, Trash2, FileText, X, Save } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const BlogModal = ({ blog, onClose, onSave }) => {
  const [formData, setFormData] = useState(blog || {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    is_published: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const autoGenerateSlug = (title) => {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    setFormData({ ...formData, title, slug });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">{blog ? 'Edit Article' : 'New Article'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
              <input 
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0369A1] outline-none font-semibold text-slate-800"
                value={formData.title} 
                onChange={e => autoGenerateSlug(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Content</label>
              <textarea 
                required
                rows="12"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0369A1] outline-none resize-none text-sm text-slate-700"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <ImageUpload 
                label="Cover Image" 
                value={formData.image_url} 
                onChange={url => setFormData({...formData, image_url: url})} 
             />

             <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Slug</label>
              <input 
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0369A1] outline-none text-xs font-mono text-[#0369A1]"
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})}
              />
            </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Summary (Excerpt)</label>
            <textarea 
              rows="3"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0369A1] outline-none text-sm resize-none"
              value={formData.excerpt} 
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F0F9FF] rounded-lg border border-blue-100">
             <span className="text-xs font-bold text-[#0369A1] uppercase">Publish Status</span>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0369A1]"></div>
             </label>
          </div>
          </div>

          <button type="submit" className="w-full bg-[#0369A1] hover:bg-[#0C4A6E] text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2">
            <Save size={18}/> {blog ? 'Update Article' : 'Publish Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/api/blogs');
      if (data) setBlogs(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSave = async (formData) => {
    try {
      if (editingBlog) {
        await api.put(`/api/blogs/${editingBlog.id}`, formData);
        setBlogs(blogs.map(b => b.id === editingBlog.id ? { ...b, ...formData } : b));
      } else {
        const data = await api.post('/api/blogs', formData);
        setBlogs([data, ...blogs]);
      }
    } catch (err) { alert(err.message); }
    setModalOpen(false);
    setEditingBlog(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await api.delete(`/api/blogs/${id}`);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search titles..." 
             className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#0369A1]"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <button 
          onClick={() => { setEditingBlog(null); setModalOpen(true); }}
          className="bg-[#0369A1] hover:bg-[#0C4A6E] text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center"><div className="w-8 h-8 border-2 border-[#0369A1]/20 border-t-[#0369A1] rounded-full animate-spin mx-auto"></div></div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full py-10 text-center text-slate-400">No articles found.</div>
        ) : (
          blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).map((blog) => (
            <div key={blog.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-[#0369A1] transition-all">
               <div className="h-40 bg-slate-50 relative">
                {blog.image_url ? (
                  <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200"><FileText size={40} /></div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    blog.is_published ? 'bg-green-600 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {blog.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 line-clamp-2 text-sm mb-2">{blog.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 flex-1 mb-4">{blog.excerpt || '...'}</p>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                   <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(blog.updated_at).toLocaleDateString()}</span>
                   <div className="flex gap-1">
                      <button onClick={() => { setEditingBlog(blog); setModalOpen(true); }} className="p-2 text-[#0369A1] hover:bg-blue-50 rounded-lg transition-all"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && <BlogModal blog={editingBlog} onClose={() => setModalOpen(false)} onSave={handleSave} />}
    </div>
  );
};

export default ManageBlogs;
