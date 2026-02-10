import React, { useState, useEffect, useMemo } from 'react';
import { 
    Wallet, CreditCard, ArrowDownLeft, Loader2, 
    TrendingUp, Plus, X, CheckCircle2, 
    Search, History, Users, Layers
} from 'lucide-react';
import { api } from '../../../services/api';
import { DataTable } from '../../ui/DataTable';
import { Button } from '../../ui/button';

export const FinanceView = () => {
  const [activeView, setActiveView] = useState('status'); // 'status' (Recouvrement) or 'history' (Flux)
  const [data, setData] = useState({ totalRevenue: 0, weekRevenue: 0, transactions: [] });
  const [studentsStatus, setStudentsStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtre de classe (Externe au DataTable pour la logique métier)
  const [selectedClass, setSelectedClass] = useState('all');

  // Modals
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  
  // Data lists
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classFees, setClassFees] = useState([]);
  
  // Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFee, setNewFee] = useState({ title: '', amount: '', class_id: '', due_date: '', is_mandatory: 1 });
  const [newPayment, setNewPayment] = useState({ student_id: '', fee_id: '', amount: '', method: 'Espèces', ref: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const schoolId = user.school_id;

  useEffect(() => {
      if(schoolId) {
          fetchInitialData();
      }
  }, [schoolId]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
        const [summaryRes, statusRes, yearsRes] = await Promise.all([
            api.finance.getSummary(schoolId),
            api.finance.getStudentsStatus(schoolId),
            api.academic.getYears(schoolId)
        ]);

        setData(summaryRes.data);
        setStudentsStatus(statusRes.data || []);
        
        const activeYear = yearsRes.data.find(y => y.is_active === 1);
        if (activeYear) {
            const classesRes = await api.academic.getClasses(activeYear.id);
            setClasses(classesRes.data);
        }
        
        const studentsRes = await api.students.getBySchool(schoolId);
        setStudents(studentsRes.data);

    } catch(e) { 
        console.error(e); 
    } finally { 
        setIsLoading(false); 
    }
  };

  // --- DÉFINITION DES COLONNES POUR LE RECOUVREMENT ---
  const statusColumns = useMemo(() => [
    {
        accessorKey: "last_name",
        header: "Identité Élève",
        cell: ({ row }) => (
            <div className="py-1">
                <div className="font-bold text-slate-900">{row.original.first_name} {row.original.last_name}</div>
                <div className="text-[10px] text-slate-400 font-bold font-mono uppercase italic">{row.original.matricule}</div>
            </div>
        )
    },
    {
        accessorKey: "class_name",
        header: "Classe",
        cell: ({ row }) => <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">{row.getValue("class_name")}</span>
    },
    {
        id: "progression",
        header: "Progression",
        cell: ({ row }) => {
            const s = row.original;
            const percent = s.total_due > 0 ? Math.round((s.total_paid / s.total_due) * 100) : 0;
            const isSolded = s.remaining_balance <= 0 && s.total_due > 0;
            return (
                <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className={isSolded ? 'text-emerald-600' : 'text-slate-400'}>{percent}%</span>
                        {isSolded && <CheckCircle2 size={12} className="text-emerald-500" />}
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${isSolded ? 'bg-emerald-500' : percent > 50 ? 'bg-indigo-500' : 'bg-amber-500'}`} 
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "total_due",
        header: "Total Dû",
        cell: ({ row }) => <span className="font-bold text-slate-500">{parseInt(row.getValue("total_due")).toLocaleString()} F</span>
    },
    {
        accessorKey: "total_paid",
        header: "Payé",
        cell: ({ row }) => <span className="font-black text-indigo-600">{parseInt(row.getValue("total_paid")).toLocaleString()} F</span>
    },
    {
        accessorKey: "remaining_balance",
        header: "Solde",
        cell: ({ row }) => {
            const balance = parseInt(row.getValue("remaining_balance"));
            const isSolded = balance <= 0;
            return (
                <span className={`font-black text-base ${isSolded ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isSolded ? 'SOLDÉ' : `${balance.toLocaleString()} F`}
                </span>
            );
        }
    }
  ], []);

  // --- DÉFINITION DES COLONNES POUR L'HISTORIQUE ---
  const historyColumns = useMemo(() => [
    {
        accessorKey: "id",
        header: "Réf",
        cell: ({ row }) => <span className="font-mono text-xs text-slate-400">#{row.getValue("id").slice(0,6)}</span>
    },
    {
        accessorKey: "last_name",
        header: "Élève",
        cell: ({ row }) => (
            <div className="py-1">
                <div className="font-bold text-slate-900">{row.original.first_name} {row.original.last_name}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{row.original.matricule}</div>
            </div>
        )
    },
    {
        accessorKey: "fee_title",
        header: "Motif",
        cell: ({ row }) => <span className="text-slate-600 font-medium">{row.getValue("fee_title") || 'Scolarité'}</span>
    },
    {
        accessorKey: "payment_method",
        header: "Méthode",
        cell: ({ row }) => (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${row.getValue("payment_method") === 'Espèces' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {row.getValue("payment_method")}
            </span>
        )
    },
    {
        accessorKey: "payment_date",
        header: "Date",
        cell: ({ row }) => <span className="text-slate-400 font-medium text-xs">{new Date(row.getValue("payment_date")).toLocaleDateString()}</span>
    },
    {
        accessorKey: "amount_paid",
        header: "Montant",
        cell: ({ row }) => <span className="font-black text-slate-900 text-base">{parseInt(row.getValue("amount_paid")).toLocaleString()} F</span>
    }
  ], []);

  // --- LOGIQUE DE FILTRAGE EXTERNE (CLASSE) ---
  const filteredData = useMemo(() => {
    let result = activeView === 'status' ? studentsStatus : data.transactions;
    if (selectedClass !== 'all') {
        result = result.filter(item => item.current_class_id === selectedClass);
    }
    return result;
  }, [activeView, studentsStatus, data.transactions, selectedClass]);

  // Actions Formulaires
  const handleAddFee = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          await api.finance.createFee({ ...newFee, due_date: newFee.due_date || null });
          setIsFeeModalOpen(false);
          setNewFee({ title: '', amount: '', class_id: '', due_date: '', is_mandatory: 1 });
          fetchInitialData();
          alert("Frais ajouté avec succès !");
      } catch(e) { alert("Erreur: " + e.message); } 
      finally { setIsSubmitting(false); }
  };

  const handleRecordPayment = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          await api.finance.recordPayment({
              student_id: newPayment.student_id,
              fee_id: newPayment.fee_id,
              amount_paid: newPayment.amount,
              payment_method: newPayment.method,
              transaction_ref: newPayment.ref || `MAN-${Date.now()}`
          });
          setIsPayModalOpen(false);
          setNewPayment({ student_id: '', fee_id: '', amount: '', method: 'Espèces', ref: '' });
          fetchInitialData();
          alert("Paiement enregistré !");
      } catch(e) { alert("Erreur: " + e.message); }
      finally { setIsSubmitting(false); }
  };

  if (isLoading) return <div className="flex justify-center p-32"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32">
       
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Trésorerie & Recouvrement</h2>
          <p className="text-slate-500 font-medium">Gestion précise des encaissements et audit financier.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsFeeModalOpen(true)} className="px-6 h-12 rounded-2xl font-bold border-slate-200">
                <Plus size={18} className="mr-2" /> Gérer les frais
            </Button>
            <Button onClick={() => setIsPayModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-2xl font-bold shadow-xl shadow-indigo-200">
                <Wallet size={18} className="mr-2" /> Encaisser
            </Button>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                 <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/5 text-[10px] font-bold uppercase w-fit backdrop-blur-md">
                     <TrendingUp size={12} className="text-indigo-400" /> Solde Global Encaissé
                 </div>
                 <div className="mt-8">
                     <div className="text-6xl font-black tracking-tighter mb-2">
                        {parseInt(data.totalRevenue || 0).toLocaleString()} <span className="text-2xl text-slate-400 font-medium">FCFA</span>
                     </div>
                     <p className="text-slate-400 font-medium italic opacity-70">Total des paiements validés sur l'année active</p>
                 </div>
             </div>
          </div>
          
          <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <ArrowDownLeft size={28} />
                </div>
                <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Derniers 7 jours</div>
                    <div className="text-4xl font-black text-slate-900 tracking-tight">
                        {parseInt(data.weekRevenue || 0).toLocaleString()} <span className="text-lg text-slate-300">F</span>
                    </div>
                </div>
          </div>
      </div>

      {/* TABS & FILTERS */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full lg:w-fit shadow-inner">
              <button 
                onClick={() => setActiveView('status')}
                className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeView === 'status' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <Users size={16} /> Recouvrement
              </button>
              <button 
                onClick={() => setActiveView('history')}
                className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeView === 'history' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <History size={16} /> Flux Transactionnels
              </button>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto px-2">
              <select 
                className="bg-white px-6 py-2.5 rounded-xl text-sm font-bold border border-slate-200 outline-none cursor-pointer focus:ring-4 focus:ring-indigo-500/5 transition-all h-12"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                  <option value="all">Filtrer par Classe : Toutes</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
          </div>
      </div>

      {/* DATA TABLE COMPONENT */}
      <DataTable 
        columns={activeView === 'status' ? statusColumns : historyColumns} 
        data={filteredData} 
        searchColumn="last_name"
        filterPlaceholder="Rechercher par nom d'élève..."
      />

      {/* MODALS SONT CONSERVÉS IDENTIQUES POUR GARDER LA FONCTIONNALITÉ */}
      {isFeeModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsFeeModalOpen(false)} />
              <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-8 border-b flex justify-between items-center bg-slate-900 text-white">
                      <h3 className="text-xl font-black">Nouveau Frais de Classe</h3>
                      <button onClick={() => setIsFeeModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
                  </div>
                  <form onSubmit={handleAddFee} className="p-8 space-y-5">
                      <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Libellé</label>
                          <input required placeholder="Scolarité Trimestre 1" value={newFee.title} onChange={e => setNewFee({...newFee, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:bg-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Montant</label>
                            <input required type="number" value={newFee.amount} onChange={e => setNewFee({...newFee, amount: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:bg-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Classe</label>
                            <select required value={newFee.class_id} onChange={e => setNewFee({...newFee, class_id: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none bg-white">
                                <option value="">Choisir...</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                      </div>
                      <button disabled={isSubmitting} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all">
                          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Créer le frais'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {isPayModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsPayModalOpen(false)} />
              <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-8 border-b flex justify-between items-center bg-indigo-600 text-white">
                      <h3 className="text-xl font-black">Encaisser un paiement</h3>
                      <button onClick={() => setIsPayModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
                  </div>
                  <form onSubmit={handleRecordPayment} className="p-8 space-y-5">
                      <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Élève concerné</label>
                          <select required value={newPayment.student_id} onChange={e => {
                              setNewPayment({...newPayment, student_id: e.target.value});
                              const student = studentsStatus.find(s => s.id === e.target.value);
                              if (student) api.finance.getFeesByClass(student.current_class_id).then(res => setClassFees(res.data));
                          }} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none bg-white">
                              <option value="">Choisir un élève...</option>
                              {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.matricule})</option>)}
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Motif (Frais)</label>
                          <select required value={newPayment.fee_id} onChange={e => {
                              const fee = classFees.find(f => f.id === e.target.value);
                              setNewPayment({...newPayment, fee_id: e.target.value, amount: fee ? fee.amount : ''});
                          }} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none bg-white">
                              <option value="">Sélectionner un frais...</option>
                              {classFees.map(f => <option key={f.id} value={f.id}>{f.title} ({f.amount} F)</option>)}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Montant versé</label>
                            <input required type="number" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:bg-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 pl-2">Méthode</label>
                            <select required value={newPayment.method} onChange={e => setNewPayment({...newPayment, method: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none bg-white">
                                <option value="Espèces">Espèces</option>
                                <option value="Chèque">Chèque</option>
                                <option value="Virement">Virement</option>
                            </select>
                        </div>
                      </div>
                      <button disabled={isSubmitting} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all">
                          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirmer l\'encaissement'}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};