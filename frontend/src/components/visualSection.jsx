import React from 'react'
import { Search, Plus } from 'lucide-react'

export const VisualSection = () => {
  return (
    <section className="py-24 bg-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Conçu pour la clarté
          </h2>
        </div>

        {/* Minimalist Dashboard Mockup */}
        <div className="relative mx-auto max-w-5xl">
          <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            {/* Window Controls */}
            <div className="h-12 border-b border-slate-100 flex items-center px-4 justify-between bg-white">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-md border border-slate-100 w-64">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Rechercher...</span>
              </div>
              <div className="w-8"></div>
            </div>

            <div className="flex h-[400px] md:h-[500px]">
              {/* Sidebar */}
              <div className="w-56 border-r border-slate-100 bg-slate-50/30 p-6 hidden md:block">
                <div className="space-y-1">
                  <div className="px-3 py-2 bg-white border border-slate-200 shadow-sm rounded-md text-sm font-medium text-slate-900">
                    Tableau de bord
                  </div>
                  {['Elèves', 'Finances', 'Académique', 'Notifications', 'Paramètres'].map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 md:p-8 bg-white">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900">Tableau de bord</h3>
                  <button className="p-2 bg-slate-900 text-white rounded-full hover:bg-black transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Revenu', value: '24,500€' },
                    { label: 'En attente', value: '1,200€' },
                    { label: 'Élèves', value: '842' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="p-4 border border-slate-100 rounded-lg bg-white hover:border-slate-300 transition-colors"
                    >
                      <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">{stat.label}</div>
                      <div className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="p-4 flex items-center justify-between border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                        <div>
                          <div className="w-24 h-3 bg-slate-100 rounded-full mb-1"></div>
                          <div className="w-16 h-2 bg-slate-50 rounded-full"></div>
                        </div>
                      </div>
                      <div className="w-16 h-4 bg-slate-50 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
