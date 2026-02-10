import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { api } from '../../../services/api';

/**
 * Utils
 */
const isEmpty = (v) =>
  v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

const toNumberOrEmpty = (v) => {
  if (isEmpty(v)) return '';
  const n = Number(String(v).replace(/\s/g, '').replace(/,/g, '.'));
  return Number.isFinite(n) ? n : '';
};

const splitToArray = (v) => {
  // Accepte:
  // - "a, b, c" -> ["a","b","c"]
  // - "a\nb\nc" -> ["a","b","c"]
  // - "a" -> ["a"]
  // - "" -> []
  if (isEmpty(v)) return [];
  if (Array.isArray(v)) return v;

  const s = String(v).trim();

  // si l’utilisateur colle un JSON array
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) return parsed;
  } catch {}

  // split par virgule OU retour ligne
  return s
    .split(/,|\n/g)
    .map((x) => x.trim())
    .filter(Boolean);
};

export const AddProjectModal = ({ isOpen, onClose, schoolId, onSuccess }) => {
  const initialState = {
    title: '',
    theme: '',
    description: '',

    // texte -> array côté back
    objectives: '',
    specificObjectives: '',

    implementationPeriod: '', // months (int)
    budgetTotal: '',          // decimal
    amountRequested: '',      // decimal

    organizationName: '',
    acronym: '',
    creationDate: '',
    legalStatus: '',

    sectors: '',              // texte -> array
    participants: '',         // int
    activityNature: '',
    urbanRural: '',
    locations: '',
    startDate: '',
    country: '',
    address: '',
    website: '',

    responsibleName: '',
    responsibleTitle: '',
    phone: '',
    email: '',

    consortiumMembers: '',
    boardMembers: '',         // texte -> array

    beneficiaries: '',        // ✅ NEW (si tu veux l’utiliser)
    expectedResults: '',
    sustainability: '',
    knowledgeTransfer: '',
    innovation: '',

    projectFiles: null,
    budgetFiles: null,

    confirmation: false,
  };

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.confirmation) {
      alert("Veuillez confirmer la soumission.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = new FormData();

      /**
       * ✅ Build un objet "clean" :
       * - arrays pour champs liste
       * - nombres pour champs numériques
       * - on n’envoie pas les champs vides
       */
      const cleaned = {
        title: formData.title,
        theme: formData.theme,
        description: formData.description,

        // arrays
        objectives: splitToArray(formData.objectives),
        specificObjectives: splitToArray(formData.specificObjectives),
        sectors: splitToArray(formData.sectors),
        boardMembers: splitToArray(formData.boardMembers),
        beneficiaries: splitToArray(formData.beneficiaries),

        // nums
        implementationPeriod: toNumberOrEmpty(formData.implementationPeriod),
        budgetTotal: toNumberOrEmpty(formData.budgetTotal),
        amountRequested: toNumberOrEmpty(formData.amountRequested),
        participants: toNumberOrEmpty(formData.participants),

        // strings
        organizationName: formData.organizationName,
        acronym: formData.acronym,
        creationDate: formData.creationDate,
        legalStatus: formData.legalStatus,

        activityNature: formData.activityNature,
        urbanRural: formData.urbanRural,
        locations: formData.locations,
        startDate: formData.startDate,
        country: formData.country,
        address: formData.address,
        website: formData.website,

        responsibleName: formData.responsibleName,
        responsibleTitle: formData.responsibleTitle,
        phone: formData.phone,
        email: formData.email,

        consortiumMembers: formData.consortiumMembers,

        expectedResults: formData.expectedResults,
        sustainability: formData.sustainability,
        knowledgeTransfer: formData.knowledgeTransfer,
        innovation: formData.innovation,

        confirmation: formData.confirmation,
      };

      // ✅ Append uniquement ce qui a une valeur utile
      Object.entries(cleaned).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // on envoie JSON string d'array (compatible controller)
          if (value.length > 0) payload.append(key, JSON.stringify(value));
          return;
        }

        if (typeof value === 'number') {
          // si NaN impossible ici, toNumberOrEmpty protège
          payload.append(key, String(value));
          return;
        }

        if (!isEmpty(value)) {
          payload.append(key, value);
        }
      });

      // ✅ fichiers (ne jamais mettre null)
      if (formData.projectFiles) payload.append('projectFiles', formData.projectFiles);
      if (formData.budgetFiles) payload.append('budgetFiles', formData.budgetFiles);

      // ⚠️ Ton backend actuel n’utilise pas school_id dans createProject.
      // Si tu as une colonne school_id en DB et tu veux le stocker, garde cette ligne ET mappe côté controller.
      // if (!isEmpty(schoolId)) payload.append('school_id', schoolId);

      await api.projects.create(payload);

      if (onSuccess) onSuccess();
      onClose();
      setFormData(initialState);
    } catch (err) {
      // handleFetch renvoie parfois un objet {message}
      const msg = err?.message || err?.error || JSON.stringify(err);
      alert("Erreur: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Nouvelle Soumission de Projet</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            required
            placeholder="Titre du projet"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Thème(s) ciblé(s)"
            value={formData.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Description brève du projet"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Objectif principal du projet (sépare par virgule ou saut de ligne si plusieurs)"
            value={formData.objectives}
            onChange={(e) => handleChange('objectives', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Objectifs spécifiques (sépare par virgule ou saut de ligne si plusieurs)"
            value={formData.specificObjectives}
            onChange={(e) => handleChange('specificObjectives', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Nom de l'organisation candidate"
            value={formData.organizationName}
            onChange={(e) => handleChange('organizationName', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Acronyme"
            value={formData.acronym}
            onChange={(e) => handleChange('acronym', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            type="date"
            value={formData.creationDate}
            onChange={(e) => handleChange('creationDate', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Statut juridique"
            value={formData.legalStatus}
            onChange={(e) => handleChange('legalStatus', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Domaines / secteurs d'intervention (sépare par virgule ou saut de ligne)"
            value={formData.sectors}
            onChange={(e) => handleChange('sectors', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Nombre de participants"
            value={formData.participants}
            onChange={(e) => handleChange('participants', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Nature des activités"
            value={formData.activityNature}
            onChange={(e) => handleChange('activityNature', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <select
            value={formData.urbanRural}
            onChange={(e) => handleChange('urbanRural', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="">Ville / Campagne / Les deux ?</option>
            <option value="Rural">Rural</option>
            <option value="Ville">Ville</option>
            <option value="Les deux">Les deux</option>
          </select>

          <input
            placeholder="Lieu(x) de mise en œuvre"
            value={formData.locations}
            onChange={(e) => handleChange('locations', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Pays"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Adresse complète"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Nom complet de la personne responsable"
            value={formData.responsibleName}
            onChange={(e) => handleChange('responsibleName', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Poste / titre"
            value={formData.responsibleTitle}
            onChange={(e) => handleChange('responsibleTitle', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            type="tel"
            placeholder="Numéro de téléphone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            type="email"
            placeholder="Adresse électronique"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Durée (mois)"
            value={formData.implementationPeriod}
            onChange={(e) => handleChange('implementationPeriod', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Budget total"
            value={formData.budgetTotal}
            onChange={(e) => handleChange('budgetTotal', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Montant demandé"
            value={formData.amountRequested}
            onChange={(e) => handleChange('amountRequested', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Bénéficiaires (sépare par virgule ou saut de ligne)"
            value={formData.beneficiaries}
            onChange={(e) => handleChange('beneficiaries', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Résultats attendus"
            value={formData.expectedResults}
            onChange={(e) => handleChange('expectedResults', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Durabilité"
            value={formData.sustainability}
            onChange={(e) => handleChange('sustainability', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Transfert de connaissances"
            value={formData.knowledgeTransfer}
            onChange={(e) => handleChange('knowledgeTransfer', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            placeholder="Innovation"
            value={formData.innovation}
            onChange={(e) => handleChange('innovation', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Membres du board (sépare par virgule ou saut de ligne)"
            value={formData.boardMembers}
            onChange={(e) => handleChange('boardMembers', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            placeholder="Membres du consortium"
            value={formData.consortiumMembers}
            onChange={(e) => handleChange('consortiumMembers', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => handleFileChange('projectFiles', e.target.files?.[0] || null)}
              className="w-full py-2"
            />
            <input
              type="file"
              onChange={(e) => handleFileChange('budgetFiles', e.target.files?.[0] || null)}
              className="w-full py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.confirmation}
              onChange={(e) => handleChange('confirmation', e.target.checked)}
            />
            <span>Je confirme que les informations fournies sont exactes</span>
          </div>

          <Button disabled={isLoading} className="w-full bg-indigo-600 text-white">
            {isLoading ? <Loader2 className="animate-spin" /> : <Check size={16} />} Soumettre
          </Button>
        </form>
      </div>
    </div>
  );
};
