
import React, { useState, useEffect } from 'react';
import { X, User, Check, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import { Button } from '../../ui/button';

export const EditStudentModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    matricule: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        matricule: student.matricule || '',
        status: student.status || 'active'
      });
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.students.update(student.id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      alert("Erreur lors de la modification : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b flex justify-between items-center bg-slate-900 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2"><User size={20} /> Modifier le projet</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">Intitulé</label>
            <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/5" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">Titre</label>
            <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/5" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">Matricule</label>
            <input value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 font-mono" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">Statut</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none bg-white">
              <option value="active">Actif</option>
              <option value="inactive">Inactif / Sorti</option>
            </select>
          </div>
          <Button disabled={isLoading} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black shadow-xl mt-4">
            {isLoading ? <Loader2 className="animate-spin" /> : <><Check size={20} className="mr-2" /> Enregistrer les modifications</>}
          </Button>
        </form>
      </div>
    </div>
  );
};
