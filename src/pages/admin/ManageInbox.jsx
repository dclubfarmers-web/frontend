import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Mail, MessageSquare, Clock, Trash2, CheckCircle, Search, User } from 'lucide-react';

const ManageInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.get('/api/contacts');
      if (data) setMessages(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/api/contacts/${id}/read`);
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/api/contacts/${id}`);
      setMessages(messages.filter(m => m.id !== id));
    } catch (err) { alert(err.message); }
  };

  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.subject?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Inquiry Inbox</h2>
           <p className="text-xs text-slate-500">Manage messages from the contact form.</p>
        </div>
        <div className="relative flex-1 max-w-xs">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search messages..."
             className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
           <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div></div>
        ) : filteredMessages.length === 0 ? (
           <div className="py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl font-medium italic">No messages found in your inbox.</div>
        ) : filteredMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`bg-white border rounded-xl p-6 transition-all shadow-sm flex flex-col md:flex-row gap-6 ${msg.is_read ? 'border-slate-200' : 'border-blue-300 ring-1 ring-blue-50'}`}
          >
            <div className="flex-1 space-y-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${msg.is_read ? 'bg-slate-300' : 'bg-blue-500 animate-pulse'}`}></span>
                     <h4 className="font-bold text-slate-800">{msg.subject || 'General Inquiry'}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                     <Clock size={12}/> {new Date(msg.created_at).toLocaleString()}
                  </span>
               </div>
               
               <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
               
               <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                     <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-600">
                        <User size={12}/>
                     </div>
                     {msg.name} ({msg.email})
                  </div>
               </div>
            </div>

            <div className="flex md:flex-col items-center justify-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
               {!msg.is_read && (
                  <button 
                    onClick={() => handleMarkRead(msg.id)}
                    title="Mark as read"
                    className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100"
                  >
                    <CheckCircle size={20} />
                  </button>
               )}
               <button 
                onClick={() => handleDelete(msg.id)}
                title="Delete message"
                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"
               >
                 <Trash2 size={20} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageInbox;
