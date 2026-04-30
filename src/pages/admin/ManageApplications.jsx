import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  FileText, Eye, Mail, Briefcase, Clock, ExternalLink, Filter, 
  ChevronRight, TrendingUp, History, ShieldAlert 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await api.get('/api/applications');
      if (data) setApplications(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = filter === 'all' || app.status === filter;
    let matchesCategory = true;

    const jobTitle = app.job_id?.title || '';

    if (category === 'listed') {
      matchesCategory = jobTitle !== 'General Talent Pool' && jobTitle !== 'Dream Achiever Program';
    } else if (category === 'general') {
      matchesCategory = jobTitle === 'General Talent Pool';
    } else if (category === 'dpr') {
      matchesCategory = jobTitle === 'Dream Achiever Program' || jobTitle.includes('DPR');
    }

    return matchesStatus && matchesCategory;
  });

  const counts = {
    all: applications.length,
    listed: applications.filter(a => {
        const title = a.job_id?.title || '';
        return title !== 'General Talent Pool' && title !== 'Dream Achiever Program' && !title.includes('DPR');
    }).length,
    general: applications.filter(a => (a.job_id?.title || '') === 'General Talent Pool').length,
    dpr: applications.filter(a => {
        const title = a.job_id?.title || '';
        return title === 'Dream Achiever Program' || title.includes('DPR');
    }).length
  };

  const getProfitBadge = (val) => {
    if (!val || val === 0) return null;
    if (val >= 2) return <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-sm shadow-emerald-500/20">{val}x Profit</span>;
    if (val >= 1.5) return <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-sm shadow-orange-500/20">{val}x Profit</span>;
    return <span className="px-2 py-0.5 bg-red-500 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-sm shadow-red-500/20">{val}x Profit</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Recruitment Core</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Candidate Ingestion & Processing Pipeline</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {[
            { id: 'all', label: 'Global', count: counts.all, color: 'bg-slate-900' },
            { id: 'listed', label: 'Standard', count: counts.listed, color: 'bg-blue-600' },
            { id: 'general', label: 'Talent Pool', count: counts.general, color: 'bg-emerald-600' },
            { id: 'dpr', label: 'DPR Elite', count: counts.dpr, color: 'bg-amber-600' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${category === tab.id ? `${tab.color} text-white shadow-xl` : 'text-slate-500 hover:bg-white'
                }`}
            >
              {tab.label} <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${category === tab.id ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[9px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Candidate Identity</th>
                <th className="px-8 py-5">Role Designation</th>
                {category === 'dpr' && (
                    <>
                        <th className="px-8 py-5">Tenure</th>
                        <th className="px-8 py-5 text-center">ROI Projection</th>
                    </>
                )}
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center"><div className="w-8 h-8 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filteredApps.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">No records in target sector.</td></tr>
              ) : filteredApps.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs border-2 uppercase transition-all group-hover:scale-110 shadow-sm ${
                        category === 'general' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        category === 'dpr' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {(app.applicant_id?.full_name || app.guest_name || 'AP').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase tracking-tight italic">{app.applicant_id?.full_name || app.guest_name || 'Anonymous'}</p>
                        <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest mt-1">
                          <Mail size={10} className="text-slate-300" /> {app.applicant_id?.email || app.guest_email || 'No Email'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-800 font-black text-[10px] uppercase tracking-widest">
                        <Briefcase size={12} className="text-slate-300" />
                        {app.job_id?.title || 'General Talent Pool'}
                      </div>
                      {app.job_id?.company && <span className="text-[9px] text-slate-400 font-bold ml-5 uppercase tracking-tighter">{app.job_id.company}</span>}
                    </div>
                  </td>
                  
                  {category === 'dpr' && (
                    <>
                        <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-slate-700 font-black text-[10px] uppercase tracking-widest">
                                <History size={14} className="text-slate-300" />
                                {app.tenure || 0} <span className="text-slate-400 font-bold">Months</span>
                            </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                            {getProfitBadge(app.expected_profit)}
                        </td>
                    </>
                  )}

                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-[0.15em] w-fit shadow-sm border ${
                            app.status === 'applied' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            app.status === 'interview' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-green-50 text-green-600 border-green-100'
                        }`}>
                            {app.status || 'Applied'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
                            <Clock size={10} /> {new Date(app.created_at).toLocaleDateString()}
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100"
                            title="Quick Resume View"
                        >
                            <ExternalLink size={16} />
                        </a>
                        <Link
                            to={`/admin/applications/${app._id || app.id}`}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10"
                        >
                            View Details <ChevronRight size={14} />
                        </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
