import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Plus,
  Upload,
  Eye,
  Loader2,
  FileText,
  Bell,
  Megaphone,
} from "lucide-react";

import { api } from "../../../services/api";
import { DataTable } from "../../ui/DataTable";
import { Button } from "../../ui/button";
import { DashboardLayout } from "../../layouts/DashboardLayout";

import { AddProjectModal } from "./AddProjectModal";
import { ViewProjectModal } from "./ViewProjectModal";
import { NotificationsView } from "./NotificationsView";
import { OffersSubmissionView } from "./OffersSubmissionView";
import { ProfileCompletionPage } from "./ProfileCompletionPage";

/* =========================================================
   📌 PROJECT SUBMISSION DASHBOARD (PARENT)
========================================================= */
export const ProjectSubmissionDashboard = () => {
  /* =========================
     USER (SÉCURISÉ)
  ========================= */
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    window.location.href = "/login";
    return null;
  }

  const user = JSON.parse(storedUser);
  const userId = user.id;
  const userRole = user.role;

  /* =========================
     PROFIL PARENT (SOURCE UNIQUE)
  ========================= */
  const [profileCompleted, setProfileCompleted] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const checkProfileStatus = async () => {
    setCheckingProfile(true);
    try {
      const res = await api.parent.profile.status();
      const completed = Boolean(res?.profile_completed);

      setProfileCompleted(completed);

      // sync localStorage (frontend uniquement)
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profileCompleted: completed,
        })
      );
    } catch (err) {
      console.error("checkProfileStatus error:", err);
      setProfileCompleted(false);
    } finally {
      setCheckingProfile(false);
    }
  };

  /* =========================
     VIEWS
  ========================= */
  const [activeView, setActiveView] = useState("projects");

  /* =========================
     PROJECTS
  ========================= */
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeProjectsResponse = (res) => {
    const payload = res?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    return [];
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.projects.getByUser();
      setProjects(normalizeProjectsResponse(res));
    } catch (e) {
      console.error("fetchProjects error:", e);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    checkProfileStatus();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     FILE UPLOAD
  ========================= */
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);

  const triggerUpload = (projectId) => {
    setUploadTarget(projectId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    setIsUploading(true);
    try {
      const fakeUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?v=${Date.now()}`;
      await api.projects.uploadFile(uploadTarget, fakeUrl);
      fetchProjects();
    } catch (err) {
      alert(err?.message || "Erreur upload");
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
      e.target.value = null;
    }
  };

  /* =========================
     MODALS
  ========================= */
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const openDetails = (project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const openLastProject = () => {
    if (!projects.length) return;
    const sorted = [...projects].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
    openDetails(sorted[0]);
  };

  /* =========================
     TABLE
  ========================= */
  const projectColumns = useMemo(
    () => [
      { accessorKey: "project_name", header: "Titre" },
      { accessorKey: "category", header: "Catégorie" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openDetails(p)}>
                <Eye size={14} /> Détails
              </Button>
              <Button size="sm" onClick={() => triggerUpload(p.id)}>
                <Upload size={14} /> Fichier
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  /* =========================
     🔒 PROFIL INCOMPLET
  ========================= */
  if (checkingProfile || profileCompleted === null) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!profileCompleted) {
    return (
      <DashboardLayout userInitial="P" userRoleLabel="Parent" sidebarItems={[]}>
        <ProfileCompletionPage
          onCompleted={async () => {
            await checkProfileStatus(); // 🔥 clé anti-boucle
          }}
        />
      </DashboardLayout>
    );
  }

  /* =========================
     SIDEBAR
  ========================= */
  const sidebarItems = [
    { label: "Appels", icon: <Megaphone />, onClick: () => setActiveView("offers") },
    { label: "Projets", icon: <Plus />, onClick: () => setActiveView("projects") },
    { label: "Dernier projet", icon: <FileText />, onClick: openLastProject },
    { label: "Notifications", icon: <Bell />, onClick: () => setActiveView("notifications") },
  ];

  /* =========================
     RENDER
  ========================= */
  return (
    <DashboardLayout
      userInitial="P"
      userRoleLabel="Parent"
      sidebarItems={sidebarItems}
      onLogout={() => {
        localStorage.clear();
        window.location.href = "/login";
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {activeView === "projects" && (
        <>
          <div className="flex justify-between mb-6">
            <h2 className="text-3xl font-bold">Projets soumis</h2>
            <Button onClick={() => setIsAddProjectModalOpen(true)}>
              <Plus size={16} /> Nouveau projet
            </Button>
          </div>
          <DataTable columns={projectColumns} data={projects} />
        </>
      )}

      {activeView === "offers" && <OffersSubmissionView />}
      {activeView === "notifications" && <NotificationsView />}

      <ViewProjectModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        project={selectedProject}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        userId={userId}
        userRole={userRole}
        onSuccess={fetchProjects}
      />
    </DashboardLayout>
  );
};
