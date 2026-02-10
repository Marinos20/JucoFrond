// 📜 src/components/dashboards/superAdmin/ProjectsView.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { DataTable } from "../../ui/DataTable";
import { Button } from "../../ui/button";
import { api } from "../../../services/api";

// ✅ FIX IMPORT: le modal est dans parentAdmin
// 👉 Chemin correct depuis: src/components/dashboards/superAdmin/ProjectsView.jsx
// parentAdmin est à: src/components/dashboards/parentAdmin/ViewProjectModal.jsx
import { ViewProjectModal } from "../parentAdmin/ViewProjectModal";

// ✅ helper date
const fmt = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? String(d) : dt.toLocaleString();
};

const pickTitle = (p) =>
  p?.title || p?.project_name || p?.projectName || p?.name || "—";

const pickSubmitterName = (p) =>
  p?.parent_name ||
  p?.parentName ||
  p?.submitter_name ||
  p?.submitterName ||
  (p?.first_name || p?.last_name
    ? `${p.first_name || ""} ${p.last_name || ""}`.trim()
    : "") ||
  "—";

export const ProjectsView = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchAllProjects = async () => {
    setIsLoading(true);
    try {
      // ✅ Route attendue: GET /api/super-admin/projects
      // attendu: { success:true, data:[...] }
      const res = await api.superAdmin.projects.getAll();
      const data = Array.isArray(res?.data) ? res.data : [];

      const normalized = data.map((p) => {
        const title = pickTitle(p);

        return {
          ...p,

          // champs affichés
          parent_name: pickSubmitterName(p),
          parent_email:
            p?.parent_email ||
            p?.parentEmail ||
            p?.submitter_email ||
            p?.submitterEmail ||
            p?.email ||
            "",
          parent_phone:
            p?.parent_phone ||
            p?.parentPhone ||
            p?.submitter_phone ||
            p?.submitterPhone ||
            p?.phone_number ||
            p?.phone ||
            "",

          // champ stable pour la recherche
          title_search: title,

          email_verified:
            p?.email_verified === true ||
            p?.email_verified === 1 ||
            p?.email_verified === "1",
        };
      });

      setProjects(normalized);
    } catch (e) {
      console.error("Erreur chargement projets:", e);
      alert(e?.message || "Impossible de charger les projets.");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "title_search",
        header: "Projet",
        cell: ({ row }) => pickTitle(row.original),
      },
      {
        accessorKey: "parent_name",
        header: "Soumissionnaire",
        cell: ({ row }) => row.original.parent_name || "—",
      },
      {
        accessorKey: "parent_email",
        header: "Email",
        cell: ({ row }) => row.original.parent_email || "—",
      },
      {
        accessorKey: "parent_phone",
        header: "Téléphone",
        cell: ({ row }) => row.original.parent_phone || "—",
      },
      {
        accessorKey: "created_at",
        header: "Soumis le",
        cell: ({ row }) => fmt(row.original.created_at),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
            onClick={() => {
              setSelectedProject(row.original);
              setOpenModal(true);
            }}
            title="Voir le projet"
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900">Soumissions</h2>
          <p className="text-slate-500 mt-1">
            Tous les projets soumis + infos du soumissionnaire.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchAllProjects}
          disabled={isLoading}
          className="rounded-xl"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Rafraîchir
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin h-12 w-12 opacity-40" />
        </div>
      ) : projects.length === 0 ? (
        <div className="p-6 border rounded-2xl text-slate-600">
          Aucune soumission pour le moment.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          searchColumn="title_search"
          filterPlaceholder="Rechercher par titre..."
        />
      )}

      <ViewProjectModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />
    </div>
  );
};
