
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, MoreHorizontal, Download, Loader2, Edit2, Trash2, ArrowUpDown, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AddStudentModal } from './AddStudentModal';
import { EditStudentModal } from './EditStudentModal';
import { api } from '../../../services/api';
import { DataTable } from '../../ui/DataTable';
import { Button } from '../../ui/button';

export const StudentsView = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await api.students.getBySchool(user.school_id);
      setStudents(res.data);
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ce projet et toutes ses données (paiements, etc.) ?")) return;
    try {
      await api.students.delete(id);
      fetchStudents();
    } catch (e) { alert(e.message); }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value.target.checked)}
          aria-label="Sélectionner tout"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value.target.checked)}
          aria-label="Sélectionner ligne"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "last_name",
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-slate-900 transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Identité <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs overflow-hidden shrink-0 border border-slate-100 shadow-sm">
            {row.original.photo_url ? <img src={row.original.photo_url} className="w-full h-full object-cover" /> : row.original.first_name[0]}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.original.first_name} {row.original.last_name}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">{row.original.status || 'actif'}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "matricule",
      header: "Matricule",
      cell: ({ row }) => <span className="font-mono text-xs font-bold text-slate-500 italic">{row.getValue("matricule")}</span>,
    },
    {
      accessorKey: "class_name",
      header: "Classe",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight bg-slate-100 text-slate-600 border border-slate-200">
          {row.getValue("class_name") || 'N/A'}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Gestion",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
             <Edit2 className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)} className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
             <Trash2 className="h-4 w-4" />
           </Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-indigo-600 tracking-tight">Effectif Projets</h2>
          <p className="text-slate-500 font-medium">Gérez la base de données des projets et leurs dossiers numériques.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 rounded-2xl px-6 font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nouveau projet
          </Button>
        </div>
      </div>

      {/* ZONE D'ACTIONS GROUPÉES (Si lignes sélectionnées) */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="bg-slate-900 p-4 rounded-2xl text-white flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 pl-2">
            <ShieldAlert className="text-amber-400" size={20} />
            <span className="text-sm font-bold">{Object.keys(rowSelection).length} élève(s) sélectionné(s)</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-white hover:bg-white/10 h-10 px-4 text-xs font-bold">Désactiver</Button>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white h-10 px-4 text-xs font-bold rounded-xl" onClick={() => alert("Action groupée en cours de développement")}>
              Supprimer la sélection
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-indigo-600 h-12 w-12 opacity-30" /></div>
      ) : (
        <div className="animate-in fade-in duration-500">
            <DataTable 
                columns={columns} 
                data={students} 
                filterPlaceholder="Rechercher par nom ou matricule..." 
                searchColumn="last_name"
                onSelectionChange={setRowSelection}
                rowSelection={rowSelection}
            />
        </div>
      )}

      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        schoolId={user.school_id} 
        onSuccess={fetchStudents} 
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedStudent(null); }}
        student={selectedStudent}
        onSuccess={fetchStudents}
      />
    </div>
  );
};
