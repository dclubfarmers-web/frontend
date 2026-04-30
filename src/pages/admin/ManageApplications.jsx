import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FileText, Eye, Mail, Briefcase, Clock, ExternalLink, Filter } from 'lucide-react';

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

    const jobTitle = app.job_id?.title;

    if (category === 'listed') {
      matchesCategory = jobTitle !== 'General Talent Pool' && jobTitle !== 'Dream Achiever Program';
    } else if (category === 'general') {
      matchesCategory = jobTitle === 'General Talent Pool';
    } else if (category === 'dpr') {
      matchesCategory = jobTitle === 'Dream Achiever Program';
    }

    return matchesStatus && matchesCategory;
  });

  const counts = {
    all: applications.length,
    listed: applications.filter(a => a.job_id?.title !== 'General Talent Pool' && a.job_id?.title !== 'Dream Achiever Program').length,
    general: applications.filter(a => a.job_id?.title === 'General Talent Pool').length,
    dpr: applications.filter(a => a.job_id?.title === 'Dream Achiever Program').length
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Job Applications</h2>
          <p className="text-xs text-slate-500">Review and manage candidate submissions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {[
            { id: 'all', label: 'All', count: counts.all, color: 'bg-slate-900' },
            { id: 'listed', label: 'Listed', count: counts.listed, color: 'bg-blue-600' },
            { id: 'general', label: 'Talent Pool', count: counts.general, color: 'bg-emerald-600' },
            { id: 'dpr', label: 'DPR', count: counts.dpr, color: 'bg-amber-600' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${category === tab.id ? `${tab.color} text-white shadow-lg` : 'text-slate-500 hover:bg-white'
                }`}
            >
              {tab.label} <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${category === tab.id ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center"><div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div></td></tr>
            ) : filteredApps.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium italic">No applications found in this category.</td></tr>
            ) : filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border uppercase ${app.job_id?.title === 'General Talent Pool' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        app.job_id?.title === 'Dream Achiever Program' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {(app.applicant_id?.full_name || app.guest_name || 'AP').substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{app.applicant_id?.full_name || app.guest_name || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 uppercase tracking-tighter">
                        <Mail size={10} /> {app.applicant_id?.email || app.guest_email || 'No Email'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-[11px] uppercase tracking-tight">
                      <Briefcase size={12} className="text-slate-400" />
                      {app.job_id?.title || 'General Talent Pool'}
                    </div>
                    {app.job_id?.company && <span className="text-[9px] text-slate-400 font-medium ml-5">{app.job_id.company}</span>}
                    {app.job_id?.title === 'Dream Achiever Program' && <span className="text-[8px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full w-fit ml-5 mt-1 font-black uppercase">DPR APPLICATION</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Clock size={14} />
                    {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'pending' ? 'bg-slate-100 text-slate-600' :
                      app.status === 'interview' ? 'bg-blue-50 text-blue-600' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                          'bg-green-50 text-green-600'
                    }`}>
                    {app.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-900 text-slate-600 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200"
                  >
                    View <ExternalLink size={10} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageApplications;
