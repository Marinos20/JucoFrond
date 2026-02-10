import React, { useMemo } from "react";
import { X, Eye, Download } from "lucide-react";
import { Button } from "../../ui/button";

const Field = ({ label, value }) => {
  const display =
    value === undefined || value === null || String(value).trim() === ""
      ? null
      : value;

  return (
    <div className="border rounded-xl p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="text-sm text-slate-900 whitespace-pre-wrap">
        {display ? display : <span className="text-slate-400">—</span>}
      </p>
    </div>
  );
};

// ✅ helpers
const safeJson = (val, fallback) => {
  if (val === undefined || val === null) return fallback;
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return parsed;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const joinList = (val) => {
  // accepte array, JSON string, string simple
  const arr = safeJson(val, null);
  if (Array.isArray(arr)) return arr.filter(Boolean).join("\n");
  if (typeof val === "string" && val.trim() !== "") return val;
  return "";
};

const formatDate = (val) => {
  if (!val) return "";
  // si déjà au format YYYY-MM-DD, on laisse
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10);
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? String(val) : d.toISOString().slice(0, 10);
};

export const ViewProjectModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  const openUrl = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ✅ normalisation : supporte snake_case (DB) + camelCase (front legacy)
  const normalized = useMemo(() => {
    const p = project || {};

    const projectFiles = safeJson(p.project_files ?? p.projectFiles, []);
    const budgetFiles = safeJson(p.budget_files ?? p.budgetFiles, []);

    return {
      // Titres
      title: p.title ?? p.project_name ?? p.projectName ?? "",
      theme: p.theme ?? "", // si tu n'as pas de colonne theme, ça restera vide (normal)

      description: p.description ?? "",

      objectives: joinList(p.objectives),
      specificObjectives: joinList(p.specific_objectives ?? p.specificObjectives),

      organizationName: p.organization_name ?? p.organizationName ?? "",
      acronym: p.acronym ?? "",
      creationDate: formatDate(p.creation_date ?? p.creationDate),
      legalStatus: p.legal_status ?? p.legalStatus ?? "",

      sectors: joinList(p.sectors),
      participants: p.participants_count ?? p.participants ?? "",
      activityNature: p.activity_nature ?? p.activityNature ?? "",

      urbanRural: p.location_type ?? p.urbanRural ?? "",
      locations: p.project_location ?? p.locations ?? "",
      startDate: formatDate(p.start_date ?? p.startDate),
      country: p.country ?? "",
      address: p.address ?? "",
      website: p.website ?? "",

      responsibleName: p.responsible_name ?? p.responsibleName ?? "",
      responsibleTitle: p.responsible_title ?? p.responsibleTitle ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",

      consortiumMembers: p.consortium ?? p.consortiumMembers ?? "",
      boardMembers: joinList(p.board_members ?? p.boardMembers),

      expectedResults: p.expected_results ?? p.expectedResults ?? "",
      sustainability: p.sustainability ?? "",
      knowledgeTransfer: p.knowledge_transfer ?? p.knowledgeTransfer ?? "",
      innovation: p.innovation ?? "",

      // pièces jointes (tableaux)
      projectFiles,
      budgetFiles,
    };
  }, [project]);

  const firstProjectFile = normalized.projectFiles?.[0] || "";
  const firstBudgetFile = normalized.budgetFiles?.[0] || "";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Eye size={18} /> Détails du projet (lecture seule)
          </h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Titre" value={normalized.title} />
          <Field label="Thème(s)" value={normalized.theme} />

          <Field label="Description" value={normalized.description} />

          <Field label="Objectif principal" value={normalized.objectives} />
          <Field label="Objectifs spécifiques" value={normalized.specificObjectives} />

          <Field label="Organisation" value={normalized.organizationName} />
          <Field label="Acronyme" value={normalized.acronym} />
          <Field label="Date de création" value={normalized.creationDate} />
          <Field label="Statut juridique" value={normalized.legalStatus} />

          <Field label="Secteurs" value={normalized.sectors} />
          <Field label="Participants" value={String(normalized.participants || "")} />
          <Field label="Nature des activités" value={normalized.activityNature} />

          <Field label="Urbain/Rural" value={normalized.urbanRural} />
          <Field label="Lieux" value={normalized.locations} />
          <Field label="Date de début" value={normalized.startDate} />
          <Field label="Pays" value={normalized.country} />
          <Field label="Adresse" value={normalized.address} />
          <Field label="Site web" value={normalized.website} />

          <Field label="Responsable (nom)" value={normalized.responsibleName} />
          <Field label="Responsable (titre)" value={normalized.responsibleTitle} />
          <Field label="Téléphone" value={normalized.phone} />
          <Field label="Email" value={normalized.email} />

          <Field label="Membres du consortium" value={normalized.consortiumMembers} />
          <Field label="Membres du board" value={normalized.boardMembers} />

          <Field label="Résultats attendus" value={normalized.expectedResults} />
          <Field label="Durabilité" value={normalized.sustainability} />
          <Field label="Transfert de connaissances" value={normalized.knowledgeTransfer} />
          <Field label="Innovation" value={normalized.innovation} />
        </div>

        {/* ✅ Pièces jointes basées sur project_files / budget_files */}
        <div className="mt-6 space-y-3">
          <p className="font-semibold text-slate-900">Pièces jointes</p>

          <div className="flex flex-wrap gap-2">
            {firstProjectFile ? (
              <Button variant="outline" onClick={() => openUrl(firstProjectFile)}>
                <Download size={16} /> Projet (fichier)
              </Button>
            ) : (
              <span className="text-sm text-slate-400">Aucun fichier projet</span>
            )}

            {firstBudgetFile ? (
              <Button variant="outline" onClick={() => openUrl(firstBudgetFile)}>
                <Download size={16} /> Budget (fichier)
              </Button>
            ) : (
              <span className="text-sm text-slate-400">Aucun fichier budget</span>
            )}
          </div>

          {/* optionnel: afficher la liste complète */}
          {(normalized.projectFiles?.length > 1 || normalized.budgetFiles?.length > 1) && (
            <div className="text-xs text-slate-500">
              {normalized.projectFiles?.length > 1 && (
                <div>Fichiers projet: {normalized.projectFiles.length}</div>
              )}
              {normalized.budgetFiles?.length > 1 && (
                <div>Fichiers budget: {normalized.budgetFiles.length}</div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button onClick={onClose} className="w-full bg-slate-900 text-white">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
