import React, { useEffect, useState } from "react";
import { Check, Loader2, User, ShieldAlert } from "lucide-react";
import { Button } from "../../ui/button";
import { api } from "../../../services/api";

/* =========================
   🧰 UTILS
========================= */
const isEmpty = (v) =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "");

// ✅ CONVERSION DATE BACKEND → input[type="date"]
const toDateInputValue = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toISOString().split("T")[0]; // yyyy-MM-dd
  } catch {
    return "";
  }
};

/* =========================
   👤 COMPONENT
========================= */
export const ProfileCompletionPage = ({ onCompleted }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    second_first_name: "",
    gender: "",
    birth_date: "",
    preferred_language: "",
    address: "",
    identity_card_number: "",
    identity_card_file: null,
    passport_photo: null,
    emergency_full_name: "",
    emergency_phone: "",
    emergency_relation: "",
  });

  /* =========================
     🔄 LOAD PROFILE
  ========================= */
  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.parent.profile.get();
      const data = res?.profile;

      if (data) {
        setForm({
          title: data.title || "",
          second_first_name: data.second_first_name || "",
          gender: data.gender || "",
          birth_date: toDateInputValue(data.birth_date),
          preferred_language: data.preferred_language || "",
          address: data.address || "",
          identity_card_number: data.identity_card_number || "",
          identity_card_file: null,
          passport_photo: null,
          emergency_full_name: data.emergency_full_name || "",
          emergency_phone: data.emergency_phone || "",
          emergency_relation: data.emergency_relation || "",
        });

        setProfileCompleted(Boolean(data.profile_completed));
      }
    } catch (e) {
      setError(e.message || "Impossible de charger le profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* =========================
     ✏️ HANDLERS
  ========================= */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFile = (field, file) => {
    setForm((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value instanceof File) payload.append(key, value);
        else if (!isEmpty(value)) payload.append(key, value);
      });

      const res = await api.parent.updateProfile(payload);

      const completed = Boolean(res?.profile_completed);
      setProfileCompleted(completed);

      if (completed && typeof onCompleted === "function") {
        onCompleted();
      }
    } catch (e) {
      setError(e.message || "Erreur lors de l’enregistrement");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     🖥️ UI
  ========================= */
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
          <User size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Profil parent</h2>
          <p className="text-slate-600 text-sm">
            Complétez votre profil pour soumettre des projets
          </p>
        </div>
      </div>

      {!profileCompleted && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
          <ShieldAlert className="text-amber-600" />
          <div className="text-sm text-amber-900">
            Votre profil est incomplet. La soumission de projets est bloquée.
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border">
        <select
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
          required
        >
          <option value="">Civilité</option>
          <option value="Mr">Mr</option>
          <option value="Mme">Mme</option>
          <option value="Autre">Autre</option>
        </select>

        <input
          value={form.second_first_name}
          onChange={(e) => handleChange("second_first_name", e.target.value)}
          placeholder="Deuxième prénom (optionnel)"
          className="w-full px-4 py-3 border rounded-xl"
        />

        <select
          value={form.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
          required
        >
          <option value="">Genre</option>
          <option value="male">Homme</option>
          <option value="female">Femme</option>
          <option value="other">Autre</option>
        </select>

        <input
          type="date"
          value={form.birth_date}
          onChange={(e) => handleChange("birth_date", e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <input
          value={form.preferred_language}
          onChange={(e) => handleChange("preferred_language", e.target.value)}
          placeholder="Langue préférée"
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <textarea
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Adresse complète"
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <input
          value={form.identity_card_number}
          onChange={(e) => handleChange("identity_card_number", e.target.value)}
          placeholder="Numéro de pièce d’identité"
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <input type="file" onChange={(e) => handleFile("identity_card_file", e.target.files?.[0])} />
        <input type="file" onChange={(e) => handleFile("passport_photo", e.target.files?.[0])} />

        <input
          value={form.emergency_full_name}
          onChange={(e) => handleChange("emergency_full_name", e.target.value)}
          placeholder="Contact d’urgence – Nom complet"
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <input
          value={form.emergency_phone}
          onChange={(e) => handleChange("emergency_phone", e.target.value)}
          placeholder="Téléphone d’urgence"
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <input
          value={form.emergency_relation}
          onChange={(e) => handleChange("emergency_relation", e.target.value)}
          placeholder="Lien avec le contact d’urgence"
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <Button disabled={saving} className="w-full bg-indigo-600 text-white">
          {saving ? <Loader2 className="animate-spin" /> : <Check size={16} />}
          Enregistrer le profil
        </Button>
      </form>
    </div>
  );
};
