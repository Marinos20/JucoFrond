import React from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { Dock, DockIcon, DockItem, DockLabel } from "../ui/dock";

export function DashboardLayout({
  children,
  sidebarItems = [],
  userInitial = "U",
  userRoleLabel = "",
  onLogout,

  // 🔔 Notifications (header)
  notificationsUnreadCount = 0,
  onNotificationsClick,
}) {
  const unread = Number(notificationsUnreadCount) || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-slate-900 selection:text-white transition-colors duration-300">
      {/* =======================
          TOP HEADER
      ======================= */}
      <header className="h-16 sticky top-0 bg-white/70 backdrop-blur-md z-40 border-b border-slate-200 px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-black uppercase">
              {userInitial}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Search (desktop only) */}
          <div className="relative w-64 group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Recherche..."
              className="w-full bg-slate-100/50 hover:bg-white border-none rounded-full py-1.5 pl-10 pr-4 text-sm outline-none ring-1 ring-slate-200/50 focus:ring-slate-300 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Role */}
          <div className="flex flex-col items-end mr-2">
            <span className="text-slate-900 text-[11px] font-bold uppercase">
              {userRoleLabel}
            </span>
            <span className="text-[9px] text-slate-400 font-medium uppercase">
              Union Européenne
            </span>
          </div>

          {/* 🔔 Notifications (header) */}
          <button
            type="button"
            onClick={onNotificationsClick}
            className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />

            {/* Badge */}
            {unread > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                {unread > 99 ? "99+" : unread}
              </span>
            ) : (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-600 rounded-full border border-white"></span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            title="Déconnexion"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* =======================
          MAIN CONTENT
      ======================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-8 pb-40">
        {children}
      </main>

      {/* =======================
          FLOATING NAV DOCK
      ======================= */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] max-w-full px-4">
        <Dock className="pb-3 items-end">
          {sidebarItems.map((item, idx) => {
            // badge peut être un nombre OU un JSX
            const badgeIsNumber = typeof item.badge === "number";
            const badgeValue = badgeIsNumber ? item.badge : null;

            return (
              <DockItem
                key={idx}
                onClick={item.onClick}
                active={item.active}
                className={cn(
                  "aspect-square rounded-full transition-all duration-300 relative",
                  item.active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-600"
                )}
              >
                <DockLabel>{item.label}</DockLabel>

                <DockIcon>
                  <span className="relative inline-flex">
                    {React.isValidElement(item.icon)
                      ? React.cloneElement(item.icon, {
                          size: 24,
                          className: item.active
                            ? "text-white"
                            : "text-slate-600",
                        })
                      : item.icon}

                    {/* Badge Dock */}
                    {badgeIsNumber && badgeValue > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                        {badgeValue > 99 ? "99+" : badgeValue}
                      </span>
                    )}

                    {/* Badge JSX (si fourni) */}
                    {!badgeIsNumber && item.badge}
                  </span>
                </DockIcon>
              </DockItem>
            );
          })}
        </Dock>
      </div>
    </div>
  );
}
