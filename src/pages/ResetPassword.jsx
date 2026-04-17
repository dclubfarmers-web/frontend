import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Lock, CheckCircle, Save, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#ECFEFF] flex items-center justify-center p-6 font-['Fira_Sans']">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-cyan-100 animate-in slide-in-from-bottom-8 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-cyan-100">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-cyan-900">Reset Password</h2>
          <p className="text-cyan-600 mt-2 text-sm">Please choose a secure new password for your account.</p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-cyan-900">Success!</h3>
            <p className="text-sm text-cyan-600">Your password has been updated. Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-cyan-50/50 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-cyan-50/50 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              <Save size={18} />
              {loading ? 'Saving Changes...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
