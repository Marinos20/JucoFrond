import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StudentsView } from './StudentsView';
import { FinanceView } from './FinanceView';
import { AcademicView } from './AcademicView';
import { SettingsView } from './SettingsView';
import { NotificationsView } from './NotificationsView';

// ✅ NEW
import { OffersView } from './OffersView';

import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Loader2,
  Settings,
  Bell,

  // ✅ NEW
  FileText,
} from 'lucide-react';

import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { api } from '../../../services/api';
import { cn } from '../../../lib/utils';

const chartConfig = {
  payments: { label: 'Recettes', color: '#6366f1' },
  studentCount: { label: 'Élèves', color: '#10b981' },
};

// --- COMPOSANTS UI INTERNES (STYLE VERCEL) ---
const ChartLabel = ({ label, color }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-slate-400 font-bold uppercase text-lg ">{label}</span>
  </div>
);

const Badge = ({ children, variant = 'success' }) => (
  <div
    className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black',
      variant === 'success'
        ? 'bg-emerald-50 text-emerald-600'
        : 'bg-rose-50 text-rose-600'
    )}
  >
    {children}
  </div>
);

const Overview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [financeData, setFinanceData] = useState({ totalRevenue: 0, transactions: [] });
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const loadFinance = async () => {
      setIsLoading(true);
      try {
        const res = await api.finance.getSummary(user.school_id);
        if (res.success) setFinanceData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (user.school_id) loadFinance();
  }, [user.school_id]);

  const aggregatedChartData = useMemo(() => {
    if (!financeData.transactions.length) return [];
    const days = parseInt(selectedPeriod);
    const dataMap = new Map();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      dataMap.set(dateStr, { period: dateStr, payments: 0, studentCount: 0, students: new Set() });
    }

    financeData.transactions.forEach((tx) => {
      const dateStr = new Date(tx.payment_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      if (dataMap.has(dateStr)) {
        const entry = dataMap.get(dateStr);
        entry.payments += Number(tx.amount_paid);
        entry.students.add(tx.student_id);
        entry.studentCount = entry.students.size;
      }
    });

    return Array.from(dataMap.values());
  }, [financeData.transactions, selectedPeriod]);

  const stats = useMemo(() => {
    const uniqueStudents = new Set(financeData.transactions.map((t) => t.student_id)).size;
    const totalAmount = financeData.transactions.reduce((acc, t) => acc + Number(t.amount_paid), 0);

    // Simulation de changement basée sur la période
    const revenueChange = selectedPeriod === '7' ? 12 : 8;
    const studentChange = selectedPeriod === '7' ? -3 : 5;

    return { uniqueStudents, totalAmount, revenueChange, studentChange };
  }, [financeData.transactions, selectedPeriod]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
        <p className="text-slate-400 font-bold uppercase  text-[10px]">Synchronisation ScolarPay...</p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Top Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black  text-indigo-600">Analytics</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Rapport financier en temps réel</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
          <button
            onClick={() => setSelectedPeriod('7')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              selectedPeriod === '7' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            7 JOURS
          </button>
          <button
            onClick={() => setSelectedPeriod('30')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              selectedPeriod === '30' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            30 JOURS
          </button>
        </div>
      </div>

      {/* BARRE DE STATS HORIZONTALE */}
      <div className="flex items-center flex-wrap gap-3.5 md:gap-10 px-5 mb-8 text-sm">
        <div className="flex items-center gap-3.5">
          <ChartLabel label="Recettes" color={chartConfig.payments.color} />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold ">{stats.totalAmount.toLocaleString()} F</span>
            <Badge variant={stats.revenueChange >= 0 ? 'success' : 'destructive'}>
              {stats.revenueChange >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {Math.abs(stats.revenueChange)}%
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ChartLabel label="Élèves" color={chartConfig.studentCount.color} />
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-slate-900 ">{stats.uniqueStudents}</span>
            <Badge variant={stats.studentChange >= 0 ? 'success' : 'destructive'}>
              {stats.studentChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(stats.studentChange)}%
            </Badge>
          </div>
        </div>
      </div>

      {/* MAIN CHART CARD */}
      <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm relative group overflow-hidden">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-2xl font-black text-slate-900 ">Flux Financier</h3>
            <p className="text-xs font-bold text-slate-400 uppercase  mt-1">Évolution des encaissements et engagement</p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ComposedChart data={aggregatedChartData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="payGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700 }}
              tickMargin={15}
            />

            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              tick={{ fontSize: 10, fontWeight: 700 }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700 }}
              domain={[0, 'dataMax + 2']}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v, n) => (n === 'payments' ? `${v.toLocaleString()} F` : `${v} élèves`)}
                />
              }
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="payments"
              fill="url(#payGradient)"
              stroke="#6366f1"
              strokeWidth={3}
              animationDuration={1500}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="studentCount"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export const SchoolAdminDashboard = ({ onLogout, user }) => {
  // ✅ NEW: persistance view
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('school_admin_view') || 'overview');

  useEffect(() => {
    localStorage.setItem('school_admin_view', currentView);
  }, [currentView]);

  const sidebarItems = [
    { icon: <LayoutDashboard />, label: 'Tableau de bord', id: 'overview', onClick: () => setCurrentView('overview') },
    { icon: <Users />, label: 'Élèves', id: 'students', onClick: () => setCurrentView('students') },
    { icon: <CreditCard />, label: 'Finances', id: 'finance', onClick: () => setCurrentView('finance') },
    { icon: <BookOpen />, label: 'Académique', id: 'academic', onClick: () => setCurrentView('academic') },
    { icon: <Bell />, label: 'Notifications', id: 'notifications', onClick: () => setCurrentView('notifications') },

    // ✅ NEW
    { icon: <FileText />, label: 'Offres', id: 'offers', onClick: () => setCurrentView('offers') },

    { icon: <Settings />, label: 'Paramètres', id: 'settings', onClick: () => setCurrentView('settings') },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview />;
      case 'students':
        return <StudentsView />;
      case 'finance':
        return <FinanceView />;
      case 'academic':
        return <AcademicView />;
      case 'notifications':
        return <NotificationsView />;

      // ✅ NEW
      case 'offers':
        return <OffersView user={user} />;

      case 'settings':
        return <SettingsView />;
      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems.map((item) => ({ ...item, active: currentView === item.id }))}
      userInitial={user?.name?.[0] || 'E'}
      userRoleLabel="Admin École"
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};
