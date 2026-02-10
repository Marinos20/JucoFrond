
import React, { useState, useEffect } from 'react';
import { 
    Bell, Send, Megaphone, Search, Plus, User, Clock, 
    ShieldAlert, X, Loader2, CheckCircle2, MessageSquare, 
    Users, LayoutGrid, Info, ShieldCheck
} from 'lucide-react';
import { api } from '../../../services/api';

export const NotificationsView = () => {
  const [activeTab, setActiveTab] = useState('official'); // official, announce, support
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeType, setComposeType] = useState('announce'); // support, announce
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [announceData, setAnnounceData] = useState({ target: 'all', target_id: '', subject: '', content: '' });
  const [supportData, setSupportData] = useState({ subject: '', content: '' });

  const [classes, setClasses] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchNotifications();
    fetchContextData();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
        const res = await api.notifications.getAll();
        setNotifications(res.data || []);
    } catch (e) { 
        console.error(e); 
    } finally { 
        setIsLoading(false); 
    }
  };

  const fetchContextData = async () => {
      try {
          const years = await api.academic.getYears(user.school_id);
          const active = years.data?.find(y => y.is_active === 1);
          if (active) {
              const res = await api.academic.getClasses(active.id);
              setClasses(res.data || []);
          }
      } catch(e) {}
  };

  const handleSendSupport = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          await api.notifications.sendToSupport(supportData);
          setSupportData({ subject: '', content: '' });
          setIsComposeOpen(false);
          fetchNotifications();
          alert("Message envoyé au support !");
      } catch (e) { alert(e.message); }
      finally { setIsSubmitting(false); }
  };

  const handleSendAnnounce = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          await api.notifications.sendAnnounce(announceData);
          setAnnounceData({ target: 'all', target_id: '', subject: '', content: '' });
          setIsComposeOpen(false);
          fetchNotifications();
          alert("Annonce publiée aux parents !");
      } catch (e) { alert(e.message); }
      finally { setIsSubmitting(false); }
  };

  const filteredNotifs = notifications.filter(n => {
      if (activeTab === 'official') return n.type === 'broadcast' || n.receiver_type === 'all_schools' || n.receiver_type === 'all_users';
      if (activeTab === 'support') return n.type === 'support';
      if (activeTab === 'announce') return n.type === 'announcement';
      return true;
  });

  const getUnreadCount = (type) => {
      return notifications.filter(n => !n.is_read && (
          (type === 'official' && (n.type === 'broadcast' || n.receiver_type === 'all_schools' || n.receiver_type === 'all_users')) ||
          (type === 'support' && n.type === 'support') ||
          (type === 'announce' && n.type === 'announcement')
      )).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Centre de Messages</h2>
          <p className="text-slate-500 text-sm font-medium">Gestion des communications officielles et annonces.</p>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => { setComposeType('support'); setIsComposeOpen(true); }}
                className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
            >
                <ShieldAlert size={18} className="text-amber-500" /> Support
            </button>
            <button 
                onClick={() => { setComposeType('announce'); setIsComposeOpen(true); }}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl flex items-center gap-2"
            >
                <Megaphone size={18} /> Diffuser
            </button>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        {[
            { id: 'official', label: 'Officiel', icon: <ShieldCheck size={16}/> },
            { id: 'announce', label: 'Annonces Parents', icon: <Users size={16}/> },
            { id: 'support', label: 'Support Équipe', icon: <MessageSquare size={16}/> }
        ].map(tab => {
            const unread = getUnreadCount(tab.id);
            return (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 relative ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {tab.icon} {tab.label}
                    {unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">{unread}</span>}
                </button>
            );
        })}
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[400px] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
            {isLoading ? (
                <div className="flex justify-center py-24"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>
            ) : filteredNotifs.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-slate-300">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Info size={40} className="opacity-20" />
                    </div>
                    <p className="font-bold text-lg">Aucun message dans cette catégorie</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-50">
                    {filteredNotifs.map(msg => (
                        <div key={msg.id} className={`p-8 hover:bg-slate-50/50 transition-colors flex gap-8 ${!msg.is_read ? 'bg-indigo-50/20' : ''}`}>
                            <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-sm ${
                                msg.type === 'broadcast' || msg.receiver_type === 'all_schools' ? 'bg-indigo-900 text-white' : 
                                msg.type === 'announcement' ? 'bg-emerald-100 text-emerald-600' : 
                                'bg-amber-100 text-amber-600'
                            }`}>
                                {msg.type === 'broadcast' || msg.receiver_type === 'all_schools' ? <ShieldCheck /> : msg.type === 'announcement' ? <Megaphone /> : <MessageSquare />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{msg.subject}</h4>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <Clock size={14} /> {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-base">{msg.content}</p>
                                
                                {msg.type === 'broadcast' && (
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                                        Communication Siège ScolarPay
                                    </div>
                                )}
                            </div>
                            {!msg.is_read && <div className="w-3 h-3 bg-indigo-600 rounded-full mt-2 shadow-lg animate-pulse"></div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {isComposeOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsComposeOpen(false)} />
              <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-8 border-b flex justify-between items-center bg-slate-900 text-white">
                      <h3 className="text-xl font-black flex items-center gap-3">
                        {composeType === 'support' ? <ShieldAlert size={24} /> : <Megaphone size={24} />}
                        {composeType === 'support' ? 'Demande au Support' : 'Diffusion Parents'}
                      </h3>
                      <button onClick={() => setIsComposeOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
                  </div>
                  
                  <form onSubmit={composeType === 'support' ? handleSendSupport : handleSendAnnounce} className="p-10 space-y-6">
                      {composeType === 'announce' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Audience</label>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <button type="button" onClick={() => setAnnounceData({...announceData, target: 'all'})} className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${announceData.target === 'all' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}>Établissement Complet</button>
                                <button type="button" onClick={() => setAnnounceData({...announceData, target: 'class'})} className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${announceData.target === 'class' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Classe Précise</button>
                            </div>
                            {announceData.target === 'class' && (
                                <select required className="w-full mt-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white" value={announceData.target_id} onChange={e => setAnnounceData({...announceData, target_id: e.target.value})}>
                                    <option value="">Sélectionnez la classe cible...</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            )}
                          </div>
                      )}

                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Sujet</label>
                          <input required placeholder="Sujet du message" 
                            value={composeType === 'support' ? supportData.subject : announceData.subject}
                            onChange={e => composeType === 'support' ? setSupportData({...supportData, subject: e.target.value}) : setAnnounceData({...announceData, subject: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Contenu du message</label>
                          <textarea required rows={5} placeholder="Rédigez votre message ici..." 
                             value={composeType === 'support' ? supportData.content : announceData.content}
                             onChange={e => composeType === 'support' ? setSupportData({...supportData, content: e.target.value}) : setAnnounceData({...announceData, content: e.target.value})}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none" />
                      </div>

                      <button disabled={isSubmitting} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 group shadow-xl shadow-slate-200">
                          {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20} className="group-hover:translate-x-1 transition-transform"/> Envoyer le message</>}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
