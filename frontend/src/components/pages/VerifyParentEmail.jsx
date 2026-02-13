import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { api } from "../../services/api";

const VerifyParentEmail = ({ token }) => {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setError("Token manquant");
        return;
      }

      try {
        await api.auth.verifyParentEmail(token);
        setStatus("success");
      } catch (e) {
        setStatus("error");
        setError(e?.message || "Lien invalide ou expiré");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white border rounded-2xl p-8 text-center shadow-sm">

        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="animate-spin text-slate-700" size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Vérification en cours...
            </h2>
            <p className="text-sm text-slate-600">
              Merci de patienter quelques secondes.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="text-emerald-600" size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Email vérifié avec succès 🎉
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Votre compte est maintenant activé.
            </p>

            <Button
              className="bg-slate-900 text-white w-full"
              onClick={() => (window.location.href = "/")}
            >
              Aller à la connexion
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="text-rose-600" size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Échec de la vérification
            </h2>
            <p className="text-sm text-rose-600 mb-6">
              {error}
            </p>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = "/")}
            >
              Retour à l’accueil
            </Button>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyParentEmail;
