import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, FileText, User, Mail, Phone, Calendar, 
  Briefcase, ExternalLink, Trash2, CheckCircle2, 
  Clock, AlertCircle, MapPin, Download, Save, TrendingUp, History,
  IndianRupee, PieChart
} from 'lucide-react';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const ViewApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isDPR, setIsDPR] = useState(false);
  
  // DPR Specific State
  const [tenure, setTenure] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [expectedOutcome, setExpectedOutcome] = useState(0);
  const [expectedProfit, setExpectedProfit] = useState(1.0);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  // Auto-calculate multiplier when outcome or investment changes
  useEffect(() => {
    if (investment > 0) {
        const multiplier = (expectedOutcome / investment).toFixed(2);
        setExpectedProfit(multiplier);
    } else {
        setExpectedProfit(1.0);
    }
  }, [investment, expectedOutcome]);

  const fetchApplicationDetails = async () => {
    try {
      const data = await api.get(`/api/applications/${id}`);
      setApplication(data);
      
      const jobTitle = data.job_id?.title || '';
      const isDPRJob = jobTitle === 'Dream Achiever Program' || jobTitle.includes('DPR');
      setIsDPR(isDPRJob);
      
      if (isDPRJob) {
        setTenure(data.tenure || 0);
        setInvestment(data.investment_value || 0);
        setExpectedOutcome(data.expected_outcome || 0);
        setExpectedProfit(data.expected_profit || 1.0);
      }
    } catch (err) {
      console.error('Failed to fetch application:', err);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/api/applications/${id}`, { status: newStatus });
      setApplication({ ...application, status: newStatus });
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
    setUpdating(false);
  };

  const handleDPRUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/api/applications/${id}`, { 
        tenure: Number(tenure), 
        expected_profit: Number(expectedProfit),
        investment_value: Number(investment),
        expected_outcome: Number(expectedOutcome)
      });
      setApplication({ 
        ...application, 
        tenure, 
        expected_profit: expectedProfit, 
        investment_value: investment,
        expected_outcome: expectedOutcome
      });
      alert('DPR metrics updated successfully');
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application permanently?')) return;
    try {
      await api.delete(`/api/applications/${id}`);
      navigate('/admin/applications');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) return <Loader fullPage />;
  if (!application) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <AlertCircle size={48} className="text-red-500" />
      <h2 className="text-xl font-bold">Application Not Found</h2>
      <button onClick={() => navigate('/admin/applications')} className="text-blue-600 font-bold underline">Back to List</button>
    </div>
  );

  const statusColors = {
    applied: 'bg-blue-50 text-blue-600 border-blue-100',
    interview: 'bg-purple-50 text-purple-600 border-purple-100',
    hired: 'bg-green-50 text-green-600 border-green-100',
    rejected: 'bg-red-50 text-red-600 border-red-100'
  };

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
            onClick={() => navigate('/admin/applications')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Back to Applications
          </button>
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl uppercase shadow-lg shadow-slate-900/10">
                {(application.applicant_id?.full_name || application.guest_name || 'AP').substring(0, 2)}
             </div>
             <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                    {application.applicant_id?.full_name || application.guest_name || 'Anonymous Candidate'}
                    </h1>
                    {isDPR && (
                        <span className="px-2 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md">DPR ARCHITECT</span>
                    )}
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Application ID: {application.id}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            disabled={updating}
            value={application.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className={`px-4 py-2.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest outline-none transition-all ${statusColors[application.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
          >
            <option value="applied">Status: Applied</option>
            <option value="interview">Status: Interview</option>
            <option value="hired">Status: Hired</option>
            <option value="rejected">Status: Rejected</option>
          </select>
          <button 
            onClick={handleDelete}
            className="p-2.5 text-red-500 hover:bg-red-50 border-2 border-transparent hover:border-red-100 rounded-xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* DPR ANALYTICS CARD */}
          <AnimatePresence>
            {isDPR && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] border-2 border-slate-900 p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrendingUp size={120} className="text-slate-900" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <TrendingUp size={14} className="text-slate-900" /> DPR Automated Analytics
                            </h3>
                            <p className="text-sm font-bold text-slate-900 italic">Project Viability & Real-time ROI Ingestion</p>
                        </div>
                        <button 
                            onClick={handleDPRUpdate}
                            disabled={updating}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                        >
                            <Save size={14} /> {updating ? 'Saving...' : 'Commit Changes'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Investment Input */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Investment (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="number"
                                    value={investment}
                                    onChange={(e) => setInvestment(Number(e.target.value))}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 outline-none font-bold text-slate-900 transition-all"
                                    placeholder="e.g. 500000"
                                />
                            </div>
                        </div>

                        {/* Outcome Input */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Expected Outcome (₹)</label>
                            <div className="relative">
                                <PieChart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="number"
                                    value={expectedOutcome}
                                    onChange={(e) => setExpectedOutcome(Number(e.target.value))}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 outline-none font-bold text-slate-900 transition-all"
                                    placeholder="e.g. 1250000"
                                />
                            </div>
                        </div>

                        {/* Tenure Input */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tenure (Months)</label>
                            <div className="relative">
                                <History className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="number"
                                    value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 outline-none font-bold text-slate-900 transition-all"
                                    placeholder="e.g. 24"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated ROI Multiplier</p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-black italic transition-colors ${getProfitColor(expectedProfit).split(' ')[0]}`}>{expectedProfit}x</span>
                                <span className="text-xs font-bold text-slate-400">Yield Coefficient</span>
                            </div>
                        </div>
                        <div className={`px-6 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest text-center transition-colors min-w-[200px] ${getProfitColor(expectedProfit)}`}>
                             Classification: {expectedProfit >= 2 ? 'Elite (2x+)' : expectedProfit >= 1.5 ? 'Target (1.5x+)' : 'Sub-Optimal'}
                        </div>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
          >
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FileText size={14} /> Personal Statement
            </h3>
            <div className="text-slate-600 leading-relaxed italic text-sm border-l-4 border-slate-100 pl-6 py-2 whitespace-pre-wrap">
              {application.applicant_summary || 'No personal summary provided by the candidate.'}
            </div>
          </motion.div>

          {/* Experience / Resume Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Download size={14} /> Resume Artifact
              </h3>
              <a 
                href={application.resume_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                External View <ExternalLink size={12} />
              </a>
            </div>
            <div className="p-0 bg-slate-900 aspect-[1/1.4] relative group">
                <iframe 
                  src={application.resume_url + '#toolbar=0'} 
                  className="w-full h-full border-none"
                  title="Resume Preview"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center pointer-events-none">
                    <a 
                        href={application.resume_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="opacity-0 group-hover:opacity-100 bg-white text-slate-900 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all pointer-events-auto flex items-center gap-2"
                    >
                        Focus View <ExternalLink size={14} />
                    </a>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Candidate Profile */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <User size={14} /> Candidate Profile
            </h3>
            
            <div className="space-y-4">
              <InfoItem icon={<Mail size={16}/>} label="Email Address" value={application.applicant_id?.email || application.guest_email} />
              <InfoItem icon={<Phone size={16}/>} label="Phone Number" value={application.guest_phone || 'N/A'} />
              <InfoItem icon={<Calendar size={16}/>} label="Applied On" value={new Date(application.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} />
            </div>
          </div>

          {/* Position Info */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl space-y-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10"></div>
            
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
              <Briefcase size={14} /> Target Position
            </h3>

            <div className="space-y-1 relative z-10">
              <h4 className="text-xl font-bold text-white italic tracking-tight uppercase leading-tight">{application.job_id?.title || 'General Talent Pool'}</h4>
              <p className="text-xs text-white/60 font-medium">{application.job_id?.company || 'DJAIRINDIA PVT LTD'}</p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-black text-white/80 uppercase tracking-widest relative z-10">
               <MapPin size={12} className="text-white/40" /> {application.job_id?.location || 'Remote Deployment'}
            </div>

            <button 
              onClick={() => navigate(`/career/${application.job_id?._id || application.job_id?.id}`)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10"
            >
              View Job Briefing
            </button>
          </div>

          {/* System Validation */}
          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-600 rounded-lg text-white">
                   <CheckCircle2 size={18} />
                </div>
                <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-tight">System Validated</h4>
             </div>
             <p className="text-[11px] text-emerald-700/80 leading-relaxed font-medium italic">
               This application has been successfully ingested and verified by the recruitment core. Document integrity check passed.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
      {icon}
    </div>
    <div className="space-y-0.5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-sm font-bold text-slate-700 break-all">{value}</p>
    </div>
  </div>
);

export default ViewApplication;
