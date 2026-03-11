'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function PricingPage() {
  const { data: session } = useSession();
  
  return (
    <main className="min-h-screen w-full">
      <Navbar />

      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 px-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Choose the plan that fits your needs.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-card border-2 border-border rounded-2xl p-6 sm:p-8 lg:p-10 space-y-6 lg:space-y-8 hover:shadow-xl transition-all">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Free</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground">₹0</span>
                  <span className="text-base sm:text-lg text-muted-foreground">/month</span>
                </div>
              </div>

              <div className="space-y-4">
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'Basic email scanning',
                    'AI risk classification',
                    'Chrome extension access',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full h-11 sm:h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all"
                disabled={session ? true : false}
              >
                {session ? 'Current Plan' : 'Get Started'}
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-card border-2 border-primary rounded-2xl p-6 sm:p-8 lg:p-10 space-y-6 lg:space-y-8 shadow-2xl transform lg:scale-105">
              <div className="absolute -top-3 sm:-top-4 right-4 sm:right-8 bg-primary text-primary-foreground px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                Coming Soon
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Pro Plan</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-foreground">₹149</span>
                    <span className="text-base sm:text-lg text-muted-foreground">/month</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">₹1,499</span>
                    <span className="text-sm sm:text-base text-muted-foreground">/year</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'Advanced AI phishing detection',
                    'Domain reputation engine',
                    'Real-time threat alerts',
                    'Dashboard analytics',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-base font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button disabled className="w-full h-11 sm:h-12 bg-primary/50 text-primary-foreground rounded-lg cursor-not-allowed text-sm sm:text-base font-semibold">
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Everything you need to know about Safero
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: 'Can I upgrade or downgrade anytime?',
                answer: 'Yes, you can change your plan at any time. Changes take effect at your next billing cycle.',
              },
              {
                question: 'Is my email data stored on your servers?',
                answer: 'No. We analyze emails in real-time using AI and do not store any email content on our servers. Your privacy is our priority.',
              },
              {
                question: 'How accurate is the AI detection?',
                answer: 'Our AI model has been trained on millions of phishing emails and maintains a 99%+ accuracy rate in detecting threats.',
              },
              {
                question: 'Do you offer refunds?',
                answer: 'Yes, we offer a 14-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
              },
              {
                question: 'Can I use this for my business?',
                answer: 'Absolutely! We offer enterprise plans with custom features and dedicated support. Contact our sales team for details.',
              },
              {
                question: 'Which email providers are supported?',
                answer: 'Currently, we support Gmail. Support for Outlook, Yahoo, and other providers is coming soon.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2 sm:mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center p-6 sm:p-8 bg-secondary/30 rounded-2xl border border-border">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Can't find the answer you're looking for? Please reach out to our team.
            </p>
            <Button variant="outline" className="rounded-full px-6 text-sm sm:text-base">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
