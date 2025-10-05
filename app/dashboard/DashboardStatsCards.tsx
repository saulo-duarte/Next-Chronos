'use client';

import { CheckCircle2, Circle, Clock, ListTodo, AlertCircle } from 'lucide-react';
import { useDashboardTasks } from '@/hooks/data/useTasksQuery';
import { StatCard } from './StatsUtils';

export const DashboardStatsCards = () => {
  const { data } = useDashboardTasks();

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total"
        value={data.stats.total}
        icon={ListTodo}
        iconColor="bg-primary/10 text-primary"
      />
      <StatCard
        title="A Fazer"
        value={data.stats.todo}
        icon={Circle}
        iconColor="bg-chart-2/10 text-chart-2"
      />
      <StatCard
        title="Em Andamento"
        value={data.stats.in_progress}
        icon={Clock}
        iconColor="bg-chart-3/10 text-chart-3"
      />
      <StatCard
        title="Atrasado"
        value={data.stats.overdue}
        icon={AlertCircle}
        iconColor="bg-destructive/10 text-destructive"
      />
      <StatCard
        title="Completas"
        value={data.stats.done}
        icon={CheckCircle2}
        iconColor="bg-chart-1/10 text-chart-1"
      />
    </div>
  );
};
