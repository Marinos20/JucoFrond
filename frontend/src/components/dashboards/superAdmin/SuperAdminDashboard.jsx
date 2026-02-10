// 📜 src/components/dashboards/superAdmin/SuperAdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { SchoolsView } from "./SchoolsView";
import { SettingsView } from "./SettingsView";
import { NotificationsView } from "./NotificationsView";
import { ProjectsView } from "./ProjectsView";
import { ParentsView } from "./ParentsView";
import {
  LayoutDashboard,
  Building2,
  Bell,
  Settings,
  ClipboardList,
  User,
  Users,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../ui/button";
import { api } from "../../../services/api";

/* =========================
   ✅ Overview (avec stats)
   Back: GET /api/super-admin/stats
   -> { success:true, data:{ total_projects, total_parents, total_schools, ... } }
========================= */
const StatCard = ({ label, value, icon, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-slate-500 text-sm font-semibold">{label}</div>
        <div className="text-3xl font-black text-slate-900 mt-2">
          {loading ? <span className="text-slate-300">—</span> : value}
        </div>
      </div>
      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
        {icon}
      </div>
    </div>
  </div>
);

const Overview = ({ stats, loading, onRefresh }) => {
  // ✅ FIX: champs réels renvoyés par ton controller getStats()
  const projects = Number(stats?.total_projects ?? 0);
  const parents = Number(stats?.total_parents ?? 0);
  const schools = Number(stats?.total_schools ?? 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Vue d&apos;ensemble
          </h1>
          <p className="text-slate-500 mt-1">Métriques globales de la plateforme.</p>
        </div>

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-xl"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Projets soumis"
          value={projects}
          loading={loading}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Personnes inscrites"
          value={parents}
          loading={loading}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Admins de projets"
          value={schools}
          loading={loading}
          icon={<Building2 className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-xl shadow-slate-200">
          <div className="relative z-10">
            <div className="text-slate-400 text-sm font-medium mb-1">
              Revenu Total (YTD)
            </div>
            <div className="text-3xl font-bold mb-4">...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SuperAdminDashboard = ({ onLogout, user }) => {
  const [currentView, setCurrentView] = useState("overview");

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.superAdmin.stats.get();
      setStats(res?.data || null);
    } catch (e) {
      console.error("Erreur stats:", e);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const sidebarItems = useMemo(
    () => [
      { icon: <LayoutDashboard />, label: "Vue d'ensemble", id: "overview", onClick: () => setCurrentView("overview") },
      { icon: <Building2 />, label: "Admin", id: "schools", onClick: () => setCurrentView("schools") },
      { icon: <ClipboardList />, label: "Projets", id: "projects", onClick: () => setCurrentView("projects") },
      { icon: <User />, label: "Inscrit", id: "parents", onClick: () => setCurrentView("parents") },
      { icon: <Bell />, label: "Notifications", id: "notifications", onClick: () => setCurrentView("notifications") },
      { icon: <Settings />, label: "Paramètres", id: "settings", onClick: () => setCurrentView("settings") },
    ],
    []
  );

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <Overview stats={stats} loading={statsLoading} onRefresh={fetchStats} />;
      case "schools":
        return <SchoolsView />;
      case "projects":
        return <ProjectsView />;
      case "parents":
        return <ParentsView />;
      case "settings":
        return <SettingsView />;
      case "notifications":
        return <NotificationsView />;
      default:
        return <div>...</div>;
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems.map((item) => ({ ...item, active: currentView === item.id }))}
      userInitial={user?.name?.[0] || "S"}
      userRoleLabel="Super Admin"
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};
