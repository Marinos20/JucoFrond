// ✅ src/App.jsx (UPDATED - PUBLIC SUBMISSION MODAL + REAL offerId)
// - ouvre le modal sans connexion
// - récupère l'offre "active" depuis l'API public (1ère offre publiée si dispo)
// - passe offerId réel au modal (au lieu de "1")

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
import { api } from "./services/api";

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);

  // ✅ Modal public
  const [openSubmit, setOpenSubmit] = useState(false);

  // ✅ Offre "active" pour la soumission publique
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
     CHECK URL POUR VERIFY EMAIL
  ========================= */
  const path = window.location.pathname;

  if (path.startsWith("/verify-parent-email/")) {
    const token = path.split("/verify-parent-email/")[1];
    return <VerifyParentEmail token={token} />;
  }

  /* =========================
     FETCH OFFERS (PUBLIC) -> pick active offer
     ⚠️ suppose que l'endpoint GET /api/offers est public (tu l'as mis à jour)
  ========================= */
  useEffect(() => {
    const fetchActiveOffer = async () => {
      setOfferLoading(true);
      setOfferError(null);

      try {
        const res = await api.public.getOffers();
        const list = Array.isArray(res?.data) ? res.data : [];

        // Priorité: status === "published" sinon première offre
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

    // seulement quand on est sur landing (public)
    if (!dashboardRole) fetchActiveOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardRole]);

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
  ========================= */
  const handleSubmitProjectClick = () => {
    console.log("App: Hero submit click (PUBLIC)");

    if (offerLoading) {
      alert("Chargement des offres... réessaie dans 2 secondes.");
      return;
    }

    if (!activeOffer?.id) {
      alert(offerError || "Aucune offre disponible pour le moment.");
      return;
    }

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

    return (
      <ProjectSubmissionDashboard user={currentUser} onLogout={handleLogout} />
    );
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
        <Hero onSubmitProjectClick={handleSubmitProjectClick} />

        {/* ✅ MODAL PUBLIC */}
        <PublicSubmissionModal
          open={openSubmit}
          onClose={() => setOpenSubmit(false)}
          offerId={activeOffer?.id}
          offerTitle={activeOffer?.title || "Soumission"}
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