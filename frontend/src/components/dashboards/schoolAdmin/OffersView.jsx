// 📌 src/components/dashboards/superAdmin/OffersView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  X,
  Check,
  Loader2,
  Calendar,
  BadgeDollarSign,
  FileText,
  ListChecks,
} from "lucide-react";
import { Button } from "../../ui/button";
import { api } from "../../../services/api";

/* =========================
   Helpers
========================= */
const toDateInput = (v) => {
  if (!v) return "";
  const s = String(v);
  return s.includes("T") ? s.split("T")[0] : s.slice(0, 10);
};

const formatMoney = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("fr-FR").format(num);
};

const statusLabel = (s) => {
  switch (s) {
    case "published":
      return {
        text: "Publié",
        cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "closed":
      return {
        text: "Clôturé",
        cls: "bg-rose-50 text-rose-700 border-rose-200",
      };
    default:
      return {
        text: "Brouillon",
        cls: "bg-slate-50 text-slate-700 border-slate-200",
      };
  }
};

/* =========================
   Modals
========================= */
const OfferModal = ({ open, onClose, initial, onSaved }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    sector: "",
    eligibility: "",
    amount: "",
    launch_date: "",
    deadline_date: "",
    status: "draft",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      title: initial?.title || "",
      description: initial?.description || "",
      sector: initial?.sector || initial?.sectors || "",
      eligibility: initial?.eligibility || "",
      amount: initial?.amount ?? initial?.funding_amount ?? "",
      launch_date: toDateInput(initial?.launch_date),
      deadline_date: toDateInput(initial?.deadline_date),
      status: initial?.status || "draft",
    });
  }, [open, initial]);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        sector: form.sector,
        eligibility: form.eligibility,
        amount: form.amount,
        launch_date: form.launch_date,
        deadline_date: form.deadline_date,
        status: form.status,
      };

      if (initial?.id) await api.offers.update(initial.id, payload);
      else await api.offers.create(payload);

      onSaved?.();
      onClose?.();
    } catch (err) {
      alert(err?.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-5 md:p-8 border-b flex justify-between items-center bg-slate-900 text-white">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <FileText size={20} color="currentColor" />
            {initial?.id ? "Modifier l’offre" : "Nouvelle offre"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} color="currentColor" />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="p-5 md:p-10 space-y-6 overflow-y-auto"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">
              Intitulé
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/5"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">
              Description
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:ring-4 focus:ring-indigo-500/5"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">
                Secteur ciblé
              </label>
              <input
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                placeholder="Ex: Éducation, Santé, Agriculture..."
                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-indigo-500/5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">
                Montant à financer
              </label>
              <input
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Ex: 5000000"
                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/5"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">
                Date de lancement
              </label>
              <input
                type="date"
                value={form.launch_date}
                onChange={(e) =>
                  setForm({ ...form, launch_date: e.target.value })
                }
                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">
                Date de fin
              </label>
              <input
                type="date"
                value={form.deadline_date}
                onChange={(e) =>
                  setForm({ ...form, deadline_date: e.target.value })
                }
                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">
              Modalités / Éligibilité
            </label>
            <textarea
              value={form.eligibility}
              onChange={(e) =>
                setForm({ ...form, eligibility: e.target.value })
              }
              rows={4}
              placeholder="Critères, documents requis, conditions..."
              className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:ring-4 focus:ring-indigo-500/5"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-2">
                Statut
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="closed">Clôturé</option>
              </select>
            </div>
          </div>

          <Button
            disabled={isLoading}
            className="w-full h-14 md:h-16 bg-slate-900 text-white rounded-2xl font-bold text-base md:text-lg hover:bg-black shadow-xl mt-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" color="currentColor" />
            ) : (
              <>
                <Check size={20} className="mr-2" color="currentColor" />{" "}
                Enregistrer
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

/**
 * ✅ SubmissionModal (LISTE)
 * Une offre peut avoir plusieurs soumissions (1 par parent max)
 * => appelle api.offers.getSubmissions(offerId)
 */
const SubmissionModal = ({ open, onClose, offerId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]); // ✅ liste

  useEffect(() => {
    if (!open || !offerId) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await api.offers.getSubmissions(offerId); // ✅ NEW
        setRows(res?.data || []);
      } catch (err) {
        alert(err?.message || "Erreur chargement soumissions");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [open, offerId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 md:p-8 border-b flex justify-between items-center bg-slate-900 text-white">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <ListChecks size={20} color="currentColor" /> Soumissions
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <X size={20} color="currentColor" />
          </button>
        </div>

        <div className="p-5 md:p-10 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="animate-spin" color="currentColor" />
              <span>Chargement...</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="text-slate-600">
              Aucune soumission pour cette offre.
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl border bg-slate-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Projet
                      </div>
                      <div className="font-extrabold text-lg">
                        {s.project_title || "—"}
                      </div>

                      <div className="text-slate-700 mt-1 break-words">
                        {s.first_name || ""} {s.last_name || ""}
                        {s.phone_number ? ` • 📞 ${s.phone_number}` : ""}
                        {s.email ? ` • ✉️ ${s.email}` : ""}
                      </div>
                    </div>

                    <div className="text-sm text-slate-700 font-semibold">
                      Statut: {s.status || "submitted"}
                      <div className="text-slate-600">
                        Soumis le:{" "}
                        {s.submitted_at ? String(s.submitted_at) : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================
   Main View
========================= */
export const OffersView = ({ user }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);

  const [subOpen, setSubOpen] = useState(false);
  const [subOfferId, setSubOfferId] = useState(null);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const res = await api.offers.getAll();
      setOffers(res?.data || []);
    } catch (err) {
      alert(err?.message || "Erreur chargement offres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offers;
    return offers.filter((o) => {
      const t = `${o.title || ""} ${o.description || ""} ${o.sector || ""} ${o.status || ""}`.toLowerCase();
      return t.includes(q);
    });
  }, [offers, query]);

  const openCreate = () => {
    setEditOffer(null);
    setModalOpen(true);
  };

  const openEdit = (o) => {
    setEditOffer(o);
    setModalOpen(true);
  };

  const openSubmission = (offerId) => {
    setSubOfferId(offerId);
    setSubOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">
            Offres de soumission
          </div>
          <div className="text-slate-600 mt-1">
            Crée et publie des appels à projets. Chaque parent peut soumettre une
            seule fois par offre ; une offre peut recevoir plusieurs soumissions.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadOffers}
            className="h-11 w-11 p-0 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 shadow-sm text-slate-900"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
              color="currentColor"
            />
          </Button>

          <Button
            onClick={openCreate}
            className="h-11 rounded-2xl bg-slate-900 text-white hover:bg-black shadow-sm"
          >
            <Plus size={18} className="mr-2" color="currentColor" />
            Nouvelle offre
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        <Search size={18} className="text-slate-400" color="currentColor" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une offre..."
          className="w-full outline-none font-medium text-slate-900"
        />
      </div>

      {/* List */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-6 py-4 border-b bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase">
          <div className="col-span-4">Intitulé</div>
          <div className="col-span-2 flex items-center gap-2">
            <Calendar size={14} color="currentColor" /> Période
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <BadgeDollarSign size={14} color="currentColor" /> Montant
          </div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-6 flex items-center gap-3 text-slate-600">
            <Loader2 className="animate-spin" color="currentColor" />
            <span>Chargement...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-slate-600">Aucune offre.</div>
        ) : (
          filtered.map((o) => {
            const st = statusLabel(o.status);

            return (
              <div
                key={o.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-2 px-4 md:px-6 py-4 border-b last:border-b-0 items-start md:items-center"
              >
                {/* Title */}
                <div className="md:col-span-4">
                  <div className="font-extrabold text-slate-900">
                    {o.title || "—"}
                  </div>
                  <div className="text-slate-600 text-sm line-clamp-1">
                    {o.sector || o.sectors || "—"}
                  </div>

                  {/* Mobile meta */}
                  <div className="mt-3 md:hidden grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-700 font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <Calendar
                          size={14}
                          className="text-slate-500"
                          color="currentColor"
                        />
                        {toDateInput(o.launch_date) || "—"} →{" "}
                        {toDateInput(o.deadline_date) || "—"}
                      </span>
                    </div>
                    <div className="text-slate-700 font-extrabold text-right">
                      {formatMoney(o.amount ?? o.funding_amount)} €
                    </div>
                  </div>
                </div>

                {/* Period (desktop) */}
                <div className="hidden md:block md:col-span-2 text-sm text-slate-700 font-semibold">
                  {toDateInput(o.launch_date) || "—"} →{" "}
                  {toDateInput(o.deadline_date) || "—"}
                </div>

                {/* Amount (desktop) */}
                <div className="hidden md:block md:col-span-2 text-sm text-slate-700 font-extrabold">
                  {formatMoney(o.amount ?? o.funding_amount)} €
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-extrabold ${st.cls}`}
                  >
                    {st.text}
                  </span>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex items-center justify-start md:justify-end gap-2 w-full">
                  <Button
                    onClick={() => openSubmission(o.id)}
                    className="h-10 w-10 p-0 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-900"
                    title="Voir soumissions"
                  >
                    <Eye size={18} color="currentColor" />
                  </Button>

                  <Button
                    onClick={() => openEdit(o)}
                    className="h-10 w-10 p-0 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-900"
                    title="Modifier"
                  >
                    <Pencil size={18} color="currentColor" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <OfferModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editOffer}
        onSaved={loadOffers}
      />

      <SubmissionModal
        open={subOpen}
        onClose={() => setSubOpen(false)}
        offerId={subOfferId}
      />
    </div>
  );
};
