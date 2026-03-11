'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function HeroSection() {
  const { data: session } = useSession();
  
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8">
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                AI Email Security That Protects You From Phishing
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Safero is a Chrome extension that analyzes incoming emails using AI and detects suspicious senders, malicious links, and phishing attempts in real time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                Add to Chrome
              </Button>
              {session && (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-semibold border-2 hover:bg-secondary w-full">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right - Mock Email Card */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="w-full max-w-md bg-card border-2 border-border rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-shadow">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  <span className="text-base font-bold text-foreground">Safero Scan Result</span>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="font-bold text-yellow-900 dark:text-yellow-100 text-lg">Suspicious</span>
                  </div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-semibold mb-2">Reason:</p>
                    <p className="leading-relaxed">This email contains a shortened link and urgency language.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Shortened URL detected</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">High urgency tone detected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
