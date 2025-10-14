'use client';

import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useState, useMemo } from 'react';
import clsx from 'clsx';
import HomeCalendar from '@/components/HomeCalendar';
import Dashboard from '../dashboard/Dashboard';
import { TaskEditDialog } from '@/components/task/TaskEditDialog';
import { Home } from 'lucide-react';
import { useUser } from '@/hooks/data/useUserQuery';
import { AppHeader } from '@/components/AppHeader';
import { DesktopTaskFilters } from '@/components/DesktopTaskFilters';

function AppLayout({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { data: user } = useUser();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const breadcrumbs = [
    {
      label: 'Home',
      icon: <Home size={16} />,
      isCurrent: true,
    },
  ];

  return (
    <>
      <AppHeader breadcrumbs={breadcrumbs} />
      <header className="w-full sticky top-15 z-50 bg-background/80 backdrop-blur-md border-b border-border px-2 md:px-6">
        <div className="flex items-center justify-between px-4 py-3 hidden md:block">
          <div className="flex flex-col ">
            <span className="text-lg font-semibold text-foreground hidden md:block">
              {greeting}, {user?.username ?? 'usuário'}
            </span>
          </div>

          <DesktopTaskFilters />
        </div>

        <nav className="flex border-t border-border">
          {['Atividades', 'Estatísticas'].map((tab) => (
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

      <div className="space-y-4 mb-20 p-4">
        {activeTab === 'Atividades' && <HomeCalendar />}
        {activeTab === 'Estatísticas' && <Dashboard />}
      </div>

      <TaskEditDialog />
      <MobileBottomNav />
    </>
  );
}

export default function PageHeader() {
  const [activeTab, setActiveTab] = useState('Atividades');

  return <AppLayout activeTab={activeTab} setActiveTab={setActiveTab} />;
}
