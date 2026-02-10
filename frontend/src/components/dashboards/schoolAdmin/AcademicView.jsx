import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    BookOpen, FileText, Calendar, Upload, Eye, ChevronDown, 
    ChevronRight, Plus, X, Loader2, Search, CheckCircle2,
    Layers, GraduationCap
} from 'lucide-react';
import { api } from '../../../services/api';
import { DataTable } from '../../ui/DataTable';
import { Button } from '../../ui/button';

export const AcademicView = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const schoolId = user.school_id;

  const [activeTab, setActiveTab] = useState('classes'); 
  const [currentPeriod, setCurrentPeriod] = useState('1');

  const [activeYear, setActiveYear] = useState(null);
  const [classes, setClasses] = useState([]);
  const [studentsByClass, setStudentsByClass] = useState({});
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', level: 'Collège' });

  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [schoolId]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const yearsRes = await api.academic.getYears(schoolId);
      const activeY = yearsRes.data.find(y => y.is_active === 1);
      if (activeY) {
        setActiveYear(activeY);
        const classesRes = await api.academic.getClasses(activeY.id);
        setClasses(classesRes.data);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file || !uploadTarget) return;

      setIsUploading(true);
      try {
          const fakeUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?v=${Date.now()}`;
          
          if (uploadTarget.type === 'EDT') {
              await api.academic.uploadSchedule(uploadTarget.id, fakeUrl);
              alert(`Emploi du temps enregistré.`);
              fetchInitialData();
          } else {
              await api.academic.uploadReportCard({
                  student_id: uploadTarget.id,
                  academic_year_id: activeYear.id,
                  period: `Trimestre ${currentPeriod}`,
                  file_url: fakeUrl
              });
              alert(`Bulletin envoyé !`);
          }
      } catch (err) {
          alert("Erreur upload: " + err.message);
      } finally {
          setIsUploading(false);
          setUploadTarget(null);
          e.target.value = null;
      }
  };

  const triggerUpload = (type, id) => {
      setUploadTarget({ type, id });
      fileInputRef.current.click();
  };

  const openDocument = (url) => {
      if(!url) return;
      window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCreateClass = async (e) => {
      e.preventDefault();
      try {
          await api.academic.createClass({ ...newClass, academic_year_id: activeYear.id });
          setIsClassModalOpen(false);
          setNewClass({ name: '', level: 'Collège' });
          fetchInitialData();
      } catch (e) { alert(e.message); }
  };

  // --- COLONNES POUR L'ONGLET CLASSES (EDT) ---
  const classColumns = useMemo(() => [
    {
        accessorKey: "name",
        header: "Classe",
        cell: ({ row }) => <span className="font-bold text-slate-900 text-base">{row.getValue("name")}</span>
    },
    {
        accessorKey: "level",
        header: "Niveau",
        cell: ({ row }) => <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-bold uppercase">{row.getValue("level")}</span>
    },
    {
        id: "schedule",
        header: "Emploi du temps",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {row.original.schedule_url ? (
                    <Button variant="outline" size="sm" onClick={() => openDocument(row.original.schedule_url)} className="h-8 text-[10px] font-bold border-indigo-100 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Eye className="h-3.5 w-3.5 mr-1" /> VOIR PDF
                    </Button>
                ) : (
                    <span className="text-[10px] font-medium text-slate-400 italic px-2">Non défini</span>
                )}
                <Button variant="ghost" size="sm" onClick={() => triggerUpload('EDT', row.original.id)} className="h-8 text-[10px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                    <Upload className="h-3.5 w-3.5 mr-1" /> {row.original.schedule_url ? 'REMPLACER' : 'AJOUTER'}
                </Button>
            </div>
        )
    }
  ], []);

  // --- COLONNES POUR LES ÉLÈVES (BULLETINS) ---
  const studentColumns = useMemo(() => [
    {
        accessorKey: "matricule",
        header: "Matricule",
        cell: ({ row }) => <span className="font-mono text-xs font-bold text-slate-400">{row.getValue("matricule")}</span>
    },
    {
        accessorKey: "last_name",
        header: "Intitule",
        cell: ({ row }) => <div className="font-bold text-slate-900">{row.original.first_name} {row.original.last_name}</div>
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="text-right">
                <Button onClick={() => triggerUpload('Bulletin', row.original.id)} className="bg-slate-900 text-white h-9 px-4 rounded-xl text-[10px] font-bold hover:bg-black transition-all">
                    <Upload className="h-3 w-3 mr-1.5" /> UPLOAD BULLETIN
                </Button>
            </div>
        )
    }
  ], [currentPeriod]);

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Planning</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${activeYear ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            <p className="text-slate-500 font-medium text-sm">
                Année active : <span className="text-slate-900 font-bold">{activeYear ? activeYear.name : 'Aucune'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm shadow-inner">
                <button 
                    onClick={() => setActiveTab('classes')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'classes' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                >
                    Classes & EDT
                </button>
                <button 
                    onClick={() => setActiveTab('bulletins')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'bulletins' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                >
                    Bulletins
                </button>
            </div>
            <Button 
                onClick={() => setIsClassModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-6 rounded-2xl font-bold shadow-xl shadow-indigo-100"
            >
                <Plus size={18} className="mr-2" /> Nouvelle Classe
            </Button>
        </div>
      </div>

      {isUploading && (
          <div className="fixed inset-0 z-[200] bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 border border-slate-100">
                  <Loader2 className="animate-spin text-indigo-600" size={48} />
                  <p className="font-bold text-slate-900">Enregistrement sécurisé...</p>
              </div>
          </div>
      )}

      {/* PERIOD SELECTOR WIDGET */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-50 rounded-[1.5rem] text-indigo-600">
                  <BookOpen size={32} />
              </div>
              <div>
                  <h3 className="font-bold text-slate-900 text-xl tracking-tight">Configuration du Cycle projet</h3>
                  <p className="text-sm text-slate-400 font-medium">Gestion des notes pour le {activeYear?.period_type || 'Période'} en cours.</p>
              </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-[1.5rem] border border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 pr-2">{activeYear?.period_type || 'Période'}</span>
              {[1, 2, 3].map(num => (
                  <button 
                      key={num}
                      onClick={() => setCurrentPeriod(num.toString())}
                      className={`w-14 h-12 rounded-xl text-sm font-bold transition-all ${currentPeriod === num.toString() ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      {num}
                  </button>
              ))}
          </div>
      </div>

      {/* TAB CONTENT: CLASSES & EDT */}
      {activeTab === 'classes' && (
          <div className="animate-in fade-in slide-in-from-left-4">
              <DataTable 
                columns={classColumns} 
                data={classes} 
                searchColumn="name"
                filterPlaceholder="Rechercher une classe..."
              />
          </div>
      )}

      {/* TAB CONTENT: BULLETINS (WITH ACCORDION HIERARCHY) */}
      {activeTab === 'bulletins' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            {classes.map(c => (
                <div key={c.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                    <div 
                        onClick={async () => {
                            if (expandedClassId === c.id) {
                                setExpandedClassId(null);
                            } else {
                                setExpandedClassId(c.id);
                                if (!studentsByClass[c.id]) {
                                    try {
                                        const res = await api.students.getBySchool(schoolId);
                                        const filtered = res.data.filter(s => s.current_class_id === c.id);
                                        setStudentsByClass(prev => ({ ...prev, [c.id]: filtered }));
                                    } catch (e) { console.error(e); }
                                }
                            }
                        }}
                        className={`p-8 flex items-center justify-between cursor-pointer transition-colors ${expandedClassId === c.id ? 'bg-slate-50 border-b border-slate-100' : 'hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all ${expandedClassId === c.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {expandedClassId === c.id ? <ChevronDown size={28} /> : <ChevronRight size={28} />}
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{c.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{c.level}</span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                    <span className="text-[10px] font-bold text-indigo-600">{studentsByClass[c.id]?.length || 0} ÉLÈVES INSCRITS</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-xs font-bold text-slate-400">
                            {expandedClassId === c.id ? 'Masquer' : 'Gérer les bulletins'}
                        </Button>
                    </div>

                    {expandedClassId === c.id && (
                        <div className="p-8 bg-white animate-in zoom-in-95 duration-300">
                            <div className="mb-6 flex items-center gap-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={16} /></div>
                                <span className="text-xs font-bold text-slate-500 uppercase">Saisie des bulletins - Période {currentPeriod}</span>
                            </div>
                            <DataTable 
                                columns={studentColumns} 
                                data={studentsByClass[c.id] || []} 
                                searchColumn="last_name"
                                filterPlaceholder="Rechercher un élève dans cette classe..."
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}

      {/* MODAL: NOUVELLE CLASSE */}
      {isClassModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsClassModalOpen(false)} />
              <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-8 border-b flex justify-between items-center bg-slate-900 text-white">
                      <h3 className="text-xl font-bold flex items-center gap-2"><GraduationCap /> Nouvelle Classe</h3>
                      <button onClick={() => setIsClassModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
                  </div>
                  <form onSubmit={handleCreateClass} className="p-10 space-y-6">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">Nom de la classe</label>
                          <input required placeholder="Ex: 6ème A" value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">Niveau / Cycle</label>
                          <select value={newClass.level} onChange={e => setNewClass({...newClass, level: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none bg-white">
                              <option>Maternelle</option>
                              <option>Primaire</option>
                              <option>Collège</option>
                              <option>Lycée</option>
                          </select>
                      </div>
                      <Button className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black shadow-xl">
                          Créer la classe
                      </Button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};