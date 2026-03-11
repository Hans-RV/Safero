'use client';

import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export function ChromeExtensionPreview() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-28 bg-gradient-to-b from-secondary/30 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground px-4">
            See It In Action
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Our Chrome extension integrates seamlessly into your Gmail inbox for instant protection.
          </p>
        </div>

        {/* Extension Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left - Feature List */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              {[
                { title: 'Instant Analysis', desc: 'Get real-time threat detection on every email' },
                { title: 'Visual Indicators', desc: 'Clear color-coded security status badges' },
                { title: 'Detailed Reports', desc: 'Understand why an email is flagged' },
                { title: 'One-Click Setup', desc: 'Add to Chrome and start protecting immediately' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 sm:gap-4 items-start group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1 sm:mb-2 text-base sm:text-lg">{item.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Browser Window Preview */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="w-full max-w-lg">
              {/* Browser Chrome */}
              <div className="bg-card border-2 border-border rounded-t-2xl overflow-hidden shadow-2xl">
                {/* Address Bar */}
                <div className="bg-muted p-3 sm:p-4 border-b-2 border-border flex items-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></div>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></div>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></div>
                  <div className="flex-1 bg-background rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-muted-foreground ml-2 sm:ml-4 border border-border">
                    gmail.com
                  </div>
                </div>

                {/* Gmail-like Email List */}
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-background">
                  {/* Safe Email */}
                  <div className="border-2 border-border rounded-xl p-3 sm:p-4 hover:bg-secondary/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-foreground truncate">Payment Confirmation</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">support@stripe.com</p>
                      </div>
                      <div className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs sm:text-sm font-bold">
                        Safe
                      </div>
                    </div>
                  </div>

                  {/* Suspicious Email */}
                  <div className="border-2 border-border rounded-xl p-3 sm:p-4 hover:bg-secondary/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-foreground truncate">Verify Your Account</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">noreply@securityalert.com</p>
                      </div>
                      <div className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs sm:text-sm font-bold">
                        Suspicious
                      </div>
                    </div>
                  </div>

                  {/* Dangerous Email */}
                  <div className="border-2 border-red-300 dark:border-red-800 rounded-xl p-3 sm:p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-foreground truncate">Urgent: Click Here Now</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">unknown@phishing-domain.net</p>
                      </div>
                      <div className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs sm:text-sm font-bold">
                        Danger
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extension Details */}
              <div className="bg-secondary border border-t-0 border-border rounded-b-xl p-4 text-center text-sm text-muted-foreground">
                Safero Extension - Always vigilant, always protecting
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
