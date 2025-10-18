'use client';

import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useState } from 'react';
import clsx from 'clsx';
import HomeCalendar from '@/components/HomeCalendar';
import Dashboard from '../dashboard/Dashboard';
import { TaskEditDialog } from '@/components/task/TaskEditDialog';
import { Home } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { DesktopTaskFilters } from '@/components/DesktopTaskFilters';

function AppLayout({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const breadcrumbs = [
    {
      label: 'Home',
      icon: <Home size={16} />,
      isCurrent: true,
    },
  ];

  const tabs = ['Atividades', 'Estatísticas'];

  return (
    <div className="flex flex-col h-screen">
      <AppHeader breadcrumbs={breadcrumbs} />

      <header className="w-full z-50 bg-background/80 backdrop-blur-md border-b border-border px-2 md:px-6">
        <div className="flex items-center justify-between px-4 py-3">
          <DesktopTaskFilters />
        </div>

        <nav className="md:hidden flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'flex-1 py-3 text-center text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 mb-20 p-4">
          {activeTab === 'Atividades' && <HomeCalendar />}
          <div className="md:hidden">{activeTab === 'Estatísticas' && <Dashboard />}</div>
        </div>
      </div>
      <TaskEditDialog />
      <MobileBottomNav />
    </div>
  );
}

export default function PageHeader() {
  const [activeTab, setActiveTab] = useState('Atividades');

  return <AppLayout activeTab={activeTab} setActiveTab={setActiveTab} />;
}
