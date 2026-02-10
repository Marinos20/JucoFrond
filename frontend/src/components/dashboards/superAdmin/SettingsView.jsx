import React from 'react';
import { Shield, AlertTriangle, Check, X } from 'lucide-react';

export const SettingsView = () => {
  // Mock des demandes venant des Admins d'école
  const requests = [
    {
      id: 1,
      type: 'Mot de passe',
      school: 'Groupe subvention Avenir',
      admin: 'Mme. Laurent',
      date: 'Auj, 10:20',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Modification Email',
      school: 'Demande de financement africain',
      admin: 'M. Martin',
      date: 'Hier, 15:00',
      status: 'pending'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Paramètres Super Admin
        </h2>
        <p className="text-slate-500 text-sm">
          Administration système et gestion des demandes de sécurité.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Demandes de sécurité */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Demandes de sécurité (Admin Projet)
          </h3>

          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map(req => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {req.type}
                      </h4>
                      <p className="text-sm text-slate-500">
                        Demandé par{' '}
                        <span className="text-slate-700 font-medium">
                          {req.admin}
                        </span>{' '}
                        ({req.school})
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-rose-600 hover:border-rose-200 transition-colors">
                      <X className="w-4 h-4" />
                    </button>

                    <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Traiter
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                Aucune demande en attente.
              </div>
            )}
          </div>
        </div>

        {/* Paramètres globaux (mock / désactivé) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm opacity-50 cursor-not-allowed">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Configuration Système Globale
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Paramètres de base de données, clés API, etc.
          </p>

          <div className="h-4 bg-slate-100 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2"></div>
        </div>

      </div>
    </div>
  );
};
