'use client';

import { MobileBottomNav } from '@/components/MobileBottomNav';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import HomeCalendar from '@/components/HomeCalendar';
import { WeekSelector } from '@/components/WeekSelector';

function PageHeader() {
  const [activeTab, setActiveTab] = useState<'task' | 'resumo'>('task');

  return (
    <>
      <header className="w-full bg-background backdrop-blur-md shadow-sm py-4">
        <div className="h-16 flex items-center justify-center">
          <Image src="/icons/Logo Chronos.png" alt="Logo" width={32} height={32} />
        </div>

        <nav className="flex">
          {['task', 'resumo'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'task' | 'resumo')}
              className={clsx(
                'flex-1 py-3 text-center text-sm transition-colors',
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-muted-foreground'
              )}
            >
              {tab === 'task' ? 'Task' : 'Resumo'}
            </button>
          ))}
        </nav>
      </header>

      <div className="px-4 py-4 space-y-4 mb-20">
        <WeekSelector />
        <HomeCalendar />
      </div>

      <MobileBottomNav />
    </>
  );
}

export default PageHeader;
