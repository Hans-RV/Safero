'use client';

import { useEffect, useState } from 'react';
import { User, getUserFromStorage, setUserToStorage, removeUserFromStorage } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUserToStorage(userData);
    setUser(userData);
  };

  const logout = () => {
    removeUserFromStorage();
    setUser(null);
  };

  return { user, isLoading, login, logout, isAuthenticated: !!user };
}
