import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Search, Edit, Trash2, Briefcase, X, Save, MapPin } from 'lucide-react';

const JobModal = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState(job || {
    title: '',
    company: 'DJAIRINDIA PVT LTD',
    job_type: 'Full-time',
    salary: '',
    location: 'Bengaluru, India',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
           <h3 className="text-lg font-bold text-slate-800">{job ? 'Update Job' : 'Create New Job'}</h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Title</label>
            <input 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Type</label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.job_type} 
                onChange={e => setFormData({...formData, job_type: e.target.value})}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Contract</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Salary</label>
              <input 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.salary} 
                onChange={e => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
            <input 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium"
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea 
              rows="4"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2">
            <Save size={18}/> {job ? 'Save Changes' : 'Publish Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/api/jobs');
      if (data) setJobs(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSave = async (formData) => {
    try {
      if (editingJob) {
        await api.put(`/api/jobs/${editingJob.id}`, formData);
        setJobs(jobs.map(j => j.id === editingJob.id ? { ...j, ...formData } : j));
      } else {
        const data = await api.post('/api/jobs', formData);
        setJobs([data, ...jobs]);
      }
    } catch (err) { alert(err.message); }
    setModalOpen(false);
    setEditingJob(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/api/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input
             type="text"
             placeholder="Search jobs..."
             className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <button 
          onClick={() => { setEditingJob(null); setModalOpen(true); }}
          className="bg-[#1A3D24] hover:bg-[#112616] text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18} /> New Job
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Salary</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400">Loading jobs...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400">No jobs found.</td></tr>
            ) : jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase())).map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-bold text-slate-800">{job.title}</td>
                <td className="px-6 py-4 text-slate-600 flex items-center gap-1"><MapPin size={14}/> {job.location}</td>
                <td className="px-6 py-4 text-slate-600">{job.salary || '---'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => { setEditingJob(job); setModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(job.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <JobModal job={editingJob} onClose={() => setModalOpen(false)} onSave={handleSave} />}
    </div>
  );
};

export default ManageJobs;
