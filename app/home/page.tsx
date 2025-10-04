'use client';

import { MobileBottomNav } from '@/components/MobileBottomNav';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import HomeCalendar from '@/components/HomeCalendar';
import { TaskEditDrawer } from '@/components/task/TaskDrawer';
import CalendarPage from './components/CalendarPage';
import { useIsMobile } from '@/hooks/use-mobile';

function MobileLayout({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <>
      <header className="w-full bg-background backdrop-blur-md shadow-sm py-2">
        <div className="h-16 flex items-center justify-center">
          <Image src="/icons/App Logo.png" alt="Logo" width={48} height={48} />
        </div>
        <nav className="flex">
          {['Atividades', 'Estatísticas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'flex-1 py-2 text-center text-sm transition-colors',
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-muted-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <div className="space-y-4 mb-20">
        <HomeCalendar />
      </div>
      <TaskEditDrawer />
      <MobileBottomNav />
    </>
  );
}

function DesktopLayout() {
  return (
    <>
      <CalendarPage />
    </>
  );
}

export default function PageHeader() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('Atividades');

  if (typeof window === 'undefined') {
    return <DesktopLayout />;
  }

  if (isMobile) {
    return <MobileLayout activeTab={activeTab} setActiveTab={setActiveTab} />;
  } else {
    return <DesktopLayout />;
  }
}
