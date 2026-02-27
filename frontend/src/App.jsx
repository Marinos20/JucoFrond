import React, { useEffect, useMemo, useState } from "react";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Footer } from "./components/footer";

import { SuperAdminDashboard } from "./components/dashboards/superAdmin/SuperAdminDashboard";
import { SchoolAdminDashboard } from "./components/dashboards/schoolAdmin/SchoolAdminDashboard";
import { ProjectSubmissionDashboard } from "./components/dashboards/parentAdmin/ProjectSubmissionDashboard";
import { ProfileCompletionPage } from "./components/dashboards/parentAdmin/ProfileCompletionPage";

import { DashboardLayout } from "./components/layouts/DashboardLayout";

import { Cta } from "./components/cta";
import { TestimonialsCarousel } from "./components/testimonials";
import { Features } from "./components/features";
import Faq from "./components/faq";
import { ContactPage } from "./components/contactPage";
import { NotFound } from "./components/NotFound";
import VerifyParentEmail from "./components/pages/VerifyParentEmail";

import { PublicSubmissionModal } from "./components/PublicSubmissionModal"; // ✅ AJOUT
import { api } from "./services/api";

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);

  // ✅ Modal public: soumission sans connexion
  const [openSubmit, setOpenSubmit] = useState(false);

  const dashboardRole = useMemo(() => currentUser?.role || null, [currentUser]);

  /* =========================
     INIT + RESTORE SESSION
  ========================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     CHECK URL POUR VERIFY EMAIL
  ========================= */
  const path = window.location.pathname;

  if (path.startsWith("/verify-parent-email/")) {
    const token = path.split("/verify-parent-email/")[1];
    return <VerifyParentEmail token={token} />;
  }

  /* =========================
     CHECK PARENT PROFILE STATUS
  ========================= */
  useEffect(() => {
    const fetchProfileStatus = async () => {
      if (currentUser?.role === "parent") {
        try {
          const res = await api.parent.profile.status();
          setProfileStatus(Boolean(res?.profile_completed));
        } catch (err) {
          console.error("Profile status error:", err);
          setProfileStatus(false);
        }
      } else {
        setProfileStatus(null);
      }
    };

    fetchProfileStatus();
  }, [currentUser]);

  /* =========================
     AUTH HANDLERS
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setProfileStatus(null);
    setView("landing");
    window.scrollTo(0, 0);
  };

  /* =========================
     HERO CTA HANDLER (PUBLIC)
     ✅ OUVRE LE MODAL SANS CONNEXION
  ========================= */
  const handleSubmitProjectClick = () => {
    console.log("App: Hero submit click (PUBLIC)");
    setOpenSubmit(true);
  };

  /* =========================
     ROUTAGE PAR RÔLE (inchangé)
  ========================= */
  if (dashboardRole === "super_admin") {
    return <SuperAdminDashboard onLogout={handleLogout} user={currentUser} />;
  }

  if (dashboardRole === "school_admin") {
    return <SchoolAdminDashboard onLogout={handleLogout} user={currentUser} />;
  }

  if (dashboardRole === "parent") {
    if (profileStatus === null) {
      return (
        <div className="h-screen flex items-center justify-center">
          <span className="text-slate-600">Chargement du profil...</span>
        </div>
      );
    }

    if (profileStatus === false) {
      return (
        <DashboardLayout
          userInitial={currentUser?.first_name?.[0] || "P"}
          userRoleLabel="Parent · Profil incomplet"
          sidebarItems={[]}
          onLogout={handleLogout}
        >
          <ProfileCompletionPage onCompleted={() => setProfileStatus(true)} />
        </DashboardLayout>
      );
    }

    return <ProjectSubmissionDashboard user={currentUser} onLogout={handleLogout} />;
  }

  /* =========================
     FALLBACK 404 LOGIQUE
  ========================= */
  if (!["landing"].includes(view)) {
    return <NotFound onBack={() => setView("landing")} />;
  }

  /* =========================
     LANDING PAGE (PUBLIC)
  ========================= */
  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans selection:bg-slate-900 selection:text-white">
      <Header scrolled={scrolled} onLoginClick={() => setView("landing")} />

      <main>
        {/* ✅ IMPORTANT : soumission sans connexion */}
        <Hero onSubmitProjectClick={handleSubmitProjectClick} />

        {/* ✅ MODAL PUBLIC */}
        <PublicSubmissionModal
          open={openSubmit}
          onClose={() => setOpenSubmit(false)}
          offerId={"1"} // ⚠️ remplace par un vrai offerId (offre active)
          offerTitle={"Financement Pro"}
        />

        <Features id="features" />
        <TestimonialsCarousel />
        <Faq />
      </main>

      <Cta id="solution" />
      <ContactPage id="contact" />
      <Footer />
    </div>
  );
};

export default App;