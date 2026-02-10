import React, { useEffect, useState } from 'react';
import { X, User, Calendar, Hash, School, Check, ArrowRight, ArrowLeft, Search, Phone, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';

export const AddStudentModal = ({ isOpen, onClose, schoolId, onSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data Fetching States
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);

  // Form Data
  const [studentData, setStudentData] = useState({
      firstName: '', lastName: '', dob: '', matricule: `MAT-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`
  });
  const [academicData, setAcademicData] = useState({
      yearId: '', classId: ''
  });
  
  // Parent Logic States
  const [parentMode, setParentMode] = useState('search'); // 'search' | 'create'
  const [searchQuery, setSearchQuery] = useState('');
  const [foundParent, setFoundParent] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [newParentData, setNewParentData] = useState({
      firstName: '', lastName: '', phone: '', email: ''
  });
  const [relationship, setRelationship] = useState('Père');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setStep(1); 
      loadAcademicYears();
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --- API CALLS ---
  const loadAcademicYears = async () => {
      try {
          const res = await api.academic.getYears(schoolId);
          setAcademicYears(res.data);
      } catch (e){ console.error(e);}
  };

  const loadClasses = async (yearId) => {
      try {
          const res = await api.academic.getClasses(yearId);
          setClasses(res.data);
      } catch (e) {console.error(e);}
  };

  const handleParentSearch = async () => {
      if(!searchQuery) return;
      setSearchLoading(true);
      try {
          const res = await api.students.searchParent(searchQuery);
          setFoundParent(res.parent);
      } catch (e) {
          console.error(e);
      } finally {
          setSearchLoading(false);
      }
  };

  const handleSubmit = async () => {
      setIsLoading(true);
      try {
          const payload = {
              school_id: schoolId,
              // Step 1
              first_name: studentData.firstName,
              last_name: studentData.lastName,
              date_of_birth: studentData.dob,
              matricule: studentData.matricule,
              // Step 2
              current_class_id: academicData.classId,
              // Step 3
              parent_mode: foundParent ? 'existing' : 'new',
              parent_id: foundParent?.id,
              parent_info: foundParent ? null : newParentData,
              relationship_type: relationship
          };

          await api.students.createFull(payload);
          if (onSuccess) onSuccess();
          onClose();
      } catch (error) {
          alert("Erreur: " + error.message);
      } finally {
          setIsLoading(false);
      }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />

      <div className={`relative w-full max-w-2xl bg-[#FDFDFD] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-300 ease-out border border-white/20 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Nouveau Dossier Soummission</h2>
                <p className="text-sm text-slate-500">Assistant d'inscription</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50"><X size={20} /></button>
          </div>
          {/* Progress */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
                    <div className={`mt-2 text-[10px] font-semibold uppercase tracking-wider ${s <= step ? 'text-indigo-600' : 'text-slate-300'}`}>
                        {s === 1 ? 'Identité' : s === 2 ? 'Classe' : 'Tuteur'}
                    </div>
                </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-[#FDFDFD]">
          
          {/* STEP 1: STUDENT */}
          {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase">INTITULÉ *</label>
                          <input type="text" value={studentData.firstName} onChange={e => setStudentData({...studentData, firstName: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="Ex: Jean" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Titre *</label>
                          <input type="text" value={studentData.lastName} onChange={e => setStudentData({...studentData, lastName: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="Ex: Dupont" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Date de lancement *</label>
                          <input type="date" value={studentData.dob} onChange={e => setStudentData({...studentData, dob: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Matricule</label>
                          <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="text" value={studentData.matricule} onChange={e => setStudentData({...studentData, matricule: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700" />
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* STEP 2: CLASS */}
          {step === 2 && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                   <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex gap-3 items-start">
                        <School className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div className="text-xs text-indigo-900">
                            Sélectionnez l'année et la classe pour l'inscription. Ces données sont récupérées de votre configuration académique.
                        </div>
                   </div>
                   
                   <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Année de validité</label>
                            <select 
                                value={academicData.yearId}
                                onChange={(e) => {
                                    setAcademicData({...academicData, yearId: e.target.value});
                                    loadClasses(e.target.value);
                                }}
                                className="w-full mt-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                            >
                                <option value="">Choisir...</option>
                                {academicYears.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Nature du projet</label>
                            <select 
                                value={academicData.classId}
                                onChange={(e) => setAcademicData({...academicData, classId: e.target.value})}
                                disabled={!academicData.yearId}
                                className="w-full mt-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm disabled:opacity-50"
                            >
                                <option value="">Choisir la nature...</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                   </div>
               </div>
          )}

          {/* STEP 3: PARENT */}
          {step === 3 && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                   <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                        <button onClick={() => setParentMode('search')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${parentMode === 'search' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Sponsor Existant</button>
                        <button onClick={() => setParentMode('create')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${parentMode === 'create' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Nouveau Sporsor</button>
                   </div>

                   {parentMode === 'search' && (
                       <div className="space-y-4">
                           <div className="flex gap-2">
                               <input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tél ou Code Sponsor..." 
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm" 
                               />
                               <button onClick={handleParentSearch} className="px-4 bg-slate-900 text-white rounded-xl text-sm">
                                   {searchLoading ? <Loader2 className="animate-spin" /> : 'Rechercher'}
                               </button>
                           </div>
                           {foundParent && (
                               <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                                   <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">{foundParent.first_name[0]}</div>
                                   <div>
                                       <div className="font-semibold text-slate-900">{foundParent.first_name} {foundParent.last_name}</div>
                                       <div className="text-xs text-emerald-700">{foundParent.phone_number}</div>
                                   </div>
                               </div>
                           )}
                       </div>
                   )}

                   {parentMode === 'create' && (
                       <div className="space-y-3">
                           <div className="grid grid-cols-2 gap-3">
                               <input placeholder="Prénom" value={newParentData.firstName} onChange={e => setNewParentData({...newParentData, firstName: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-xl text-sm" />
                               <input placeholder="Nom" value={newParentData.lastName} onChange={e => setNewParentData({...newParentData, lastName: e.target.value})} className="px-4 py-3 border border-slate-200 rounded-xl text-sm" />
                           </div>
                           <input placeholder="Téléphone " value={newParentData.phone} onChange={e => setNewParentData({...newParentData, phone: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" />
                           <input placeholder="Email (Optionnel)" value={newParentData.email} onChange={e => setNewParentData({...newParentData, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" />
                       </div>
                   )}

                   <div className="pt-4 border-t border-slate-100">
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Lien de subvention</label>
                        <select value={relationship} onChange={e => setRelationship(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                            <option>Parrain</option><option>Marraine</option><option>Sponsor Légal</option>
                        </select>
                   </div>
               </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
            {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={16} /> Retour
                </button>
            ) : <div />}

            {step < 3 ? (
                <button 
                    onClick={() => {
                        if (step === 1 && (!studentData.firstName || !studentData.lastName)) return alert("Remplissez l'identité");
                        if (step === 2 && !academicData.classId) return alert("Sélectionnez une classe");
                        setStep(step + 1)
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-black transition-all"
                >
                    Suivant <ArrowRight size={16} />
                </button>
            ) : (
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading || (parentMode === 'create' && !newParentData.phone)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <><Check size={16} /> Enregistrer le dossier</>}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};