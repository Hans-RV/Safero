'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, User, Menu, X, Shield, DollarSign, LayoutDashboard, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image src="/safero.png" alt="Safero" width={40} height={40} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg" />
              <span className="text-xl sm:text-2xl font-bold text-primary">Safero</span>
            </Link>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            
            {/* Authentication Section */}
            {mounted && status === 'loading' ? (
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full flex items-center gap-2 px-2 sm:px-4">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline-block text-sm font-medium truncate max-w-[150px]">
                      {session.user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={handleSignIn}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm px-4 sm:px-6"
              >
                <span className="hidden sm:inline">Sign In with Google</span>
                <span className="sm:hidden">Sign In</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px] flex flex-col">
                {/* Header */}
                <SheetHeader className="text-left space-y-3 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <SheetTitle className="text-2xl font-bold text-foreground">Safero</SheetTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">AI-powered email security</p>
                </SheetHeader>

                <Separator className="my-4" />

                {/* Navigation Links */}
                <div className="flex flex-col space-y-2 flex-1">
                  <SheetClose asChild>
                    <Link 
                      href="/#features" 
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-all group"
                    >
                      <Sparkles className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-base">Features</span>
                        <span className="text-xs text-muted-foreground">Explore capabilities</span>
                      </div>
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link 
                      href="/pricing" 
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-all group"
                    >
                      <DollarSign className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-base">Pricing</span>
                        <span className="text-xs text-muted-foreground">View plans</span>
                      </div>
                    </Link>
                  </SheetClose>

                  {session?.user && (
                    <SheetClose asChild>
                      <Link 
                        href="/dashboard" 
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-all group"
                      >
                        <LayoutDashboard className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-base">Dashboard</span>
                          <span className="text-xs text-muted-foreground">Analyze emails</span>
                        </div>
                      </Link>
                    </SheetClose>
                  )}
                </div>

                {/* User Section */}
                {session?.user ? (
                  <div className="mt-auto pt-6 border-t border-border">
                    <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{session.user.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        variant="outline"
                        className="w-full justify-center gap-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                        size="sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto pt-6 border-t border-border">
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignIn();
                      }}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold rounded-xl"
                    >
                      Sign In with Google
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
