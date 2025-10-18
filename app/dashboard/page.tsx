'use client';

import { AppHeader } from '@/components/AppHeader';
import Dashboard from './Dashboard';

export default function DashboardPage() {
  const breadcrumbs = [
    {
      label: 'Dashboard',
      isCurrent: true,
    },
  ];
  return (
    <div className="flex flex-col h-screen">
      <AppHeader breadcrumbs={breadcrumbs} />
      <div className="flex-1 overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
}
