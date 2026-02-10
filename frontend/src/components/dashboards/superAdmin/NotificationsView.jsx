import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  Loader2,
  Clock,
  ShieldAlert,
  MessageSquare,
  Megaphone,
  X,
  Info,
  Filter,
  Search
} from 'lucide-react';
import { api } from '../../../services/api';

export const NotificationsView = () => {
  const [activeTab, setActiveTab] = useState('requests'); // requests | history
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [broadcastData, setBroadcastData] = useState({
    target: 'all_schools',
    subject: '',
    content: ''
  });

  /* =========================
     FETCH NOTIFICATIONS (✔ BACKEND ALIGNED)
  ========================= */
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.notifications.getMy();
      setNotifications(res?.data || []);
    } catch (e) {
      console.error('FETCH NOTIFICATIONS ERROR:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* =========================
     SEND BROADCAST
  ========================= */
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.notifications.broadcast(broadcastData);
      setBroadcastData({ target: 'all_schools', subject: '', content: '' });
      setIsBroadcastOpen(false);
      await fetchNotifications();
      alert('Message diffusé avec succès !');
    } catch (e) {
      alert(e.message || "Erreur lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     MARK AS READ
  ========================= */
  const markAsRead = async (notif) => {
    if (notif.is_read) return;
    try {
      await api.notifications.markRead(notif.id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notif.id ? { ...n, is_read: 1 } : n
        )
      );
    } catch (e) {
      console.error('MARK AS READ ERROR:', e);
    }
  };

  /* =========================
     FILTERS
  ========================= */
  const requests = notifications.filter(
    n => n.receiver_type === 'super_admin'
  );

  const history = notifications.filter(
    n => n.type === 'broadcast'
  );

  const currentList = activeTab === 'requests' ? requests : history;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900">Communications</h2>
          <p className="text-slate-500 text-sm">
            Gérez les alertes globales et les demandes de financement
          </p>
        </div>
        <button
          onClick={() => setIsBroadcastOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2"
        >
          <Megaphone size={18} />
          Diffuser une alerte
        </button>
      </div>

      {/* TABS */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <ShieldAlert size={16} />
          Requêtes
          {requests.some(r => !r.is_read) && (
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <Clock size={16} />
          Historique
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] min-h-[500px] overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
          </div>
        ) : currentList.length === 0 ? (
          <div className="py-32 text-center text-slate-300">
            <Info size={40} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">Aucun message pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {currentList.map(notif => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif)}
                className={`p-8 flex gap-8 cursor-pointer transition-colors ${
                  !notif.is_read && activeTab === 'requests'
                    ? 'bg-indigo-50/30'
                    : 'hover:bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-sm ${
                    notif.type === 'broadcast'
                      ? 'bg-indigo-900 text-white'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {notif.type === 'broadcast'
                    ? <Megaphone />
                    : <MessageSquare />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-xl font-black text-slate-900">
                      {notif.subject}
                    </h4>
                    <span className="text-xs text-slate-400 font-bold">
                      <Clock size={14} className="inline mr-1" />
                      {new Date(notif.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  <p className="text-slate-600 mb-4">
                    {notif.content}
                  </p>

                  {notif.type === 'broadcast' && (
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <CheckCircle2 size={12} />
                      Cible : {notif.receiver_type}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL BROADCAST */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setIsBroadcastOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl">
            <div className="p-8 bg-slate-900 text-white flex justify-between">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <Megaphone size={24} />
                Diffusion Globale
              </h3>
              <button onClick={() => setIsBroadcastOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-10 space-y-6">
              <input
                required
                placeholder="Objet"
                value={broadcastData.subject}
                onChange={e =>
                  setBroadcastData({ ...broadcastData, subject: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold"
              />

              <textarea
                required
                rows={6}
                placeholder="Message"
                value={broadcastData.content}
                onChange={e =>
                  setBroadcastData({ ...broadcastData, content: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl"
              />

              <button
                disabled={isSubmitting}
                className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black"
              >
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
