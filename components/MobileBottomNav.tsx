'use client';

import { User } from 'lucide-react';
import { IoHome } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { FaSuitcase } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa6';

const navItems = [
  { label: 'Home', icon: IoHome, href: '/home' },
  { label: 'Projetos', icon: FaSuitcase, href: '/projetos' },
  { label: 'Estudos', icon: FaBook, href: '/study' },
  { label: 'Perfil', icon: User, href: '/profile' },
];

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0f1221] border-t border-white/10 flex justify-around items-center h-16 shadow-inner backdrop-blur-md">
      {navItems.map(({ label, icon: Icon, href }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={clsx(
              'flex flex-col items-center justify-center h-full w-full transition-colors',
              isActive ? 'border-b-2 border-blue-400 text-blue-400' : 'text-muted-foreground'
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
