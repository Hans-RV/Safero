import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
import { ChromeExtensionPreview } from '@/components/chrome-extension-preview';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Navbar />
      <HeroSection />
      <section id="features">
        <FeaturesSection />
      </section>
      <ChromeExtensionPreview />
      <Footer />
    </main>
  );
}
