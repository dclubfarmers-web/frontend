import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  Target, CheckCircle, XCircle, ArrowRight, Clock, User, 
  TrendingUp, IndianRupee, History, PieChart, ExternalLink, 
  Search, Filter, LayoutGrid, List as ListIcon, Save, ChevronRight
} from 'lucide-react';
import Loader from '../../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const ManageDPRs = () => {
  const [dprs, setDprs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDPRs();
  }, []);

  const fetchDPRs = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/dpr');
      if (data) setDprs(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpdate = async (id, updateData) => {
    setUpdating(id);
    try {
      await api.put(`/api/dpr/${id}/status`, updateData);
      setDprs(dprs.map(item => item.id === id ? { ...item, ...updateData } : item));
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
    setUpdating(null);
  };

  const getProfitBadge = (val) => {
    if (!val || val === 0) return null;
    let color = 'bg-red-500';
    if (val >= 2) color = 'bg-emerald-500';
    else if (val >= 1.5) color = 'bg-orange-500';
    
    return (
      <span className={`px-2 py-0.5 ${color} text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg shadow-${color.split('-')[1]}-500/20`}>
        {val}x Yield
      </span>
    );
  };

  const filteredDPRs = dprs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || 
                         (d.guest_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || d.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loader fullPage />;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">DPR Strategic Requests</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Managing Dream Achiever Program Infrastructure Ingestion</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text"
                    placeholder="Search Visions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:border-slate-900 outline-none transition-all w-64"
                />
            </div>
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-slate-900 transition-all cursor-pointer"
            >
                <option value="all">Pipeline: All</option>
                <option value="pending">Status: Pending</option>
                <option value="approved">Status: Approved</option>
                <option value="rejected">Status: Rejected</option>
            </select>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDPRs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100"
            >
              <Target size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No strategic visions found in this sector</p>
            </motion.div>
          ) : filteredDPRs.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id} 
              className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
            >
              {/* Status & ROI */}
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                        item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' :
                        item.status === 'rejected' ? 'bg-red-50 text-red-600 shadow-red-100' :
                        'bg-amber-50 text-amber-600 shadow-amber-100'
                    }`}>
                        <Target size={20} />
                    </div>
                    {getProfitBadge(item.expected_profit)}
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 ${
                    item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    item.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                    {item.status}
                </span>
              </div>
              
              <div className="flex-1 space-y-3 mb-8 relative z-10">
                <h4 className="font-black text-slate-900 text-lg uppercase leading-tight italic tracking-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <User size={12} /> {item.guest_name || 'Anonymous Architect'}
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 italic">
                    {item.details}
                </p>
              </div>
              
              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-5 bg-slate-50 rounded-3xl relative z-10">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <IndianRupee size={10} /> Investment
                  </p>
                  <p className="font-black text-slate-900 text-sm tracking-tight">₹{item.investment_value?.toLocaleString() || '0'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <PieChart size={10} /> Outcome
                  </p>
                  <p className="font-black text-slate-900 text-sm tracking-tight">₹{item.expected_outcome?.toLocaleString() || '0'}</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-200">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <History size={10} /> Tenure
                  </p>
                  <p className="font-black text-slate-900 text-xs">{item.tenure || '0'} Months</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-200 text-right">
                   <a 
                     href={item.dpr_url} 
                     target="_blank" 
                     rel="noreferrer" 
                     className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center justify-end gap-1 hover:underline"
                   >
                     View DPR <ExternalLink size={10} />
                   </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <button 
                  disabled={updating === item.id}
                  onClick={() => handleUpdate(item.id, { status: 'approved' })}
                  className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  {updating === item.id ? '...' : <><CheckCircle size={14} /> Approve</>}
                </button>
                <button 
                  disabled={updating === item.id}
                  onClick={() => handleUpdate(item.id, { status: 'rejected' })}
                  className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                >
                   {updating === item.id ? '...' : <><XCircle size={14} /> Reject</>}
                </button>
              </div>

              {/* Decorative Accent */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-900 opacity-[0.02] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageDPRs;
