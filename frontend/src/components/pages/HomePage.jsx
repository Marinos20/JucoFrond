import React, { useState } from "react";
import { Header } from "./header";
import { Hero } from "./hero";
import { LoginModal } from "./auth/loginModal";
import { PublicSubmissionModal } from "../PublicSubmissionModal"; // ✅ adapte si chemin différent

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // 🔐 OUVERTURE LOGIN (HEADER + HERO)
  const openLogin = () => {
    setShowAuth(true);
  };

  // ✅ CTA "Soumettre un projet"
  const handleSubmitProjectClick = () => {
    // Debug (tu peux retirer après)
    console.log("HomePage: Submit click", { user: !!user });

    if (!user) {
      openLogin();
      return;
    }

    // ✅ Ouvre le formulaire (modal) au lieu de rediriger
    setOpenSubmit(true);
  };

  // ✅ Succès login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);

    // ✅ Après login, on ouvre directement le modal de soumission
    setOpenSubmit(true);

    // Si tu préfères rediriger au lieu d’ouvrir le modal :
    // window.location.href = "/parent/projects";
  };

  return (
    <>
      <Header onLoginClick={openLogin} />

      <Hero onSubmitProjectClick={handleSubmitProjectClick} />

      {/* ✅ MODAL DE SOUMISSION (PUBLIC) */}
      <PublicSubmissionModal
        open={openSubmit}
        onClose={() => setOpenSubmit(false)}
        offerId={"1"} // ⚠️ remplace par un vrai offerId
        offerTitle={"Financement Pro"}
      />

      {/* ✅ LOGIN MODAL */}
      {showAuth && (
        <LoginModal
          onBack={() => setShowAuth(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}