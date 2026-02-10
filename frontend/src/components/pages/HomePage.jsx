import React, { useState } from "react";
import { Header } from "./header";
import { Hero } from "./hero";
import { LoginModal } from "./auth/loginModal";

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // 🔐 OUVERTURE LOGIN (HEADER + HERO)
  const openLogin = () => {
    setShowAuth(true);
  };

  // CTA "Soumettre un projet"
  const handleSubmitProjectClick = () => {
    if (!user) {
      openLogin();
    } else {
      window.location.href = "/parent/projects";
    }
  };

  // Succès login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
    window.location.href = "/parent/projects";
  };

  return (
    <>
      <Header onLoginClick={openLogin} />

      <Hero onSubmitProjectClick={handleSubmitProjectClick} />

      {showAuth && (
        <LoginModal
          onBack={() => setShowAuth(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
