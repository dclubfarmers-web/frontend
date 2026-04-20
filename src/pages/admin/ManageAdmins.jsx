import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { UserPlus, Shield, Mail, Trash2, Key, UserCheck, X, Clock } from 'lucide-react';

const InviteModal = ({ onClose, onSave }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ email });
      onClose();
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
             <Mail size={16} className="text-[#0369A1]"/> Invite Administrator
           </h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500 mb-2">Send an invitation link to a colleague. They will be able to set their own name and password upon joining.</p>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
            <input 
              required
              type="email"
              placeholder="colleague@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0369A1] outline-none text-sm"
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-[#0369A1] hover:bg-[#0C4A6E] text-white font-bold py-3.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 mt-2 uppercase text-xs tracking-wider"
          >
            {loading ? 'Sending...' : 'Send Invitation link'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { 
      Promise.all([fetchAdmins(), fetchInvitations()]).finally(() => setLoading(false));
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await api.get('/api/auth/admins');
      if (data) setAdmins(data);
    } catch (err) { console.error(err); }
  };

  const fetchInvitations = async () => {
    try {
      const data = await api.get('/api/invitations');
      if (data) setInvitations(data);
    } catch (err) { console.error(err); }
  };

  const handleInvite = async (invData) => {
    try {
      const data = await api.post('/api/invitations', invData);
      setInvitations([data.invitation, ...invitations]);
      alert('Invitation sent successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Remove this administrator?')) return;
    try {
      await api.delete(`/api/auth/admins/${id}`);
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Team Management</h2>
           <p className="text-xs text-slate-500">Control administrative access and manage pending invites.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#0369A1] hover:bg-[#0C4A6E] text-white px-6 py-2.5 rounded-lg font-bold transition-all text-sm shadow-md"
        >
          <UserPlus size={18} /> Invite New Admin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Admins List */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
              <UserCheck size={14} /> Active Administrators ({admins.length})
           </div>
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
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
                   <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-400">Loading operators...</td></tr>
                 ) : admins.length === 0 ? (
                   <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-400">No other admins found.</td></tr>
                 ) : admins.map((admin) => (
                   <tr key={admin.id} className="hover:bg-slate-50/50 transition-all">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-blue-50 text-[#0369A1] rounded-full flex items-center justify-center font-bold text-xs border border-blue-100 uppercase">
                              {admin.full_name?.substring(0, 2)}
                           </div>
                           <span className="font-bold text-slate-800">{admin.full_name}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-slate-600 font-mono text-xs">{admin.email}</td>
                     <td className="px-6 py-4 text-center">
                        <button onClick={() => handleDeleteAdmin(admin.id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"><Trash2 size={18} /></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Pending Invitations */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
              <Clock size={14} /> Pending Invitations ({invitations.length})
           </div>
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              {loading ? (
                <div className="text-center py-6 text-slate-400 italic text-xs">Syncing invites...</div>
              ) : invitations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 italic text-xs border-2 border-dashed border-slate-100 rounded-xl">No pending invitations.</div>
              ) : invitations.map((inv) => (
                <div key={inv.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700 truncate mr-2">{inv.email}</span>
                      <Shield size={12} className="text-blue-400"/>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Expires: {new Date(inv.expires_at).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-[#0369A1] text-[9px] font-black uppercase rounded-full">Invited</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {modalOpen && <InviteModal onClose={() => setModalOpen(false)} onSave={handleInvite} />}
    </div>
  );
};

export default ManageAdmins;
