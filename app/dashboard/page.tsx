'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { GmailEmailsList } from '@/components/gmail-emails-list';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/#login');
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <GmailEmailsList />
      </main>
    </div>
  );
}
