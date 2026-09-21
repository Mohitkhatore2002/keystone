import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/workOrder';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  quickLogin: (email: string) => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('keystone_token');
    const savedUser = localStorage.getItem('keystone_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('keystone_token');
        localStorage.removeItem('keystone_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('keystone_token', newToken);
    localStorage.setItem('keystone_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('keystone_token');
    localStorage.removeItem('keystone_user');
  };

  const quickLogin = async (email: string) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, 'password123');
      login(res.token, res.user);
    } catch {
      // Seamless demo login fallback for static web hosting (Vercel)
      let role: 'MANAGER' | 'DISPATCHER' | 'TECHNICIAN' | 'CUSTOMER' = 'DISPATCHER';
      let name = 'Lead Dispatcher';
      
      if (email.includes('manager')) {
        role = 'MANAGER';
        name = 'Operations Manager';
      } else if (email.includes('dispatcher')) {
        role = 'DISPATCHER';
        name = 'Lead Dispatcher';
      } else if (email.includes('john') || email.includes('tech')) {
        role = 'TECHNICIAN';
        name = 'John Field Tech';
      } else if (email.includes('acme') || email.includes('customer') || email.includes('client')) {
        role = 'CUSTOMER';
        name = 'Acme Facilities Lead';
      }

      const mockUser: User = {
        id: 1,
        name,
        email,
        role,
      };
      login('demo_jwt_token_keystone', mockUser);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('keystone_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, quickLogin, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
