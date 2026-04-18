import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Clock, Mail, ChevronLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Maintenance = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#F9FAF8] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="mb-8 flex justify-center">
          <motion.div 
            animate={{ 
              rotate: [0, -10, 0, 10, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-6 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 relative"
          >
            <div className="absolute inset-0 bg-green-500/10 rounded-[2.5rem] animate-pulse" />
            <Hammer size={48} className="text-[#1A3D24] relative z-10" />
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
          Under <span className="text-[#1A3D24]">Maintenance</span>
        </h1>
        
        <p className="text-lg text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed">
          We're currently fine-tuning our platform to give you a better experience. 
          Some parts of {settings.siteName || 'DCLUB FARMERS'} are temporarily offline.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm flex items-center gap-4 text-left">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expected Back</p>
              <p className="text-sm font-bold text-slate-700">In a few hours</p>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm flex items-center gap-4 text-left">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Contact</p>
              <p className="text-sm font-bold text-slate-700">{settings.contactEmail || 'support@dclub.com'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 bg-[#1A3D24] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-green-900/10 hover:shadow-green-900/20 hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft size={18} />
            Back to Home
          </button>
          
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">System Status: Updating</span>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} {settings.siteName}</p>
      </div>
    </div>
  );
};

export default Maintenance;
