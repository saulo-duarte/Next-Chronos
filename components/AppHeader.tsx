import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbItem,
} from '@/components/ui/breadcrumb';
import { NavUser } from './nav-user';
import { useUser } from '@/hooks/data/useUserQuery';
import { Skeleton } from '@/components/ui/skeleton';

interface AppHeaderProps {
  breadcrumbs: {
    label: string;
    href?: string;
    isCurrent?: boolean;
    icon?: React.ReactNode;
  }[];
}

export function AppHeader({ breadcrumbs }: AppHeaderProps) {
  const { data: user, isLoading, isError } = useUser();

  return (
    <header className="bg-sidebar sticky top-0 z-20 flex h-16 shrink-0 items-center border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 px-4">
      <div className="hidden sm:flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem className={item.isCurrent ? '' : 'hidden md:block'}>
                  {item.isCurrent ? (
                    <BreadcrumbPage className="flex items-center gap-1">
                      {item.icon}
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href} className="flex items-center gap-1">
                      {item.icon}
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : !isError && user ? (
          <NavUser
            user={{
              name: user.username,
              email: user.email,
              avatar: user.avatar_url ?? '/avatars/default.png',
            }}
          />
        ) : null}
      </div>
    </header>
  );
}
