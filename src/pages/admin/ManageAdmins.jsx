import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { UserPlus, Shield, Mail, Trash2, Key, UserCheck, X } from 'lucide-react';

const AdminModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
             <Shield size={16} className="text-[#0369A1]"/> Add Administrator
           </h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
            <input 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0369A1] outline-none text-sm"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
            <input 
              required
              type="email"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0369A1] outline-none text-sm"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
            <input 
              required
              type="password"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0369A1] outline-none text-sm"
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-[#0369A1] hover:bg-[#0C4A6E] text-white font-bold py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 mt-2 uppercase text-xs tracking-wider"
          >
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try {
      const data = await api.get('/api/auth/admins');
      if (data) setAdmins(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAddAdmin = async (formData) => {
    const data = await api.post('/api/auth/register-admin', formData);
    setAdmins([...admins, data]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this administrator?')) return;
    try {
      await api.delete(`/api/auth/admins/${id}`);
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Admin Users</h2>
           <p className="text-xs text-slate-500">Manage individuals with administrative access.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#0369A1] hover:bg-[#0C4A6E] text-white px-6 py-2 rounded-lg font-bold transition-all text-sm"
        >
          <UserPlus size={18} /> Add Admin
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-400">Loading...</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-400">No other admins found.</td></tr>
            ) : admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-[#0369A1] rounded-full flex items-center justify-center font-bold text-xs border border-blue-100 uppercase">
                         {admin.name?.substring(0, 2)}
                      </div>
                      <span className="font-bold text-slate-800">{admin.name}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{admin.email}</td>
                <td className="px-6 py-4 text-center">
                   <button onClick={() => handleDelete(admin.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <AdminModal onClose={() => setModalOpen(false)} onSave={handleAddAdmin} />}
    </div>
  );
};

export default ManageAdmins;
