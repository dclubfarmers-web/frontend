import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Settings, Save, Globe, Mail, Shield, Smartphone, Bell, Info, Laptop, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageUpload from '../../components/ImageUpload';
import { useSettings } from '../../context/SettingsContext';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'DJAIRINDIA PVT LTD',
    logo: '',
    contactEmail: 'contact@djairindia.com',
    supportNumber: '+91 1234567890',
    address: 'Bengaluru, Karnataka, India',
    maintenance: {
      enabled: false,
      pages: [] // Empty means all pages
    },
    enableNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const { refreshSettings } = useSettings();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/api/settings');
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
       await api.put('/api/settings', settings);
       await refreshSettings(); // Update global state
       alert('Configuration updated successfully.');
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const APP_PAGES = [
    { id: '/', label: 'Home Page' },
    { id: '/about', label: 'About Us' },
    { id: '/career', label: 'Careers & Jobs' },
    { id: '/blog', label: 'Insights & Blog' },
    { id: '/investors', label: 'Investors' },
    { id: '/contact', label: 'Support & Contact' },
  ];

  const handlePageToggle = (pageId) => {
    const pages = [...(settings.maintenance?.pages || [])];
    if (pages.includes(pageId)) {
      setSettings({
        ...settings,
        maintenance: { ...settings.maintenance, pages: pages.filter(p => p !== pageId) }
      });
    } else {
      setSettings({
        ...settings,
        maintenance: { ...settings.maintenance, pages: [...pages, pageId] }
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18}/> },
    { id: 'contact', label: 'Contact', icon: <Mail size={18}/> },
    { id: 'security', label: 'Security', icon: <Shield size={18}/> }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Platform Configuration</h2>
           <p className="text-xs text-slate-500">Fine-tune global parameters and system identity.</p>
        </div>
        <button 
           onClick={handleSave}
           disabled={saving}
           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest"
        >
          {saving ? 'Syncing...' : <><Save size={18}/> Save Changes</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Tabs */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
           {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold transition-all text-xs lg:text-sm whitespace-nowrap lg:whitespace-normal shrink-0 ${
                   activeTab === tab.id ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-500 hover:bg-slate-100/50'
                }`}
              >
                <span className={`${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}>{tab.icon}</span>
                {tab.label}
              </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl lg:rounded-[2rem] border border-slate-200 shadow-sm p-4 sm:p-8 lg:p-10 transition-all">
           <form onSubmit={handleSave} className="space-y-8">
              {activeTab === 'general' && (
                 <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-4">
                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Global Identity</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-700">Platform Display Name</label>
                               <input 
                                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-[#1A3D24] outline-none font-medium transition-all"
                                 value={settings.siteName}
                                 onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                               />
                            </div>
                            <div className="p-6 bg-green-50 border border-green-100 rounded-[1.5rem] flex gap-4">
                               <div className="p-3 bg-white rounded-xl h-fit shadow-sm"><Info size={20} className="text-[#1A3D24]"/></div>
                               <p className="text-xs text-green-800 leading-relaxed font-medium">Changing the display name will immediately update the SEO metadata and browser tab titles across all pages.</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                             <ImageUpload 
                                label="Platform Logo"
                                value={settings.logo}
                                onChange={url => setSettings({...settings, logo: url})}
                             />
                          </div>

                          <div className="md:col-span-2 space-y-4">
                             <div className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-6">
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                      <div className={`p-3 rounded-2xl ${settings.maintenance?.enabled ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                         <Hammer size={24} />
                                      </div>
                                      <div>
                                         <p className="text-sm font-bold text-slate-800">Maintenance Mode</p>
                                         <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Restrict user access to specific areas</p>
                                      </div>
                                   </div>
                                   <label className="relative inline-flex items-center cursor-pointer">
                                      <input 
                                         type="checkbox" 
                                         className="sr-only peer" 
                                         checked={settings.maintenance?.enabled || false}
                                         onChange={(e) => setSettings({...settings, maintenance: { ...settings.maintenance, enabled: e.target.checked }})}
                                      />
                                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                   </label>
                                </div>

                                {settings.maintenance?.enabled && (
                                   <motion.div 
                                      initial={{ opacity: 0, height: 0 }} 
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="pt-6 border-t border-slate-200 space-y-4"
                                   >
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Pages to Lock</p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                         <button
                                            type="button"
                                            onClick={() => setSettings({...settings, maintenance: { ...settings.maintenance, pages: [] }})}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-xs font-bold ${
                                               !settings.maintenance?.pages?.length 
                                               ? 'bg-[#1A3D24] border-[#1A3D24] text-white shadow-lg' 
                                               : 'bg-white border-slate-200 text-slate-600 hover:border-[#1A3D24]'
                                            }`}
                                         >
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!settings.maintenance?.pages?.length ? 'border-white' : 'border-slate-300'}`}>
                                               {!settings.maintenance?.pages?.length && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            All Pages (Entire Site)
                                         </button>

                                         {APP_PAGES.map(page => (
                                            <button
                                               key={page.id}
                                               type="button"
                                               onClick={() => handlePageToggle(page.id)}
                                               className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-xs font-bold ${
                                                  settings.maintenance?.pages?.includes(page.id)
                                                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                                                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-600'
                                               }`}
                                            >
                                               <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${settings.maintenance?.pages?.includes(page.id) ? 'border-white' : 'border-slate-300'}`}>
                                                  {settings.maintenance?.pages?.includes(page.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                               </div>
                                               {page.label}
                                            </button>
                                         ))}
                                      </div>
                                      <div className="p-4 bg-amber-50 rounded-2xl flex gap-3 italic">
                                         <Info size={16} className="text-amber-600 shrink-0" />
                                         <p className="text-[10px] text-amber-800">
                                            Admin routes (e.g., /admin/*) are never locked to prevent losing access to this panel.
                                         </p>
                                      </div>
                                   </motion.div>
                                )}
                             </div>
                          </div>
                    </div>
                 </div>
              </motion.div>
           )}

              {activeTab === 'contact' && (
                 <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Communication Channels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700">Contact Email</label>
                          <input 
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-blue-500 outline-none font-medium"
                             value={settings.contactEmail}
                             onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700">Support Number</label>
                          <input 
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-blue-500 outline-none font-medium"
                             value={settings.supportNumber}
                             onChange={(e) => setSettings({...settings, supportNumber: e.target.value})}
                          />
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-700">Physical HQ Address</label>
                          <textarea 
                             rows="3"
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-blue-500 outline-none font-medium resize-none"
                             value={settings.address}
                             onChange={(e) => setSettings({...settings, address: e.target.value})}
                          />
                       </div>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'security' && (
                 <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Privacy & Security</h3>
                    <div className="space-y-4">
                       <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="relative">
                             <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={settings.enableNotifications}
                                onChange={(e) => setSettings({...settings, enableNotifications: e.target.checked})}
                             />
                             <div className={`w-12 h-6 rounded-full transition-all ${settings.enableNotifications ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                             <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all ${settings.enableNotifications ? 'translate-x-6' : ''}`}></div>
                          </div>
                          <div className="flex-1">
                             <p className="text-sm font-bold text-slate-800">Operational Notifications</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase">Send real-time alerts for new leads & apps</p>
                          </div>
                          <Bell size={20} className="text-blue-600 opacity-20"/>
                       </label>
                    </div>
                 </motion.div>
              )}
           </form>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
