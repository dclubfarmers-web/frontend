import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Briefcase, MapPin, Clock, Calendar, ChevronLeft,
    Send, FileText, CheckCircle2, AlertCircle, Info, Rocket
} from 'lucide-react';
// Force Refresh: 1776458273452
import api from '../utils/api';
import Loader from '../components/Loader';

import { useFileUpload } from '../hooks/useFileUpload';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const { upload, uploading } = useFileUpload();

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        summary: '',
        resumeUrl: '',
        resumeKey: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const data = await api.get(`/api/jobs/${id}`);
            setJob(data);
        } catch (err) {
            console.error('Job fetch failed:', err);
        }
        setLoading(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const { url, key } = await upload(file);
            setFormData(prev => ({ ...prev, resumeUrl: url, resumeKey: key }));
        } catch (err) {
            alert('File Upload Failed: ' + err.message);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/api/applications', {
                jobId: id,
                ...formData
            });
            setSuccess(true);
            setTimeout(() => navigate('/career'), 3000);
        } catch (err) {
            alert('Submission Error: ' + err.message);
        }
        setSubmitting(false);
    };

    if (loading) return <Loader fullPage />;
    if (!job) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <AlertCircle size={48} className="text-red-500" />
            <h2 className="text-xl font-bold">Position Not Found</h2>
            <button onClick={() => navigate('/career')} className="text-blue-600 font-bold underline">Back to Careers</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container max-w-4xl">
                <button
                    onClick={() => navigate('/career')}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#1A3D24] transition-all mb-8 font-bold text-sm uppercase tracking-widest"
                >
                    <ChevronLeft size={16} /> Back to Open Positions
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-green-50 text-[#1A3D24] rounded-full text-[10px] font-black uppercase tracking-widest">{job.job_type || 'Full Time'}</span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">{job.location}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                            <p className="text-lg text-[#1A3D24] font-bold mb-6 italic">{job.company}</p>

                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">Description & Mission</h3>
                                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {job.description || 'Join our mission to revolutionize the agricultural sector. We are looking for passionate individuals to join our expanding team.'}
                                </div>
                            </div>
                        </div>

                        {showForm && (
                            <div id="apply-form" className="bg-white p-8 rounded-3xl border-2 border-[#1A3D24] shadow-xl animate-scale-in">
                                {success ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="text-green-600" size={32} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Transmitted!</h2>
                                        <p className="text-slate-500">Thank you for your interest. Redirecting you back to careers...</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <FileText className="text-[#1A3D24]" /> Apply for this Position
                                        </h2>
                                        <form onSubmit={handleApply} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                                    <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#1A3D24]" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                                    <input required type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#1A3D24]" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                                <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#1A3D24]" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resume (PDF)</label>
                                                <div className="relative">
                                                    <input type="file" id="resume-upload" className="hidden" onChange={handleFileUpload} accept=".pdf" />
                                                    <label htmlFor="resume-upload" className={`flex flex-col items-center justify-center p-8 border-2 border-dashed ${formData.resumeUrl ? 'border-[#1A3D24] bg-green-50' : 'border-slate-200'} rounded-2xl cursor-pointer hover:border-[#1A3D24] transition-all group`}>
                                                        {uploading ? (
                                                            <Loader />
                                                        ) : (
                                                            <>
                                                                <Rocket className={`${formData.resumeUrl ? 'text-[#1A3D24]' : 'text-slate-300'} mb-2`} size={24} />
                                                                <span className="text-[10px] font-bold text-slate-500">{formData.resumeUrl ? 'Resume Attached' : 'Click to Upload PDF'}</span>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Personal Summary</label>
                                                <textarea rows="4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#1A3D24] resize-none" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
                                            </div>
                                            <button
                                                disabled={submitting}
                                                className="w-full bg-[#1A3D24] hover:bg-[#112616] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                                            >
                                                {submitting ? 'Transmitting Data...' : 'Submit Application'} <Send size={16} />
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-32">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <Info size={14} /> Employment Policy
                            </h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex gap-4">
                                    <div className="p-2 bg-green-50 rounded-lg h-fit text-[#1A3D24]"><Clock size={18} /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400">Response Time</p>
                                        <p className="text-sm font-bold text-slate-700">Usually 48 hours</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-2 bg-indigo-50 rounded-lg h-fit text-indigo-600"><Calendar size={18} /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400">Posted On</p>
                                        <p className="text-sm font-bold text-slate-700">{new Date(job.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-2 bg-emerald-50 rounded-lg h-fit text-emerald-600"><Briefcase size={18} /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400">Salary Bracket</p>
                                        <p className="text-sm font-bold text-slate-700">{job.salary || 'Competitive'}</p>
                                    </div>
                                </div>
                            </div>

                            {!showForm && (
                                <button
                                    onClick={() => { setShowForm(true); setTimeout(() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                                    className="w-full bg-[#1A3D24] hover:bg-[#0F1E12] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                                >
                                    Apply Now <Send size={16} />
                                </button>
                            )}

                            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1A3D24]">
                                    <Rocket size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Growth Track</p>
                                    <p className="text-xs font-bold text-slate-600">Enterprise Scale</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
