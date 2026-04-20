import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ShieldCheck, User, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid invitation link.");
        setLoading(false);
        return;
      }

      try {
        const data = await api.get(`/api/invitations/${token}`);
        if (data) {
          setInvitation(data);
        } else {
          setError("This invitation has already been used or has expired.");
        }
      } catch (err) {
        setError(err.message || "Failed to verify invitation.");
      }
      setLoading(false);
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/api/invitations/accept', { 
        token, 
        fullName, 
        password 
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 4000);
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-[#ECFEFF] flex items-center justify-center font-bold text-cyan-600">Verifying invitation...</div>;

  return (
    <div className="min-h-screen bg-[#ECFEFF] flex items-center justify-center p-6 font-['Fira_Sans']">
      <div className="max-w-xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-cyan-100 scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Branding */}
        <div className="bg-cyan-700 p-8 text-white flex flex-col justify-between items-center text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={40} />
            </div>
            <div>
                <h2 className="text-2xl font-bold font-['Fira_Code'] mb-3">Admin Invitation</h2>
                <p className="text-sm opacity-80 leading-relaxed font-light">
                    You have been granted access to the DJAIRINDIA Administration system. Please set your password to activate your account.
                </p>
            </div>
            <div className="flex gap-1.5 mt-6">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 flex flex-col justify-center">
          {error ? (
              <div className="text-center py-6">
                  <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                  <h3 className="text-lg font-bold text-cyan-900 mb-2">Oops!</h3>
                  <p className="text-sm text-cyan-600">{error}</p>
                  <button onClick={() => navigate('/')} className="mt-6 text-sm font-bold text-cyan-700 hover:text-cyan-900 uppercase underline decoration-2 underline-offset-4">Return Home</button>
              </div>
          ) : success ? (
              <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95">
                  <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-cyan-900">Welcome Aboard!</h3>
                  <p className="text-sm text-cyan-600">Your admin account is ready. You will be redirected to the login page shortly.</p>
              </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="mb-4">
                  <label className="text-[10px] font-bold text-cyan-500 uppercase">Invited Email</label>
                  <p className="text-cyan-900 font-['Fira_Code'] font-bold text-sm bg-cyan-50 px-3 py-2 rounded-lg mt-1 border border-cyan-100">{invitation?.email}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-tighter">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2 bg-cyan-50/30 border border-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-tighter">Set Your Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300" size={16} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-cyan-50/30 border border-cyan-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={submitting}
                className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 mt-2"
              >
                {submitting ? 'Setting up...' : 'Activate Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
