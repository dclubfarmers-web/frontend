import React, { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck, AlertCircle, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-6 font-['Fira_Sans'] relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1A3D24] opacity-5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0EA5E9] opacity-5 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-green-100 rounded-[3rem] shadow-xl shadow-green-900/5 overflow-hidden"
        >
          <div className="p-10 lg:p-12 space-y-8">
            <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-[#1A3D24] rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                  <Rocket className="text-white" size={40} />
               </div>
               <div className="space-y-1">
                 <h2 className="text-3xl font-black text-[#1A3D24] italic tracking-tighter uppercase leading-none">DJAIRINDIA</h2>
                 <p className="text-[#1A3D24] text-[10px] font-bold tracking-[0.4em] uppercase">Security Gateway</p>
               </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold leading-tight">
                  <AlertCircle size={20} /> {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#475569] uppercase tracking-widest pl-1">Admin Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#1A3D24] transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="name@djairindia.com"
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:ring-2 focus:ring-[#1A3D24]/20 focus:border-[#1A3D24] outline-none text-[#1A3D24] font-medium transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#475569] uppercase tracking-widest pl-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#1A3D24] transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:ring-2 focus:ring-[#1A3D24]/20 focus:border-[#1A3D24] outline-none text-[#1A3D24] font-medium transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-[#1A3D24] hover:bg-[#1A3D24]/90 text-white font-black py-5 rounded-2xl shadow-lg shadow-green-900/10 transition-all active:scale-95 disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <><LogIn size={20} /> Establish Connection</>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
                <button onClick={() => navigate('/forgot-password')} className="text-xs text-[#64748B] hover:text-[#1A3D24] transition-colors font-bold tracking-widest underline underline-offset-4">Lost Credentials?</button>
            </div>
          </div>
          
          <div className="bg-[#F8FAFC] p-5 text-center border-t border-[#E2E8F0]">
             <p className="text-[10px] text-[#94A3B8] uppercase tracking-[0.3em] font-bold">Encrypted End-to-End</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
