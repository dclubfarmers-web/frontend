import React, { useState, useEffect } from 'react';
import { Briefcase, Users, FileText, Target, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import Loader from '../../components/Loader';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        {icon}
      </div>
      <div className="flex items-center text-emerald-600 text-xs font-semibold">
        <TrendingUp size={12} className="mr-1" />
        Live
      </div>
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    dprs: 0,
    users: 0,
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsData = await api.get('/api/auth/stats');
      const appsData = await api.get('/api/applications');
      
      if (statsData) setStats(statsData);
      if (appsData) setRecentApps(appsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Jobs" value={stats.jobs} icon={<Briefcase size={24} />} color="bg-blue-600 text-blue-600" />
        <StatCard title="Applications" value={stats.applications} icon={<FileText size={24} />} color="bg-indigo-600 text-indigo-600" />
        <StatCard title="DPR Requests" value={stats.dprs} icon={<Target size={24} />} color="bg-orange-600 text-orange-600" />
        <StatCard title="Total Users" value={stats.users} icon={<Users size={24} />} color="bg-emerald-600 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Applications</h3>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Job Role</th>
                  <th className="px-6 py-4 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic">
                {loading ? (
                    <tr><td colSpan="3" className="py-10 text-center"><Loader /></td></tr>
                ) : recentApps.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-400 font-medium italic">No recent applications detected.</td></tr>
                ) : recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                            {(app.applicant_id?.full_name || app.guest_name || 'AP').substring(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{app.applicant_id?.full_name || app.guest_name || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium italic">{app.job_id?.title || 'Unknown Role'}</td>
                    <td className="px-6 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                       {new Date(app.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6 italic">System Integrity</h3>
          <div className="space-y-6">
            <div>
               <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest">
                  <span className="text-slate-500">Infrastructure Load</span>
                  <span className="text-slate-700">92%</span>
               </div>
               <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: '92%' }}></div>
               </div>
            </div>
            <div>
               <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest">
                  <span className="text-slate-500">Database Uptime</span>
                  <span className="text-slate-700">Optimal</span>
               </div>
               <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '100%' }}></div>
               </div>
            </div>
            <div className="pt-4 grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Latency</p>
                  <p className="text-lg font-bold text-slate-800">12ms</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Health</p>
                  <p className="text-sm font-bold text-emerald-600 uppercase italic">Active</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
