// 📜 parentAdmin/OffersSubmissionView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Send,
  Loader2,
  Calendar,
  BadgeDollarSign,
  X,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../ui/button";
import { api } from "../../../services/api";
import { AddProjectModal } from "./AddProjectModal";

/* ---------------- Helpers ---------------- */
const isEmpty = (v) =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "");

const safeJson = (val, fallback) => {
  if (val === undefined || val === null) return fallback;
  if (Array.isArray(val)) return val;
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const toDate = (v) => {
  if (!v) return "—";
  const s = String(v);
  return s.includes("T") ? s.split("T")[0] : s.slice(0, 10);
};

const formatMoney = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("fr-FR").format(num);
};

const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const statusMeta = (s) => {
  switch ((s || "").toLowerCase()) {
    case "published":
      return { label: "Publié", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "closed":
      return { label: "Clôturé", cls: "bg-rose-50 text-rose-700 border-rose-200" };
    default:
      return { label: "Brouillon", cls: "bg-slate-50 text-slate-700 border-slate-200" };
  }
};

// ✅ secteur supporte string | array | JSON string
const normalizeSector = (offer) => {
  const raw = offer?.sector ?? offer?.sectors ?? offer?.sector_name ?? offer?.target_sector ?? offer?.target_sectors;
  if (isEmpty(raw)) return "—";

  if (Array.isArray(raw)) return raw.filter(Boolean).join(", ") || "—";

  const parsed = safeJson(raw, null);
  if (Array.isArray(parsed)) return parsed.filter(Boolean).join(", ") || "—";

  return String(raw);
};

// ✅ eligibility supporte plusieurs clés
const normalizeEligibility = (offer) => {
  const raw =
    offer?.eligibility ??
    offer?.eligibility_criteria ??
    offer?.criteria ??
    offer?.conditions ??
    offer?.requirements ??
    offer?.modalities ??
    offer?.modalites ??
    offer?.terms ??
    offer?.rules;

  if (isEmpty(raw)) return "—";
  return String(raw);
};

// ✅ montant supporte plusieurs clés
const normalizeAmount = (offer) => {
  const raw =
    offer?.amount ??
    offer?.funding_amount ??
    offer?.fundingAmount ??
    offer?.budget ??
    offer?.budget_total ??
    offer?.budgetTotal ??
    offer?.amount_requested ??
    offer?.amountRequested;

  return raw ?? null;
};

/* ---------------- Modal Détails Offre (responsive) ---------------- */
const OfferDetailsModal = ({ open, onClose, offer }) => {
  if (!open) return null;

  const st = statusMeta(offer?.status);

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* ✅ Mobile: bottom-sheet / Desktop: modal centré */}
      <div className="relative w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2 font-bold">
            <FileText size={18} />
            Détails de l’offre
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {offer?.title || "—"}
          </div>

          <div className="mt-2 text-slate-700 whitespace-pre-wrap">
            {offer?.description || "—"}
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Secteur</div>
              <div className="mt-1 font-bold">{normalizeSector(offer)}</div>
            </div>

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Montant</div>
              <div className="mt-1 font-extrabold">
                {formatMoney(normalizeAmount(offer))} €
              </div>
            </div>

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Période</div>
              <div className="mt-1 font-bold">
                {toDate(offer?.launch_date ?? offer?.launchDate)} → {toDate(offer?.deadline_date ?? offer?.deadlineDate)}
              </div>
            </div>

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Statut</div>
              <div className="mt-2">
                <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-extrabold ${st.cls}`}>
                  {st.label}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border p-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Éligibilité</div>
            <div className="mt-2 text-slate-700 whitespace-pre-wrap">
              {normalizeEligibility(offer)}
            </div>
          </div>

          <Button onClick={onClose} className="mt-6 w-full bg-slate-900 text-white h-12 rounded-2xl font-bold">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- View principale ---------------- */
export const OffersSubmissionView = ({ userId, userRole, onAfterSubmit }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [submitOpen, setSubmitOpen] = useState(false);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await api.offers.getAll();
      const list = normalizeListResponse(res);

      // ✅ côté parent: uniquement publié
      const visible = list.filter((o) => (o?.status || "").toLowerCase() === "published");
      setOffers(visible);
    } catch (e) {
      alert(e?.message || "Erreur chargement offres");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offers;

    return offers.filter((o) => {
      const text = `${o.title || ""} ${o.description || ""} ${normalizeSector(o)} ${o.status || ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [offers, query]);

  const openDetails = (offer) => {
    setSelectedOffer(offer);
    setDetailsOpen(true);
  };

  const openSubmit = (offer) => {
    setSelectedOffer(offer);
    setSubmitOpen(true);
  };

  const handleSubmitted = async () => {
    onAfterSubmit?.();
    fetchOffers();
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">Appels à soumission</div>
          <div className="text-slate-600 mt-1">
            Consulte les offres publiées et soumets un projet directement.
          </div>
        </div>

        <Button
          onClick={fetchOffers}
          className="h-11 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          <span className="ml-2">Actualiser</span>
        </Button>
      </div>

      {/* Search */}
      <div className="mt-5 flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une offre..."
          className="w-full outline-none font-medium text-slate-900"
        />
      </div>

      {/* List */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-2 px-6 py-4 border-b bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase">
          <div className="col-span-5">Intitulé</div>
          <div className="col-span-3 flex items-center gap-2">
            <Calendar size={14} /> Période
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <BadgeDollarSign size={14} /> Montant
          </div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-6 flex items-center gap-3 text-slate-600">
            <Loader2 className="animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-slate-600">Aucune offre publiée.</div>
        ) : (
          filtered.map((o) => {
            const st = statusMeta(o.status);
            const sectorText = normalizeSector(o);
            const amount = normalizeAmount(o);

            return (
              <div key={o.id} className="px-4 md:px-6 py-4 border-b last:border-b-0">
                <div className="flex flex-col md:grid md:grid-cols-12 md:gap-2 md:items-center gap-3">
                  <div className="md:col-span-5 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-extrabold text-slate-900 truncate">{o.title || "—"}</div>
                      <span className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>

                    <div className="text-slate-600 text-sm line-clamp-2 mt-1">{sectorText}</div>
                  </div>

                  <div className="md:col-span-3 text-sm text-slate-700 font-semibold">
                    {toDate(o.launch_date ?? o.launchDate)} → {toDate(o.deadline_date ?? o.deadlineDate)}
                  </div>

                  <div className="md:col-span-2 text-sm text-slate-900 font-extrabold">
                    {formatMoney(amount)} €
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-2">
                    <Button
                      onClick={() => openDetails(o)}
                      className="h-11 w-11 p-0 rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                      title="Voir détails"
                    >
                      <Eye size={18} />
                    </Button>

                    <Button
                      onClick={() => openSubmit(o)}
                      className="h-11 rounded-2xl bg-slate-900 text-white hover:bg-black"
                      title="Soumissionner"
                    >
                      <Send size={18} className="mr-2" />
                      Soumissionner
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <OfferDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        offer={selectedOffer}
      />

      {/* ✅ Modal soumission: on réutilise ton AddProjectModal */}
      <AddProjectModal
        isOpen={submitOpen}
        onClose={() => setSubmitOpen(false)}
        userId={userId}
        userRole={userRole}
        onSuccess={handleSubmitted}
      />
    </div>
  );
};
