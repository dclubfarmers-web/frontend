import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FileText, Eye, Mail, Briefcase, Clock, ExternalLink, Filter } from 'lucide-react';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Job Applications</h2>
           <p className="text-xs text-slate-500">Review and manage candidate submissions.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-lg">
           <Filter size={14} className="text-slate-400 ml-2" />
           <select 
             className="text-xs font-bold text-slate-600 outline-none bg-transparent pr-4"
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
           >
              <option value="all">All Applications</option>
              <option value="pending">Pending Review</option>
              <option value="interview">Interviewing</option>
              <option value="rejected">Rejected</option>
           </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4 text-center">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center"><div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div></td></tr>
            ) : filteredApps.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400">No applications detected.</td></tr>
            ) : filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs border border-blue-100 uppercase">
                         {app.applicant?.full_name?.substring(0, 2) || 'AP'}
                      </div>
                      <div>
                         <p className="font-bold text-slate-800">{app.applicant?.full_name || 'Anonymous Applicant'}</p>
                         <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 uppercase tracking-tighter"><Mail size={10}/> {app.applicant?.email}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Briefcase size={14} className="text-slate-400"/>
                      {app.job?.title || 'Unknown Position'}
                   </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Clock size={14}/>
                      {new Date(app.created_at).toLocaleDateString()}
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <a 
                     href={app.resume_url} 
                     target="_blank" 
                     rel="noreferrer"
                     className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-blue-100"
                   >
                     View CV <ExternalLink size={12}/>
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
