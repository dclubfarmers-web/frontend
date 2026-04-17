import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Info, 
  Target, 
  Eye, 
  Users, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  Layout, 
  Image as ImageIcon,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import api from '../../utils/api';
import Loader from '../../components/Loader';

const ManageAbout = () => {
    const [settings, setSettings] = useState({
        aboutHeroTitle: '',
        aboutHeroDescription: '',
        aboutMission: '',
        aboutVision: '',
        aboutMainDescription: '',
        team: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'mission', 'team'

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await api.get('/api/settings');
            if (data) {
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    team: data.team || []
                }));
            }
        } catch (err) {
            console.error('Failed to load about settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/api/settings', settings);
            // Show success toast or notification if available
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    };

    const addTeamMember = () => {
        const newMember = {
            id: Date.now(),
            name: '',
            role: '',
            desc: '',
            img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
        };
        setSettings({ ...settings, team: [...settings.team, newMember] });
    };

    const updateTeamMember = (id, field, value) => {
        const updatedTeam = settings.team.map(m => 
            m.id === id ? { ...m, [field]: value } : m
        );
        setSettings({ ...settings, team: updatedTeam });
    };

    const removeTeamMember = (id) => {
        setSettings({
            ...settings,
            team: settings.team.filter(m => m.id !== id)
        });
    };

    if (loading) return <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>;

    const tabs = [
        { id: 'hero', label: 'Hero Section', icon: <Layout size={18} /> },
        { id: 'mission', label: 'Mission & Vision', icon: <Target size={18} /> },
        { id: 'team', label: 'Team Management', icon: <Users size={18} /> },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">About Page Management</h1>
                    <p className="text-sm text-slate-500 font-medium">Configure the public 'About Us' narrative and team showcase.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#1A3D24] hover:bg-[#112616] text-white px-6 py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save size={18}/>}
                    {saving ? 'Saving...' : 'Publish Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm border ${
                                activeTab === tab.id ? 'bg-white border-slate-200 text-[#1A3D24] shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <span className={`${activeTab === tab.id ? 'text-[#1A3D24]' : 'text-slate-400'}`}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'hero' && (
                            <motion.div 
                                key="hero"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                                    <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                                        <Layout size={18} className="text-[#1A3D24]"/>
                                        <h3 className="font-bold text-slate-800">Hero Configuration</h3>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Hero Title</label>
                                        <input 
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none font-medium"
                                            value={settings.aboutHeroTitle}
                                            onChange={(e) => setSettings({...settings, aboutHeroTitle: e.target.value})}
                                            placeholder="About DJAIRINDIA PVT LTD"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Sub-description</label>
                                        <textarea 
                                            rows="3"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none font-medium resize-none text-sm"
                                            value={settings.aboutHeroDescription}
                                            onChange={(e) => setSettings({...settings, aboutHeroDescription: e.target.value})}
                                            placeholder="Sub-description text..."
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'mission' && (
                            <motion.div 
                                key="mission"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                                    <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
                                        <Target size={18} className="text-[#1A3D24]"/>
                                        <h3 className="font-bold text-slate-800">Mission & Vision Values</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Our Mission</label>
                                            <textarea 
                                                rows="4"
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none font-medium resize-none text-sm"
                                                value={settings.aboutMission}
                                                onChange={(e) => setSettings({...settings, aboutMission: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Our Vision</label>
                                            <textarea 
                                                rows="4"
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none font-medium resize-none text-sm"
                                                value={settings.aboutVision}
                                                onChange={(e) => setSettings({...settings, aboutVision: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Main Brand Description</label>
                                        <textarea 
                                            rows="6"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none font-medium resize-none text-sm"
                                            value={settings.aboutMainDescription}
                                            onChange={(e) => setSettings({...settings, aboutMainDescription: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'team' && (
                            <motion.div 
                                key="team"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Users size={18} className="text-[#1A3D24]"/>
                                        <h3 className="font-bold text-slate-800">Visionary Team ({settings.team.length})</h3>
                                    </div>
                                    <button 
                                        onClick={addTeamMember}
                                        className="flex items-center gap-2 text-[10px] font-bold text-[#1A3D24] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest"
                                    >
                                        <Plus size={14}/> Add Member
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {settings.team.map((member) => (
                                        <div key={member.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                                            <button 
                                                onClick={() => removeTeamMember(member.id)}
                                                className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14}/>
                                            </button>

                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                                                    <img src={member.img} alt="item" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                                        <ImageIcon size={14} className="text-white"/>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <input 
                                                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none font-bold text-xs"
                                                        value={member.name}
                                                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                                                        placeholder="Full Name"
                                                    />
                                                    <input 
                                                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none font-bold text-[10px] text-[#1A3D24] uppercase"
                                                        value={member.role}
                                                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                                                        placeholder="Role/Designation"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3 space-y-2">
                                                <input 
                                                    className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none text-[10px] font-medium"
                                                    value={member.desc}
                                                    onChange={(e) => updateTeamMember(member.id, 'desc', e.target.value)}
                                                    placeholder="Short professional biography..."
                                                />
                                                <input 
                                                    className="w-full p-2 bg-slate-100/50 border border-slate-100 rounded-lg focus:ring-1 focus:ring-[#1A3D24] outline-none text-[8px] font-mono text-slate-400"
                                                    value={member.img}
                                                    onChange={(e) => updateTeamMember(member.id, 'img', e.target.value)}
                                                    placeholder="Photo URL"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {settings.team.length === 0 && (
                                        <div className="col-span-full py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-center">
                                            <p className="text-slate-400 font-medium italic text-sm">No team members defined. Click 'Add Member' to begin.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ManageAbout;
