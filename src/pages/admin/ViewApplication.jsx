import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, FileText, User, Mail, Phone, Calendar, 
  Briefcase, ExternalLink, Trash2, CheckCircle2, 
  Clock, AlertCircle, MapPin, Download
} from 'lucide-react';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import { motion } from 'framer-motion';

const ViewApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const data = await api.get(`/api/applications/${id}`);
      setApplication(data);
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
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
                <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                  {application.applicant_id?.full_name || application.guest_name || 'Anonymous Candidate'}
                </h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
          >
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FileText size={14} /> Personal Statement
            </h3>
            <div className="text-slate-600 leading-relaxed italic text-sm border-l-4 border-slate-100 pl-6 py-2">
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

        {/* Sidebar Info */}
        <div className="space-y-6">
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

          {/* Status Timeline Placeholder */}
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
