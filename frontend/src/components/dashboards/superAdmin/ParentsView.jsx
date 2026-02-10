import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { DataTable } from '../../ui/DataTable';
import { Button } from '../../ui/button';
import { api } from '../../../services/api'; // ✅ adapte le chemin si besoin

export const ParentsView = () => {
  const [parents, setParents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================
     FETCH PARENTS (via api.js)
  ========================= */
  const fetchParents = async () => {
    setIsLoading(true);
    try {
      // api.admin.getParents() -> attendu: { success:true, data:[...] }
      const res = await api.admin.getParents();

      const parentsData = Array.isArray(res?.data)
        ? res.data.map((p) => ({
            ...p,
            email_verified: Boolean(p.email_verified),
          }))
        : [];

      console.log('Parents chargés:', parentsData);
      setParents(parentsData);
    } catch (error) {
      console.error('Erreur récupération parents:', error);
      setParents([]);
      alert(error?.message || "Impossible de récupérer les parents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  /* =========================
     RESEND EMAIL (via api.js)
  ========================= */
  const handleResendEmail = async (parent) => {
    if (!window.confirm(`Relancer l'email de vérification pour ${parent.first_name} ${parent.last_name} ?`)) return;

    setIsSubmitting(true);
    try {
      // ✅ services/api.js doit contenir:
      // admin.resendVerificationEmail: (email)=> handleFetch(`${BASE_URL}/admin/resend-verification-email`, {method:"POST", body: JSON.stringify({email})})
      const res = await api.admin.resendVerificationEmail(parent.email);

      alert(res?.message || 'Email de vérification renvoyé !');
    } catch (err) {
      console.error(err);

      // Message plus clair côté UI
      // (utile tant que le SMTP/domaine n’est pas opérationnel)
      const msg =
        err?.message ||
        "Erreur lors de l’envoi. Vérifie que l’endpoint existe et que le serveur email est opérationnel.";

      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     COLUMNS
  ========================= */
  const columns = useMemo(
    () => [
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'first_name',
        header: 'Nom complet',
        cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
      },
      {
        accessorKey: 'phone_number',
        header: 'Téléphone',
        cell: ({ row }) => row.original.phone_number || '-',
      },
      {
        accessorKey: 'email_verified',
        header: 'Vérifié ?',
        cell: ({ row }) => {
          const verified = row.original.email_verified;
          return (
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase border
              ${
                verified
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {verified ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {verified ? 'Oui' : 'Non'}
            </div>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Inscription',
        cell: ({ row }) => (row.original.created_at ? new Date(row.original.created_at).toLocaleString() : '-'),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) =>
          !row.original.email_verified && (
            <Button
              variant="ghost"
              size="icon"
              disabled={isSubmitting}
              onClick={() => handleResendEmail(row.original)}
              className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
              title="Renvoyer email de vérification"
            >
              <Mail className="h-4 w-4" />
            </Button>
          ),
      },
    ],
    [isSubmitting]
  );

  /* =========================
     FILTER
  ========================= */
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return parents;
    if (statusFilter === 'verified') return parents.filter((p) => p.email_verified);
    return parents.filter((p) => !p.email_verified);
  }, [parents, statusFilter]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-black text-slate-900">Personnes inscrites</h2>
        <p className="text-slate-500 mt-1">Liste des utilisateurs et état de leur email.</p>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 p-2 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'all', label: 'Tous' },
          { id: 'verified', label: 'Vérifiés' },
          { id: 'unverified', label: 'Non vérifiés' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold
              ${statusFilter === f.id ? 'bg-white text-slate-900 shadow' : 'text-slate-400'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin h-12 w-12 text-indigo-600 opacity-40" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          searchColumn="email"
          filterPlaceholder="Rechercher par email..."
        />
      )}
    </div>
  );
};
