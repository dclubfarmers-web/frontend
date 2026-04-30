import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Target, CheckCircle, XCircle, Clock, User, 
  TrendingUp, IndianRupee, History, PieChart, ExternalLink, 
  Search, Filter, LayoutGrid, List as ListIcon, Save, ChevronRight,
  Eye, FileText, Download, Trash2, ArrowUpRight, Calendar
} from 'lucide-react';
import Loader from '../../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const ManageDPRs = () => {
  const navigate = useNavigate();
  const [dprs, setDprs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getProfitBadge = (val) => {
    if (!val || val === 0) return null;
    let color = 'bg-red-500';
    if (val >= 2) color = 'bg-emerald-500';
    else if (val >= 1.5) color = 'bg-orange-500';
    
    return (
      <span className={`px-2 py-0.5 ${color} text-white text-[8px] font-black uppercase tracking-widest rounded-md`}>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Strategic Requests</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Dream Achiever Program Analysis Dashboard</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                    type="text"
                    placeholder="Search Visions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-slate-900 outline-none transition-all w-64 shadow-sm"
                />
            </div>
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-slate-900 transition-all cursor-pointer shadow-sm"
            >
                <option value="all">Pipeline: All</option>
                <option value="pending">Status: Pending</option>
                <option value="approved">Status: Approved</option>
                <option value="rejected">Status: Rejected</option>
            </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visionary & Project</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Yield Multiplier</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Investment (₹)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Outcome (₹)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tenure</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDPRs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center">
                    <Target size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Strategic Ingestions Recorded</p>
                  </td>
                </tr>
              ) : filteredDPRs.map((dpr) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={dpr.id} 
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  {/* Project & Architect */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase italic">
                        {dpr.title.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">
                          {dpr.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <User size={10} /> {dpr.guest_name || 'Architect'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Multiplier Badge */}
                  <td className="px-6 py-5">
                    {getProfitBadge(dpr.expected_profit)}
                  </td>

                  {/* Investment */}
                  <td className="px-6 py-5 text-center">
                    <span className="text-[11px] font-black text-slate-700 italic">
                      ₹{dpr.investment_value?.toLocaleString() || '0'}
                    </span>
                  </td>

                  {/* Outcome */}
                  <td className="px-6 py-5 text-center">
                    <span className="text-[11px] font-black text-slate-900 italic">
                      ₹{dpr.expected_outcome?.toLocaleString() || '0'}
                    </span>
                  </td>

                  {/* Tenure */}
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Clock size={12} className="text-slate-300" /> {dpr.tenure || '0'}M
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      dpr.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                      dpr.status === 'rejected' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {dpr.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => navigate(`/admin/dprs/view/${dpr.id}`)}
                         className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                         title="Detailed View"
                       >
                         <Eye size={18} />
                       </button>
                       <a 
                         href={dpr.dpr_url} 
                         target="_blank" 
                         rel="noreferrer"
                         className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                         title="Download Artifact"
                       >
                         <Download size={18} />
                       </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<Target className="text-blue-600"/>} label="Total Strategic Visions" value={dprs.length} />
          <StatCard icon={<TrendingUp className="text-emerald-600"/>} label="Elite Yield (2x+)" value={dprs.filter(d => d.expected_profit >= 2).length} />
          <StatCard icon={<PieChart className="text-orange-600"/>} label="Pending Review" value={dprs.filter(d => d.status === 'pending').length} />
          <StatCard icon={<IndianRupee className="text-slate-900"/>} label="Total Projected Capital" value={`₹${dprs.reduce((acc, curr) => acc + (curr.investment_value || 0), 0).toLocaleString()}`} />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-slate-900 italic leading-none">{value}</p>
        </div>
    </div>
);

export default ManageDPRs;
