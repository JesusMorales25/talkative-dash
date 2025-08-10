import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '@/services/authService';

export type UserRole = 'admin' | 'supervisor' | 'agente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Initialize from stored token if present
  const initialize = async () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  };
  initialize();
}, []);

const login = async (email: string, password: string, remember?: boolean) => {
  setIsLoading(true);
  try {
    await authService.login(email, password, !!remember);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  } finally {
    setIsLoading(false);
  }
};

const logout = () => {
  authService.logout();
  setUser(null);
};

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}