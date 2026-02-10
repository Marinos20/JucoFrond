// 📜 parentAdmin/NotificationsView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  XCircle,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../ui/button";
import { api } from "../../../services/api";

// ---------- helpers ----------
const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const fmtDateTime = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const safeJson = (val, fallback) => {
  if (val === undefined || val === null) return fallback;
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

// ✅ normalise 0/1 true/false "0"/"1"
const isRead = (v) => v === 1 || v === true || v === "1";

const TYPE_META = {
  success: {
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  info: {
    icon: Info,
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  warning: {
    icon: AlertTriangle,
    badge: "bg-amber-50 text-amber-800 border-amber-200",
  },
  error: {
    icon: XCircle,
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const EVENT_LABEL = {
  project_submitted: "Projet soumis",
  attachments_uploaded: "Pièces jointes uploadées",
  submission_incomplete: "Soumission incomplète",
  project_under_review: "Projet en cours de vérification",
  project_approved: "Projet approuvé",
  project_rejected: "Projet rejeté",
  project_more_info_requested: "Compléments demandés",
  deadline_reminder: "Rappel d’échéance",
};

const getType = (n) => {
  const t = (n?.type || "info").toLowerCase();
  return TYPE_META[t] ? t : "info";
};

const getTitle = (n) =>
  n?.subject ||
  (n?.event_key ? EVENT_LABEL[n.event_key] || n.event_key : null) ||
  "Notification";

const getEventLabel = (n) =>
  n?.event_key ? EVENT_LABEL[n.event_key] || n.event_key : "";

const hasAction = (n) => {
  const p = safeJson(n?.payload, null);
  return Boolean(n?.action_url) || Boolean(p?.action_url) || Boolean(n?.payload);
};

const extractActionUrl = (n) => {
  if (n?.action_url) return n.action_url;
  const p = safeJson(n?.payload, null);
  return p?.action_url || "";
};

// ---------- Component ----------
export const NotificationsView = ({ onUnreadCountChange }) => {
  const [tab, setTab] = useState("all"); // all | unread
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.notifications.getMy();
      const list = normalizeListResponse(res);

      const normalized = list.map((n) => ({
        ...n,
        // payload peut être json string ou objet
        payload: safeJson(n.payload, n.payload),
        // is_read normalisé pour l’UI
        is_read: isRead(n.is_read) ? 1 : 0,
      }));

      setItems(normalized);
    } catch (e) {
      setItems([]);
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.filter((n) => !isRead(n.is_read)).length;
  }, [items]);

  // ✅ remonte le compteur au dashboard (badge sidebar)
  useEffect(() => {
    if (typeof onUnreadCountChange === "function") {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  const filtered = useMemo(() => {
    const base = Array.isArray(items) ? items : [];
    if (tab === "unread") return base.filter((n) => !isRead(n.is_read));
    return base;
  }, [items, tab]);

  const markAllRead = async () => {
    setMarking(true);
    try {
      await api.notifications.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (e) {
      alert("Erreur: " + (e?.message || String(e)));
    } finally {
      setMarking(false);
    }
  };

  const markOneRead = async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)));
    try {
      await api.notifications.markRead(id);
    } catch {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: 0 } : n)));
    }
  };

  const openAction = (notif) => {
    const url = extractActionUrl(notif);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else alert("Payload:\n" + JSON.stringify(safeJson(notif.payload, {}), null, 2));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Bell size={18} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchNotifications} disabled={loading}>
            <RefreshCw size={16} /> Actualiser
          </Button>
          <Button
            onClick={markAllRead}
            disabled={marking || unreadCount === 0}
            className="bg-slate-900 text-white"
          >
            <CheckCheck size={16} /> Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
            tab === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700"
          }`}
          onClick={() => setTab("all")}
        >
          Tout
        </button>

        <button
          className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
            tab === "unread"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-700"
          }`}
          onClick={() => setTab("unread")}
        >
          Non lues{" "}
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center text-xs font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl border p-10 text-center text-slate-600">Chargement...</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <div className="font-semibold mb-1">Erreur de chargement</div>
          <div className="text-sm">{error}</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border p-10 text-center text-slate-600">
          Aucune notification.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const t = getType(n);
            const Icon = TYPE_META[t].icon;

            return (
              <div
                key={n.id}
                className={`border rounded-2xl p-4 bg-white flex items-start justify-between gap-4 ${
                  !isRead(n.is_read) ? "border-slate-300" : "border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-2xl border flex items-center justify-center ${TYPE_META[t].badge}`}
                    title={t}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 truncate">{getTitle(n)}</p>
                      {!isRead(n.is_read) && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                          Non lue
                        </span>
                      )}
                    </div>

                    {n.event_key && (
                      <p className="text-xs text-slate-500 mt-0.5">{getEventLabel(n)}</p>
                    )}

                    <p className="text-xs text-slate-500 mt-1">{fmtDateTime(n.created_at)}</p>

                    {n.content && (
                      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{n.content}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {hasAction(n) && (
                    <Button variant="outline" onClick={() => openAction(n)}>
                      <ExternalLink size={16} /> Voir
                    </Button>
                  )}
                  {!isRead(n.is_read) && (
                    <Button variant="outline" onClick={() => markOneRead(n.id)}>
                      <CheckCheck size={16} /> Lu
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
