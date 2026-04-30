import { useState } from 'react';
import api from '../utils/api';

export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [fileKey, setFileKey] = useState('');

    const upload = async (file, folder = 'general') => {
        if (!file) return null;
        
        // Strict PDF validation for career and dpr documents
        if (file.type !== 'application/pdf') {
            const msg = 'Only PDF documents are allowed for this upload.';
            setError(msg);
            throw new Error(msg);
        }
        
        setUploading(true);
        setError(null);
        
        const data = new FormData();
        data.append('folder', folder);
        data.append('file', file);

        try {
            const res = await api.post('/api/upload', data);
            setFileUrl(res.url);
            setFileKey(res.key);
            setUploading(false);
            return { url: res.url, key: res.key };
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Upload failed';
            setError(msg);
            setUploading(false);
            throw new Error(msg);
        }
    };

    return { upload, uploading, error, fileUrl, setFileUrl, fileKey, setFileKey };
};
