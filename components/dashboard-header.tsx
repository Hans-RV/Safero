'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-xs sm:text-sm">S</span>
          </div>
          <span className="font-bold text-base sm:text-lg text-foreground">Safero</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground truncate max-w-[150px] lg:max-w-[200px]">{user.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px] lg:max-w-[200px]">{user.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-border hover:bg-secondary text-xs sm:text-sm px-3 sm:px-4"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
