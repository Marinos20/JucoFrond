// =====================================================
// 📜 services/api.js (PRODUCTION READY — FINAL)
// =====================================================

/* =========================
   🌍 BASE URL (VITE SAFE)
========================= */
const BASE_URL = (() => {
  const envUrl = import.meta?.env?.VITE_API_URL;

  if (envUrl && typeof envUrl === "string") {
    return envUrl.replace(/\/$/, "");
  }

  // Fallback strict DEV uniquement
  if (import.meta.env.MODE === "development") {
    return "http://127.0.0.1:3000/api";
  }

  throw new Error(
    "❌ VITE_API_URL manquant en production. Vérifie .env.production"
  );
})();

/* =========================
   🔐 HEADERS AVEC TOKEN
========================= */
const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/* =========================
   🌐 FETCH CENTRALISÉ
========================= */
const handleFetch = async (url, options = {}, isFormData = false) => {
  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(isFormData),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error("Le serveur est hors ligne.");
  }

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error("Session expirée, veuillez vous reconnecter.");
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let message = "Erreur API";

    if (isJson) {
      const err = await res.json().catch(() => ({}));
      message = err?.message || err?.error || message;
    }

    throw new Error(message);
  }

  return isJson ? res.json() : null;
};

/* =========================
   📦 API EXPORT
========================= */
export const api = {
  /* ================= AUTH ================= */
  auth: {
    login: async (credentials) => {
      const res = await handleFetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (res?.token) localStorage.setItem("token", res.token);
      if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));

      return res;
    },

    registerParent: (data) =>
      handleFetch(`${BASE_URL}/auth/register-parent`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    resendVerification: (email) =>
      handleFetch(`${BASE_URL}/auth/resend-verification`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  /* ================= PARENT ================= */
  parent: {
    updateProfile: (formData) =>
      handleFetch(
        `${BASE_URL}/parent/profile`,
        { method: "PUT", body: formData },
        true
      ),

    getProfile: () =>
      handleFetch(`${BASE_URL}/parent/profile`),

    profile: {
      get: () =>
        handleFetch(`${BASE_URL}/parent/profile`),

      upsert: (data) =>
        handleFetch(`${BASE_URL}/parent/profile`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),

      status: () =>
        handleFetch(`${BASE_URL}/parent/profile/status`),
    },

    account: {
      get: () =>
        handleFetch(`${BASE_URL}/parent/account`),

      update: (data) =>
        handleFetch(`${BASE_URL}/parent/account`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),

      changePassword: ({ current_password, new_password, confirm_password }) =>
        handleFetch(`${BASE_URL}/parent/account/password`, {
          method: "PUT",
          body: JSON.stringify({
            current_password,
            new_password,
            confirm_password,
          }),
        }),
    },
  },

  /* ================= PROJECTS ================= */
  projects: {
    getMyProjects: () =>
      handleFetch(`${BASE_URL}/projects`),

    getByUser: () =>
      handleFetch(`${BASE_URL}/projects`),

    create: (formData) =>
      handleFetch(
        `${BASE_URL}/projects`,
        { method: "POST", body: formData },
        true
      ),

    uploadFile: (projectId, fileUrl) =>
      handleFetch(`${BASE_URL}/projects/${projectId}/file`, {
        method: "PUT",
        body: JSON.stringify({ file_url: fileUrl }),
      }),
  },

  /* ================= OFFERS ================= */
  offers: {
    getAll: () =>
      handleFetch(`${BASE_URL}/offers`),

    getOne: (id) =>
      handleFetch(`${BASE_URL}/offers/${id}`),

    submit: (offerId, projectId) =>
      handleFetch(`${BASE_URL}/offers/${offerId}/submit`, {
        method: "POST",
        body: JSON.stringify({ project_id: projectId }),
      }),

    create: (data) =>
      handleFetch(`${BASE_URL}/offers`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getSubmissions: (offerId) =>
      handleFetch(`${BASE_URL}/offers/${offerId}/submissions`),

    update: (offerId, data) =>
      handleFetch(`${BASE_URL}/offers/${offerId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  /* ================= ACADEMIC ================= */
  academic: {
    getYears: (schoolId) =>
      handleFetch(`${BASE_URL}/academic/years/${schoolId}`),

    createYear: (data) =>
      handleFetch(`${BASE_URL}/academic/years`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    setActiveYear: (yearId, schoolId) =>
      handleFetch(`${BASE_URL}/academic/years/${yearId}/activate`, {
        method: "PUT",
        body: JSON.stringify({ school_id: schoolId }),
      }),

    getClasses: (yearId) =>
      handleFetch(`${BASE_URL}/academic/classes/${yearId}`),
  },

  /* ================= NOTIFICATIONS ================= */
  notifications: {
    getMy: () =>
      handleFetch(`${BASE_URL}/notifications`),

    getAll: () =>
      handleFetch(`${BASE_URL}/notifications`),

    broadcast: (data) =>
      handleFetch(`${BASE_URL}/notifications/broadcast`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    sendAnnounce: (data) =>
      handleFetch(`${BASE_URL}/notifications/broadcast`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    markRead: (id) =>
      handleFetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
      }),

    markAllRead: () =>
      handleFetch(`${BASE_URL}/notifications/read-all`, {
        method: "PUT",
      }),
  },

  /* ================= SUPER ADMIN ================= */
  superAdmin: {
    stats: {
      get: () =>
        handleFetch(`${BASE_URL}/super-admin/stats`),
    },

    projects: {
      getAll: () =>
        handleFetch(`${BASE_URL}/super-admin/projects`),
    },
  },

  /* ================= ADMIN ================= */
  admin: {
    getParents: () =>
      handleFetch(`${BASE_URL}/admin/parents`),

    resendVerificationEmail: (email) =>
      handleFetch(`${BASE_URL}/admin/resend-verification-email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    getAllSchools: () =>
      handleFetch(`${BASE_URL}/admin/schools`),

    createSchool: (data) =>
      handleFetch(`${BASE_URL}/admin/schools`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    updateSchool: (id, data) =>
      handleFetch(`${BASE_URL}/admin/schools/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    deleteSchool: (id) =>
      handleFetch(`${BASE_URL}/admin/schools/${id}`, {
        method: "DELETE",
      }),
  },
};
