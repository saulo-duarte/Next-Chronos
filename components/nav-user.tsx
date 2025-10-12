'use client';

import { Bell, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
}

export function NavUser({ user }: { user: User }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        { id: '1', title: 'Nova tarefa adicionada', description: 'Projeto Chronos', read: false },
        { id: '2', title: 'Revisão pendente', description: 'Tópico de estudo React', read: true },
        { id: '3', title: 'Prazo amanhã', description: 'Projeto API Go', read: false },
      ]);
    }, 500);
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      window.location.href = '/login';
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex items-center justify-center rounded-full p-2 hover:bg-muted transition">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black px-1">
                  {unreadCount > 99 ? '+99' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72 rounded-lg p-2">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {notifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Nenhuma notificação.
              </div>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-2">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.description}</div>
                  {!n.read && <Badge variant="secondary">Novo</Badge>}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full">{user.name?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-44 rounded-lg p-2">
            <DropdownMenuLabel className="text-sm font-medium">{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
