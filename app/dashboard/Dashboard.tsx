'use client';

import { Loader2, AlertCircle } from 'lucide-react';
import { useDashboardTasks } from '@/hooks/data/useTasksQuery';
import { DashboardLatestTasks } from './LatestsTasks';
import { DashboardCalendar } from './DashboardCalendar';
import { DashboardStatsCards } from './DashboardStatsCards';
import { DashboardTypeDistributionChart } from './DashboardCharts';
import { DashboardMonthlyChart } from './DashboardMonthChart';

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboardTasks();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg text-primary">Carregando dados do Dashboard...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="ml-3 text-lg text-destructive">
          Ocorreu um erro ao carregar o Dashboard. Verifique sua conexão ou tente novamente.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 dark">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Dashboard de Tarefas</h1>
        </div>

        <DashboardStatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardLatestTasks />

          <DashboardCalendar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardMonthlyChart />

          <DashboardTypeDistributionChart />
        </div>
      </div>
    </div>
  );
}
