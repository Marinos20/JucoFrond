import React, { useState } from "react";
import { X, Loader2, Send } from "lucide-react";
import { Button } from "../ui/button";
import { api } from "../../services/api";

export const PublicSubmissionModal = ({
  open,
  onClose,
  offerId,
  offerTitle,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    project_title: "",
    project_description: "",
  });

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.public.submitOffer(offerId, form); 
      // 👉 Tu devras créer cette route dans ton api.js

      setSuccess(true);
    } catch (err) {
      alert(err?.message || "Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white">
          <h3 className="text-lg md:text-xl font-bold">
            Soumettre un projet
          </h3>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <X size={20} color="currentColor" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto">
          {success ? (
            <div className="text-center py-12">
              <div className="text-2xl font-extrabold text-emerald-600">
                🎉 Soumission envoyée !
              </div>
              <p className="text-slate-600 mt-3">
                Nous avons bien reçu votre projet pour :
              </p>
              <div className="font-bold mt-2">{offerTitle}</div>

              <Button
                onClick={onClose}
                className="mt-6 bg-slate-900 text-white rounded-2xl"
              >
                Fermer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom / Prénom */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Prénom"
                  value={form.first_name}
                  onChange={(e) =>
                    handleChange("first_name", e.target.value)
                  }
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
                />

                <input
                  required
                  placeholder="Nom"
                  value={form.last_name}
                  onChange={(e) =>
                    handleChange("last_name", e.target.value)
                  }
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Email / Téléphone */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value)
                  }
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
                />

                <input
                  placeholder="Téléphone"
                  value={form.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Projet */}
              <input
                required
                placeholder="Titre du projet"
                value={form.project_title}
                onChange={(e) =>
                  handleChange("project_title", e.target.value)
                }
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold outline-none focus:ring-4 focus:ring-indigo-500/10"
              />

              <textarea
                required
                rows={5}
                placeholder="Description du projet"
                value={form.project_description}
                onChange={(e) =>
                  handleChange("project_description", e.target.value)
                }
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
              />

              {/* Submit */}
              <Button
                disabled={loading}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black"
              >
                {loading ? (
                  <Loader2
                    className="animate-spin"
                    color="currentColor"
                  />
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Envoyer la soumission
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
