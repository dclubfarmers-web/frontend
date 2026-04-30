import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, FileText, User, Mail, Phone, Calendar, 
  Briefcase, ExternalLink, Trash2, CheckCircle2, 
  Clock, AlertCircle, MapPin, Download, Save, TrendingUp, History,
  IndianRupee, PieChart, Target, Rocket
} from 'lucide-react';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const ViewDPR = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dpr, setDpr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // DPR Specific State for editing
  const [tenure, setTenure] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [expectedOutcome, setExpectedOutcome] = useState(0);
  const [expectedProfit, setExpectedProfit] = useState(1.0);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    fetchDPRDetails();
  }, [id]);

  // Auto-calculate multiplier when outcome or investment changes
  useEffect(() => {
    if (investment > 0) {
        const multiplier = (expectedOutcome / investment).toFixed(2);
        setExpectedProfit(Number(multiplier));
    } else {
        setExpectedProfit(1.0);
    }
  }, [investment, expectedOutcome]);

  const fetchDPRDetails = async () => {
    try {
      // We assume /api/dpr/:id returns the single record.
      // If it doesn't exist, we might need to update dprController.
      const data = await api.get(`/api/dpr`); 
      // Filter manually if specific endpoint is not there, but let's assume we have it.
      const record = Array.isArray(data) ? data.find(d => d.id === id || d._id === id) : data;
      
      if (record) {
        setDpr(record);
        setTenure(record.tenure || 0);
        setInvestment(record.investment_value || 0);
        setExpectedOutcome(record.expected_outcome || 0);
        setExpectedProfit(record.expected_profit || 1.0);
        setStatus(record.status || 'pending');
      }
    } catch (err) {
      console.error('Failed to fetch DPR details:', err);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/api/dpr/${id}/status`, { 
        status,
        tenure: Number(tenure), 
        expected_profit: Number(expectedProfit),
        investment_value: Number(investment),
        expected_outcome: Number(expectedOutcome)
      });
      alert('Strategic vision metrics updated successfully');
      navigate('/admin/dprs');
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this strategic vision permanently?')) return;
    try {
      await api.delete(`/api/dpr/${id}`);
      navigate('/admin/dprs');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) return <Loader fullPage />;
  if (!dpr) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <AlertCircle size={48} className="text-red-500" />
      <h2 className="text-xl font-bold uppercase italic tracking-tight">Visionary Record Not Found</h2>
      <button onClick={() => navigate('/admin/dprs')} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl">Back to Pipeline</button>
    </div>
  );

  const getProfitColor = (val) => {
    if (val >= 2) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (val >= 1.5) return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/admin/dprs')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={14} /> Back to Strategic Pipeline
          </button>
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl uppercase italic shadow-2xl shadow-slate-900/20">
                {dpr.title.substring(0, 2)}
             </div>
             <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                      {dpr.title}
                    </h1>
                    <span className="px-2 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-md">ELITE DPR</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Architect: {dpr.guest_name || 'Anonymous'}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            disabled={updating}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-slate-900 transition-all cursor-pointer shadow-sm"
          >
            <option value="pending">Status: Pending Review</option>
            <option value="approved">Status: Approved</option>
            <option value="rejected">Status: Rejected</option>
          </select>
          <button 
            onClick={handleDelete}
            className="p-3 text-red-500 hover:bg-red-50 border-2 border-transparent hover:border-red-100 rounded-2xl transition-all shadow-sm"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Analytics & Summary (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* ROI ENGINE CARD */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] border-2 border-slate-900 p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5">
                <Rocket size={140} className="text-slate-900" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <TrendingUp size={14} className="text-slate-900" /> Strategic Analysis Engine
                        </h3>
                        <p className="text-sm font-bold text-slate-900 italic uppercase">Viability Matrix & Yield Projections</p>
                    </div>
                    <button 
                        onClick={handleUpdate}
                        disabled={updating}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 active:scale-95"
                    >
                        <Save size={16} /> {updating ? 'Syncing...' : 'Commit Analysis'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Investment Input */}
                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Target Capital (₹)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="number"
                                value={investment}
                                onChange={(e) => setInvestment(Number(e.target.value))}
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] focus:border-slate-900 outline-none font-black text-slate-900 transition-all text-sm"
                                placeholder="Investment"
                            />
                        </div>
                    </div>

                    {/* Outcome Input */}
                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Projected Return (₹)</label>
                        <div className="relative">
                            <PieChart className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="number"
                                value={expectedOutcome}
                                onChange={(e) => setExpectedOutcome(Number(e.target.value))}
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] focus:border-slate-900 outline-none font-black text-slate-900 transition-all text-sm"
                                placeholder="Outcome"
                            />
                        </div>
                    </div>

                    {/* Tenure Input */}
                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Execution Tenure (M)</label>
                        <div className="relative">
                            <History className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="number"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] focus:border-slate-900 outline-none font-black text-slate-900 transition-all text-sm"
                                placeholder="Tenure"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Yield Multiplier</p>
                        <div className="flex items-baseline gap-3">
                            <span className={`text-5xl font-black italic tracking-tighter transition-colors ${getProfitColor(expectedProfit).split(' ')[0]}`}>{expectedProfit}x</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coefficient</span>
                        </div>
                    </div>
                    <div className={`px-8 py-5 rounded-[1.5rem] border-2 font-black text-[10px] uppercase tracking-[0.2em] text-center transition-colors min-w-[240px] shadow-xl ${getProfitColor(expectedProfit)}`}>
                         {expectedProfit >= 2 ? 'Elite Viability (2x+)' : expectedProfit >= 1.5 ? 'Target Ingestion (1.5x+)' : 'Sub-Optimal Request'}
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Strategic Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm"
          >
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <FileText size={14} className="text-slate-900" /> Strategic Vision Statement
            </h3>
            <div className="text-slate-700 leading-relaxed italic text-base border-l-8 border-slate-50 pl-10 py-4 font-medium whitespace-pre-wrap">
              {dpr.details || 'No strategic details provided by the architect.'}
            </div>
          </motion.div>

          {/* Document Preview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Download size={14} className="text-slate-900" /> Detailed Project Report (DPR)
              </h3>
              <a 
                href={dpr.dpr_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2"
              >
                External View <ExternalLink size={12} />
              </a>
            </div>
            <div className="bg-slate-900 aspect-[1/1.4] relative group">
                <iframe 
                  src={dpr.dpr_url + '#toolbar=0'} 
                  className="w-full h-full border-none opacity-90"
                  title="DPR Artifact Preview"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center pointer-events-none">
                    <a 
                        href={dpr.dpr_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="opacity-0 group-hover:opacity-100 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all pointer-events-auto flex items-center gap-3 scale-90 group-hover:scale-100"
                    >
                        Maximize Analysis <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Architect Profile */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <User size={14} className="text-slate-900" /> Visionary Architect
            </h3>
            
            <div className="space-y-6">
              <InfoItem icon={<Mail size={16}/>} label="Strategic Email" value={dpr.guest_email || 'Not Provided'} />
              <InfoItem icon={<Phone size={16}/>} label="Secure Hotline" value={dpr.guest_phone || 'Not Provided'} />
              <InfoItem icon={<Calendar size={16}/>} label="Ingestion Date" value={new Date(dpr.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} />
            </div>
          </div>

          {/* Strategic Context */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-12 -translate-y-12"></div>
            
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2 relative z-10">
              <Target size={14} className="text-white" /> Strategic Context
            </h3>

            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">INCUBATION PROGRAM</p>
              <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">Dream Achiever Program</h4>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-widest relative z-10">
               <MapPin size={12} className="text-white/40" /> PAN-INDIA DEPLOYMENT
            </div>

            <div className="pt-4 border-t border-white/10 relative z-10">
               <p className="text-[11px] text-white/40 font-medium italic leading-relaxed">
                 Elite incubation for high-impact visionaries. This project is being evaluated for institutional investment and infrastructure support.
               </p>
            </div>
          </div>

          {/* Validation Seal */}
          <div className="bg-emerald-50 rounded-[2rem] p-8 border-2 border-emerald-100 flex items-start gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                <CheckCircle2 size={20} />
             </div>
             <div>
                <h4 className="font-black text-emerald-900 text-[10px] uppercase tracking-widest mb-1">DPR Authenticated</h4>
                <p className="text-[10px] text-emerald-700/70 leading-relaxed font-bold italic">
                  Digital project report integrity verified. Security clearance granted for strategic analysis.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-5 group">
    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-sm font-black text-slate-900 italic break-all leading-tight">{value}</p>
    </div>
  </div>
);

const ArrowUpRight = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
  </svg>
);

export default ViewDPR;
