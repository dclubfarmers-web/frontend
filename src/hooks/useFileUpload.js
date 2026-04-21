import { useState } from 'react';
import api from '../utils/api';

export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [fileUrl, setFileUrl] = useState('');

    const upload = async (file, folder = 'general') => {
        if (!file) return null;
        
        setUploading(true);
        setError(null);
        
        const data = new FormData();
        data.append('folder', folder);
        data.append('file', file);

        try {
            const res = await api.post('/api/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFileUrl(res.url);
            setUploading(false);
            return res.url;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Upload failed';
            setError(msg);
            setUploading(false);
            throw new Error(msg);
        }
    };

    return { upload, uploading, error, fileUrl, setFileUrl };
};
