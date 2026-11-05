'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image src="/safero.png" alt="Safero" width={40} height={40} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg" />
            <span className="text-xl sm:text-2xl font-bold text-foreground">Safero</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
          </div>

          {/* Copyright & Credits */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <p>© 2026 Safero. All rights reserved.</p>
            <p className="text-xs">
              Developed under <span className="font-semibold text-foreground">GENVO LABS</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
