import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#ECFEFF] flex items-center justify-center p-6 font-['Fira_Sans']">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-cyan-100 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold text-cyan-900">Forgot Password?</h2>
          <p className="text-cyan-600 mt-2 text-sm text-balance">No worries! Enter your email and we'll send you a link to reset your account.</p>
        </div>

        {sent ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-3 justify-center">
              <CheckCircle size={20} />
              <span className="font-bold">Reset link sent!</span>
            </div>
            <p className="text-sm text-cyan-500">Please check your inbox at <span className="font-bold text-cyan-800">{email}</span>. Don't forget to check your spam folder.</p>
            <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-800 transition-colors">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">{error}</div>}
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-cyan-500 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-cyan-50/50 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 font-bold text-sm hover:text-cyan-800 transition-colors">
                <ArrowLeft size={16} /> I remember my password
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
