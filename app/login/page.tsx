'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { generateMockUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      const user = generateMockUser(email || 'user@gmail.com', name || 'Google User');
      login(user);
      router.push('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user = generateMockUser(email, name);
      login(user);
      router.push('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/safero.png" alt="Safero" width={64} height={64} className="w-16 h-16 rounded-xl" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Safero</h1>
            <p className="text-muted-foreground">Sign in to analyze and protect your emails</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Google Auth Button */}
          <Button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full mb-4 bg-primary hover:bg-primary/90 text-primary-foreground h-11"
            size="lg"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              size="lg"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              Don't have an account? <Link href="/login" className="text-primary hover:underline">Create one</Link>
            </p>
            <p className="mt-2">
              <Link href="/" className="text-primary hover:underline">Back to home</Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex justify-around text-center text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">256-bit SSL</p>
            <p>Encrypted</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Zero Trust</p>
            <p>Architecture</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">GDPR</p>
            <p>Compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
