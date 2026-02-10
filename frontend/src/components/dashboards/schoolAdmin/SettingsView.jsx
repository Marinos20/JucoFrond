
import React, { useState, useEffect } from 'react';
import { User, Calendar, Check, AlertCircle, Plus, Loader2, ToggleLeft, ToggleRight, ShieldAlert, Layers } from 'lucide-react';
import { api } from '../../../services/api';

export const SettingsView = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const schoolId = user.school_id;

  const [years, setYears] = useState([]);
  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYear, setNewYear] = useState({ name: '', start_date: '', end_date: '', period_type: 'Trimestre' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      if(schoolId) fetchYears();
  }, [schoolId]);

  const fetchYears = async () => {
      setIsLoadingYears(true);
      try {
          const res = await api.academic.getYears(schoolId);
          setYears(res.data || []);
      } catch(e) { console.error(e); } finally { setIsLoadingYears(false); }
  };

  const handleCreateYear = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          await api.academic.createYear({ ...newYear, school_id: schoolId });
          setShowAddYear(false);
          setNewYear({ name: '', start_date: '', end_date: '', period_type: 'Trimestre' });
          fetchYears();
      } catch(e) { alert("Erreur: " + e.message); } finally { setIsSubmitting(false); }
  };

  const handleActivateYear = async (yearId) => {
      if(!window.confirm("Changer l'année active masquera les projets des années précédentes. Continuer ?")) return;
      try {
          await api.academic.setActiveYear(yearId, schoolId);
          fetchYears();
      } catch(e) { alert("Erreur: " + e.message); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Paramètres Projet</h2>
        <p className="text-slate-500 text-sm">Configurez vos cycles et votre profil.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" /> Années Académiques
                    </h3>
                </div>
                <button onClick={() => setShowAddYear(!showAddYear)} className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nouvelle Année
                </button>
             </div>

             {showAddYear && (
                 <form onSubmit={handleCreateYear} className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-2 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nom de l'année</label>
                             <input required placeholder="Ex: 2024-2025" value={newYear.name} onChange={e => setNewYear({...newYear, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
                         </div>
                         <div className="space-y-1">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Type de Période</label>
                             <select value={newYear.period_type} onChange={e => setNewYear({...newYear, period_type: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm outline-none bg-white">
                                 <option value="Trimestre">Trimestre (3 périodes)</option>
                                 <option value="Semestre">Semestre (2 périodes)</option>
                             </select>
                         </div>
                         <div className="space-y-1">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Date de début</label>
                             <input required type="date" value={newYear.start_date} onChange={e => setNewYear({...newYear, start_date: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm outline-none" />
                         </div>
                         <div className="space-y-1">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Date de fin</label>
                             <input required type="date" value={newYear.end_date} onChange={e => setNewYear({...newYear, end_date: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-sm outline-none" />
                         </div>
                     </div>
                     <div className="flex justify-end gap-3 pt-2">
                         <button type="button" onClick={() => setShowAddYear(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl">Annuler</button>
                         <button disabled={isSubmitting} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg">
                             {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Créer l\'année'}
                         </button>
                     </div>
                 </form>
             )}

             {isLoadingYears ? (
                 <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-300" /></div>
             ) : (
                 <div className="space-y-3">
                     {years.map(year => (
                         <div key={year.id} className={`flex items-center justify-between p-5 rounded-2xl border ${year.is_active ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                             <div>
                                 <div className="flex items-center gap-2">
                                     <span className="font-bold text-slate-900 text-lg">{year.name}</span>
                                     <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded flex items-center gap-1">
                                        <Layers size={10} /> {year.period_type}
                                     </span>
                                     {year.is_active && <span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-3 py-1 rounded-full shadow-sm ml-2">Année en cours</span>}
                                 </div>
                                 <div className="text-xs text-slate-400 font-medium mt-1">Du {new Date(year.start_date).toLocaleDateString()} au {new Date(year.end_date).toLocaleDateString()}</div>
                             </div>
                             {!year.is_active && (
                                 <button onClick={() => handleActivateYear(year.id)} className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-transparent hover:border-indigo-100 transition-all">
                                     <ToggleLeft size={20} /> Activer
                                 </button>
                             )}
                         </div>
                     ))}
                 </div>
             )}
        </div>
    </div>
  );
};
