// ✅ src/App.jsx
// - ouverture modal login
// - soumission publique sans connexion
// - récupération offre active
// - routing dashboard par rôle
// - redirection automatique après login

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

import { PublicSubmissionModal } from "./components/PublicSubmissionModal";
import { LoginModal } from "./components/auth/loginModal";

import { api } from "./services/api";

const App = () => {

  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState("landing");

  const [currentUser, setCurrentUser] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);

  // modal soumission publique
  const [openSubmit, setOpenSubmit] = useState(false);

  // modal login
  const [openLogin, setOpenLogin] = useState(false);

  // offre active
  const [activeOffer, setActiveOffer] = useState(null);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState(null);

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
     LOGIN SUCCESS
  ========================= */
  const handleLoginSuccess = (user) => {

    localStorage.setItem("user", JSON.stringify(user));

    setCurrentUser(user);
    setOpenLogin(false);

  };

  /* =========================
     VERIFY EMAIL PAGE
  ========================= */
  const path = window.location.pathname;

  if (path.startsWith("/verify-parent-email/")) {
    const token = path.split("/verify-parent-email/")[1];
    return <VerifyParentEmail token={token} />;
  }

  /* =========================
     FETCH PUBLIC OFFERS
  ========================= */
  useEffect(() => {

    const fetchActiveOffer = async () => {

      setOfferLoading(true);
      setOfferError(null);

      try {

        const res = await api.public.getOffers();

        const list = Array.isArray(res?.data) ? res.data : [];

        const published = list.find(
          (o) => String(o?.status || "").toLowerCase() === "published"
        );

        setActiveOffer(published || list[0] || null);

      } catch (err) {

        console.error("Fetch offers error:", err);
        setOfferError(err?.message || "Impossible de charger les offres");
        setActiveOffer(null);

      } finally {

        setOfferLoading(false);

      }

    };

    if (!dashboardRole) fetchActiveOffer();

  }, [dashboardRole]);

  /* =========================
     CHECK PARENT PROFILE
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
     LOGOUT
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
     HERO CTA CLICK
  ========================= */
  const handleSubmitProjectClick = () => {

    if (offerLoading) {
      alert("Chargement des offres... réessaie dans quelques secondes.");
      return;
    }

    if (!activeOffer?.id) {
      alert(offerError || "Aucune offre disponible pour le moment.");
      return;
    }

    setOpenSubmit(true);

  };

  /* =========================
     ROUTING DASHBOARD
  ========================= */

  if (dashboardRole === "super_admin") {

    return (
      <SuperAdminDashboard
        onLogout={handleLogout}
        user={currentUser}
      />
    );

  }

  if (dashboardRole === "school_admin") {

    return (
      <SchoolAdminDashboard
        onLogout={handleLogout}
        user={currentUser}
      />
    );

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
          <ProfileCompletionPage
            onCompleted={() => setProfileStatus(true)}
          />
        </DashboardLayout>
      );

    }

    return (
      <ProjectSubmissionDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );

  }

  /* =========================
     FALLBACK
  ========================= */

  if (!["landing"].includes(view)) {
    return <NotFound onBack={() => setView("landing")} />;
  }

  /* =========================
     LANDING PAGE
  ========================= */

  return (

    <div className="min-h-screen bg-white text-slate-950 font-sans selection:bg-slate-900 selection:text-white">

      {/* HEADER */}
      <Header
        scrolled={scrolled}
        onLoginClick={() => setOpenLogin(true)}
      />

      <main>

        <Hero onSubmitProjectClick={handleSubmitProjectClick} />

        {/* MODAL SOUMISSION PUBLIQUE */}
        <PublicSubmissionModal
          open={openSubmit}
          onClose={() => setOpenSubmit(false)}
          offerId={activeOffer?.id}
          offerTitle={activeOffer?.title || "Soumission"}
        />

        {/* MODAL LOGIN */}
        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
          onLoginSuccess={handleLoginSuccess}
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