'use client';

import * as React from 'react';
import Image from 'next/image';
import { IoHome } from 'react-icons/io5';
import { FaBookOpen, FaSuitcase } from 'react-icons/fa6';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/data/useUserQuery';

const navItems = [
  {
    title: 'Home',
    url: '/home',
    icon: IoHome,
    isActive: true,
  },
  {
    title: 'Projetos',
    url: '/projetos',
    icon: FaSuitcase,
  },
  {
    title: 'Estudos',
    url: '/study',
    icon: FaBookOpen,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const { data: user, isLoading, isError } = useUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {isCollapsed ? (
          <div className="flex h-16 items-center justify-center">
            <Image src="/icons/App Logo.png" alt="Logo" width={24} height={24} />
          </div>
        ) : (
          <>
            <div className="flex h-16 items-center px-4">
              <Image src="/icons/App Logo.png" alt="Logo" width={48} height={48} />
              <span className="ml-2 text-2xl font-bold">Chronos</span>
            </div>
            <Separator className="border-1" />
          </>
        )}
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        {isLoading ? (
          <div className="flex items-center space-x-2 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            {!isCollapsed && (
              <div className="flex flex-col space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            )}
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive px-4">Erro ao carregar usuário</div>
        ) : (
          user && (
            <NavUser
              user={{
                name: user.username,
                email: user.email,
                avatar: user.avatar_url ?? '/avatars/default.png',
              }}
            />
          )
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
