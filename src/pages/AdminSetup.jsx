import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Mail, Lock, CheckCircle, Zap, ArrowRight, Server, Globe, Rocket, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminSetup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    siteName: 'DJAIRINDIA PVT LTD'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { setup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Check the backend operational status and initialization
      const data = await api.get('/api/status');
      // If we can get a response from status, it means API is up.
      // We also check if we can access the setup route.
      // Note: backend's setupFirstAdmin handles the 'already initialized' check.
    } catch (err) {
      console.error('System status check failed:', err);
    }
    setLoading(false);
  };

  const handleSetup = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await setup(formData);
      setSuccess(true);
      setTimeout(() => navigate('/admin'), 3000);
    } catch (err) {
      setError(err.message);
      setStep(1);
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#0369A1]/20 border-t-[#0369A1] rounded-full animate-spin"></div>
        <p className="text-[#0369A1] font-bold text-xs animate-pulse uppercase tracking-widest">Waking Core Systems...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4 font-['Fira_Sans'] overflow-hidden relative">
       {/* Decorative backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0369A1] opacity-[0.03] rounded-full translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-5xl w-full relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-[#E0F2FE] rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px]"
        >
          {/* Left Side: Status & Progress (Lg: 4 cols) */}
          <div className="lg:col-span-4 bg-[#0369A1] p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/70 font-black tracking-widest text-[10px] mb-8">
                    <Rocket size={14} /> PLATFORM_INIT_V1.0
                </div>
                
                <div className="space-y-8">
                    {[
                        { s: 1, label: 'Owner Identity', icon: <User size={16}/> },
                        { s: 2, label: 'Brand Config', icon: <Globe size={16}/> },
                        { s: 3, label: 'Deploy Systems', icon: <Zap size={16}/> }
                    ].map(item => (
                        <div key={item.s} className={`flex items-center gap-4 transition-all duration-500 ${step >= item.s ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 font-black ${
                                step === item.s ? 'bg-white border-white text-[#0369A1] shadow-lg shadow-sky-900/20' : 
                                step > item.s ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white' : 'border-white/20 text-white/40'
                            }`}>
                                {step > item.s ? <CheckCircle size={20}/> : item.s}
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase text-white/50">Checkpoint 0{item.s}</p>
                                <p className={`text-sm font-bold ${step === item.s ? 'text-white' : 'text-white/70'}`}>{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 pt-10 border-t border-white/10 mt-10">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-lg"><Server size={16} className="text-white"/></div>
                   <p className="text-[10px] font-bold text-white/50 leading-tight uppercase tracking-widest">
                      DJAIR_KERNEL_READY<br/>
                      ENCRYPTION_ACTIVE
                   </p>
                </div>
            </div>
          </div>

          {/* Right Side: Step Content (Lg: 8 cols) */}
          <div className="lg:col-span-8 p-10 lg:p-16 flex flex-col justify-center relative bg-[#F8FAFC]/50">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 animate-bounce">
                        <CheckCircle className="text-green-600" size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter">Mission Success</h2>
                    <p className="text-[#475569] max-w-sm mx-auto">Core services and admin session established. Launching command center...</p>
                </motion.div>
              ) : step === 1 ? (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-[#0369A1] italic tracking-tighter uppercase">Establish Authority</h2>
                    <p className="text-[#475569] text-sm">Create the root administrator account to take control of the platform.</p>
                  </div>
                  <div className="space-y-4">
                    <InputField label="Full Name" icon={<User size={18}/>} value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} placeholder="e.g. Master Admin" />
                    <InputField label="Admin Email" icon={<Mail size={18}/>} value={formData.email} onChange={v => setFormData({...formData, email: v})} placeholder="admin@djairindia.com" />
                    <InputField label="Vault Password" icon={<Lock size={18}/>} value={formData.password} type="password" onChange={v => setFormData({...formData, password: v})} placeholder="••••••••" />
                    <button onClick={() => setStep(2)} className="w-full bg-[#0369A1] hover:bg-[#0C4A6E] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 uppercase text-xs tracking-[0.2em] shadow-lg shadow-sky-900/10">
                        Continue to Config <ArrowRight size={18}/>
                    </button>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-[#0369A1] italic tracking-tighter uppercase">Brand Config</h2>
                    <p className="text-[#475569] text-sm">Fine-tune the global deployment personality for DJAIRINDIA.</p>
                  </div>
                  <div className="space-y-4">
                    <InputField label="Platform Name" icon={<Globe size={18}/>} value={formData.siteName} onChange={v => setFormData({...formData, siteName: v})} placeholder="DJAIRINDIA PVT LTD" />
                    <div className="p-6 bg-[#1A3D24]/5 border border-[#1A3D24]/10 rounded-2xl text-[#1A3D24] text-xs leading-relaxed italic">
                        "This will populate SEO metadata and global platform headers. You can refine these further in the Site Settings."
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button onClick={() => setStep(1)} className="flex-1 bg-white hover:bg-slate-50 text-[#475569] border border-[#E2E8F0] font-bold py-4 rounded-2xl transition-all uppercase text-xs">Back</button>
                        <button onClick={() => setStep(3)} className="flex-[2] bg-[#1A3D24] hover:bg-[#112616] text-white font-black py-4 rounded-2xl transition-all uppercase text-xs flex items-center justify-center gap-2 tracking-[0.2em] shadow-lg shadow-green-900/10">Initialize <ArrowRight size={18}/></button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="step3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 animate-pulse">
                        <ShieldCheck className="text-[#1A3D24]" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#1A3D24] italic tracking-tighter uppercase">Final Validation</h2>
                        <p className="text-[#475569] text-sm">Verify your credentials before permanently locking the setup portal.</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl space-y-2 text-left border border-[#E2E8F0] shadow-sm">
                        <div className="flex justify-between text-xs"><span className="text-[#64748B]">Root Admin:</span> <span className="text-[#1A3D24] font-bold">{formData.email}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-[#64748B]">Platform:</span> <span className="text-[#1A3D24] font-bold">{formData.siteName}</span></div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setStep(2)} className="flex-1 bg-white hover:bg-slate-100 text-[#475569] border border-[#E2E8F0] font-bold py-4 rounded-2xl transition-all uppercase text-xs">Back</button>
                        <button 
                            onClick={handleSetup} 
                            disabled={submitting}
                            className="flex-[2] bg-[#1A3D24] hover:bg-[#112616] text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-[0.2em] shadow-xl shadow-green-900/20"
                        >
                            {submitting ? 'Initializing...' : 'Confirm & Deploy'}
                        </button>
                    </div>
                    {error && <p className="text-red-600 text-[10px] font-bold uppercase mt-4 tracking-widest">{error}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-[#1A3D24]/60 uppercase tracking-widest pl-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#1A3D24] text-[#94A3B8] transition-colors">{icon}</div>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 bg-white border border-[#E2E8F0] rounded-2xl focus:ring-2 focus:ring-[#1A3D24]/10 focus:border-[#1A3D24] outline-none text-[#1A3D24] text-sm font-medium transition-all placeholder:text-[#94A3B8]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default AdminSetup;
