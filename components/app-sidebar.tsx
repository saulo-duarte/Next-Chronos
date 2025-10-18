'use client';

import * as React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { IoHomeOutline } from 'react-icons/io5';
import { FaFilter } from 'react-icons/fa6';
import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { WeekSelectorDesktop } from './WeekSelectorDesktop';
import { PiSuitcase } from 'react-icons/pi';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { HiOutlineBookOpen } from 'react-icons/hi';

const navItems = [
  {
    title: 'Home',
    url: '/home',
    icon: IoHomeOutline,
    isActive: true,
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: MdOutlineSpaceDashboard,
  },
  {
    title: 'Projetos',
    url: '/projetos',
    icon: PiSuitcase,
  },
  {
    title: 'Estudos',
    url: '/study',
    icon: HiOutlineBookOpen,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const pathname = usePathname();
  const isHome = pathname === '/home';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="mb-2">
        {isCollapsed ? (
          <div className="flex h-16 items-center justify-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
              <Image src="/icons/App Logo.png" alt="Logo" width={24} height={24} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-16 items-center px-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                <Image src="/icons/App Logo.png" alt="Logo" width={36} height={36} />
              </div>
              <span className="ml-2 text-xl font-semibold">Chronos</span>
            </div>
          </>
        )}
      </SidebarHeader>

      <SidebarContent className={isCollapsed ? 'px-0' : 'px-2'}>
        <NavMain items={navItems} />

        {!isCollapsed && isHome && (
          <>
            <Separator className="my-2 border-white/10" />
            <h3 className="px-4 mt-4 mb-2 text-sm font-semibold text-white/70">
              <FaFilter className="inline mr-2 mb-1" />
              Filtros
            </h3>
            <WeekSelectorDesktop />
          </>
        )}
      </SidebarContent>

      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
