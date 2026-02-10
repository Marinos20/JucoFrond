import React, { useEffect, useState, useMemo } from 'react';
import { 
  Plus, MoreHorizontal, MapPin, Mail, CheckCircle2, 
  XCircle, Loader2, Edit2, Trash2, Power, ArrowUpDown,
  Building, User, Lock, X, Globe, Phone
} from 'lucide-react';
import { api } from '../../../services/api';
import { DataTable } from '../../ui/DataTable';
import { Button } from '../../ui/button';

export const SchoolsView = () => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'

  // Filtre de statut (Externe au DataTable pour garder la cohérence avec le design précédent)
  const [statusFilter, setStatusFilter] = useState('all');

  // Form State
  const [formData, setFormData] = useState({ 
      id: null,
      name: '', address: '', phone: '', email: '', logo_url: '', status: 'active',
      admin_name: '', admin_email: '', password: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chargement des données
  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const response = await api.admin.getAllSchools();
      setSchools(response.data || []);
    } catch (error) {
      console.error("Failed to fetch schools", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, []);

  // --- ACTIONS LOGIC ---
  const handleOpenCreate = () => {
      setFormMode('create');
      setFormData({ 
        id: null, name: '', address: '', phone: '', email: '', logo_url: '', status: 'active',
        admin_name: '', admin_email: '', password: '' 
      });
      setIsModalOpen(true);
  };

  const handleOpenEdit = (school) => {
      setFormMode('edit');
      setFormData({
          id: school.id,
          name: school.name,
          address: school.address,
          phone: school.phone,
          email: school.email,
          logo_url: school.logo_url || '',
          status: school.status || 'active',
          admin_name: school.admin_name || '', 
          admin_email: school.admin_email || '', 
          password: '' 
      });
      setIsModalOpen(true);
  };

  const handleStatusToggle = async (school) => {
      const newStatus = school.status === 'active' ? 'inactive' : 'active';
      if(window.confirm(`Voulez-vous vraiment ${newStatus === 'active' ? 'activer' : 'désactiver'} ${school.name} ?`)) {
          try {
              await api.admin.updateSchool(school.id, { ...school, status: newStatus });
              fetchSchools();
          } catch (e) {
              alert("Erreur: " + e.message);
          }
      }
  };

  const handleDelete = async (school) => {
      if(window.confirm(`ATTENTION : Cela supprimera définitivement le projet "${school.name}" et toutes ses données. Continuer ?`)) {
          try {
              await api.admin.deleteSchool(school.id);
              fetchSchools();
          } catch (e) {
              alert("Erreur suppression: " + e.message);
          }
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          if (formMode === 'create') {
              await api.admin.createSchool(formData);
          } else {
              await api.admin.updateSchool(formData.id, formData);
          }
          await fetchSchools();
          setIsModalOpen(false);
      } catch (error) {
          alert("Erreur: " + (error.message || "Opération échouée"));
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- DATATABLE COLUMNS ---
  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-slate-900 transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Financement <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs uppercase overflow-hidden shrink-0 shadow-sm border border-slate-100">
            {row.original.logo_url ? <img src={row.original.logo_url} alt="" className="w-full h-full object-cover"/> : row.original.name.substring(0, 2)}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base">{row.getValue("name")}</div>
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase mt-0.5">
              <MapPin className="h-3 w-3" /> {row.original.address}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "admin_name",
      header: "Admin Principal",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-bold text-slate-700 text-sm">{row.getValue("admin_name") || 'Non défini'}</div>
          <div className="text-slate-400 text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-tight">
            <Mail className="h-3 w-3" /> {row.original.admin_email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const isActive = status === 'active';
        return (
          <div className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[10px] font-black uppercase border ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
            {isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {isActive ? 'Actif' : 'Inactif'}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right pr-6">Gestion</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 pr-4">
           <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row.original)} className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
             <Edit2 className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="icon" onClick={() => handleStatusToggle(row.original)} className={`h-9 w-9 rounded-xl ${row.original.status === 'active' ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}>
             <Power className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)} className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50">
             <Trash2 className="h-4 w-4" />
           </Button>
        </div>
      ),
    },
  ], []);

  // --- FILTRAGE PAR STATUT ---
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return schools;
    return schools.filter(s => s.status === statusFilter);
  }, [schools, statusFilter]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Réseau finance</h2>
          <p className="text-slate-500 font-medium mt-1">Supervision globale et administration des projets   partenaires.</p>
        </div>
        <Button 
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center gap-2 group transition-all"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Nouveau Projet
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full md:w-fit shadow-inner">
                {[
                    { id: 'all', label: 'Tous les projets' },
                    { id: 'active', label: 'Actifs uniquement' },
                    { id: 'inactive', label: 'Inactifs' }
                ].map(f => (
                    <button 
                        key={f.id}
                        onClick={() => setStatusFilter(f.id)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${statusFilter === f.id ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {f.label}
                    </button>
                ))}
          </div>
      </div>

      {/* DATA TABLE */}
      {isLoading && schools.length === 0 ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-indigo-600 h-12 w-12 opacity-30" /></div>
      ) : (
        <div className="animate-in fade-in duration-500">
            <DataTable 
                columns={columns} 
                data={filteredData} 
                filterPlaceholder="Rechercher par nom de projet  ou financement..." 
                searchColumn="name"
            />
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                    <h3 className="font-bold flex items-center gap-3 text-xl tracking-tight">
                        <Building size={24} />
                        {formMode === 'create' ? 'Nouveau financement' : 'Modifier les infos'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-10 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Section École */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Globe size={18} /></div>
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Fiche d'identité</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase pl-2">Nom du Projet </label>
                                    <input required placeholder="Ex: Projet International sur le developpement climatique" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase pl-2">Adresse physique</label>
                                    <input required placeholder="Quartier, Ville" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase pl-2">Téléphone</label>
                                    <input required placeholder="+229 ..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase pl-2">Email officiel</label>
                                    <input required placeholder="contact@ecole.bj" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase pl-2">Lien Logo (URL)</label>
                                    <input placeholder="https://..." value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Section Admin */}
                        {formMode === 'create' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><User size={18} /></div>
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Compte Administrateur</h4>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase pl-2">Nom du Responsable</label>
                                        <input required placeholder="M. le Directeur / Mme. la Secrétaire" value={formData.admin_name} onChange={e => setFormData({...formData, admin_name: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase pl-2">Email de connexion</label>
                                            <input required type="email" placeholder="admin@unioneuropeenne.eu" value={formData.admin_email} onChange={e => setFormData({...formData, admin_email: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase pl-2">Mot de passe temporaire</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input required type="text" placeholder="Générez un mot de passe" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="pt-6">
                            <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black active:scale-[0.98] shadow-2xl transition-all flex items-center justify-center gap-3">
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        <CheckCircle2 size={24} />
                                        {formMode === 'create' ? 'Déployer le projet' : 'Sauvegarder les modifications'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
         </div>
      )}
    </div>
  );
};