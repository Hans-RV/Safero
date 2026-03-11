'use client';

import { Zap, Link as LinkIcon, Shield, Smartphone } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'AI Email Analysis',
      description: 'Automatically analyze incoming emails using AI sentiment detection and phishing pattern detection.',
    },
    {
      icon: LinkIcon,
      title: 'Link & Domain Security',
      description: 'Detect suspicious domains, shortened URLs, and malicious links.',
    },
    {
      icon: Shield,
      title: 'Sender Verification',
      description: 'Analyze sender email authenticity and domain mismatch.',
    },
    {
      icon: Smartphone,
      title: 'Real-Time Protection',
      description: 'Instantly classify emails as Safe, Suspicious, or Dangerous.',
    },
  ];

  return (
    <section id="features" className="w-full py-12 sm:py-16 md:py-20 lg:py-28 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground px-4">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Safero provides comprehensive email security with AI-powered threat detection.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="space-y-4 sm:space-y-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
