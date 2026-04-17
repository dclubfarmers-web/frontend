import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Target, CheckCircle, XCircle, ArrowRight, Clock, User } from 'lucide-react';

const ManageDPRs = () => {
  const [dprs, setDprs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDPRs();
  }, []);

  const fetchDPRs = async () => {
    try {
      const data = await api.get('/api/dpr');
      if (data) setDprs(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/api/dpr/${id}/status`, { status });
      setDprs(dprs.map(item => item.id === id ? { ...item, status } : item));
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase italic">Approved</span>;
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase italic">Rejected</span>;
      default: return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full uppercase italic">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">DPR (Dream Achiever) Requests</h2>
           <p className="text-xs text-slate-500">Manage and approve user dream infrastructure requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center"><div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div></div>
        ) : dprs.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-200 rounded-xl">No dream requests currently in the pipeline.</div>
        ) : dprs.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col hover:border-blue-300 transition-all shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mb-2">
                 <Target size={24} />
              </div>
              {getStatusBadge(item.status)}
            </div>
            
            <h4 className="font-bold text-slate-800 text-lg mb-2 leading-snug">{item.title}</h4>
            <p className="text-sm text-slate-600 mb-6 flex-1">{item.details}</p>
            
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Value</p>
                  <p className="font-bold text-slate-900 text-xl">₹{item.dream_value?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Submitted</p>
                  <p className="text-xs font-semibold text-slate-600 flex items-center justify-end gap-1"><Clock size={12}/> {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {item.status === 'pending' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleUpdateStatus(item.id, 'approved')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(item.id, 'rejected')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-all border border-red-100"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDPRs;
