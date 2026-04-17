import React, { useState } from 'react';
import { Upload, X, ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const ImageUpload = ({ value, onChange, label = "Upload Image" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.mimetype && !file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Using raw axios/fetch since we need to send multipart/form-data
      // Our api utility might need adjustment for file uploads or we can use it directly
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.url) {
        onChange(response.url);
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setError('Upload failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      
      <div className="flex flex-col gap-4">
        {value ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
             <img src={value} alt="Preview" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  type="button"
                  onClick={() => onChange('')}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
             </div>
             <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                <CheckCircle size={14} />
             </div>
          </div>
        ) : (
          <label className={`w-full h-48 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer gap-2 ${
            loading ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#0369A1]'
          }`}>
             {loading ? (
                <div className="flex flex-col items-center gap-2">
                   <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Uploading to Cloud...</p>
                </div>
             ) : (
                <>
                   <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
                      <ImageIcon size={32} />
                   </div>
                   <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">Click to Upload</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">PNG, JPG, WEBP (Max 10MB)</p>
                   </div>
                </>
             )}
             <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={loading} />
          </label>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
