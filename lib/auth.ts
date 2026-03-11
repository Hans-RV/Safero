import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export function getUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('safero_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setUserToStorage(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('safero_user', JSON.stringify(user));
}

export function removeUserFromStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('safero_user');
}

export function generateMockUser(email: string, name: string): User {
  return {
    id: `user_${Date.now()}`,
    email,
    name,
  };
}
