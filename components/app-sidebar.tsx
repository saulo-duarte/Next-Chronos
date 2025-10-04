'use client';

import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { IoHome } from 'react-icons/io5';
import { FaBook, FaSuitcase } from 'react-icons/fa6';
import { MonthWeekNavigator } from '@/app/home/components/DesktopSelector';

const data = {
  user: {
    name: 'Saulo Duarte',
    email: 'saulolfduarte@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/home',
      icon: IoHome,
    },
    {
      title: 'Projetos',
      url: '/projetos',
      icon: FaSuitcase,
    },
    {
      title: 'Estudos',
      url: '/estudos',
      icon: FaBook,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-gray-800/60">
              <a href="/home">
                <Image src="/icons/App Logo.png" alt="Chronos Logo" width={48} height={48} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xl">Chronos</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <MonthWeekNavigator />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
