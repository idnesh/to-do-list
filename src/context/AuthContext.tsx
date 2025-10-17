import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser, LoginFormData, SignupFormData } from '@/types';
import { generateId } from '@/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('todo-auth-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('todo-auth-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginFormData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('todo-users') || '[]');

      // Find user by email
      const foundUser = storedUsers.find((u: any) => u.email === credentials.email);

      if (!foundUser) {
        throw new Error('User not found');
      }

      // In a real app, you'd hash and compare passwords
      if (foundUser.password !== credentials.password) {
        throw new Error('Invalid password');
      }

      const authUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatar,
      };

      setUser(authUser);

      // Store session
      if (credentials.rememberMe) {
        localStorage.setItem('todo-auth-user', JSON.stringify(authUser));
      } else {
        sessionStorage.setItem('todo-auth-user', JSON.stringify(authUser));
      }

      // Update last login
      foundUser.lastLoginAt = new Date().toISOString();
      const updatedUsers = storedUsers.map((u: any) =>
        u.id === foundUser.id ? foundUser : u
      );
      localStorage.setItem('todo-users', JSON.stringify(updatedUsers));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupFormData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Validate password match
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Please enter a valid email');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing users
      const storedUsers = JSON.parse(localStorage.getItem('todo-users') || '[]');

      // Check if email already exists
      if (storedUsers.some((u: any) => u.email === userData.email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: generateId(),
        email: userData.email,
        name: userData.name,
        password: userData.password, // In real app, this would be hashed
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
        createdAt: new Date().toISOString(),
      };

      // Save user
      storedUsers.push(newUser);
      localStorage.setItem('todo-users', JSON.stringify(storedUsers));

      // Auto-login after signup
      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
      };

      setUser(authUser);
      localStorage.setItem('todo-auth-user', JSON.stringify(authUser));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('todo-auth-user');
    sessionStorage.removeItem('todo-auth-user');
    setError(null);
  };

  const clearError = (): void => {
    setError(null);
  };

  const updateProfile = async (updates: Partial<AuthUser>): Promise<void> => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedUser = { ...user, ...updates };

      // Update stored users
      const storedUsers = JSON.parse(localStorage.getItem('todo-users') || '[]');
      const updatedUsers = storedUsers.map((u: any) =>
        u.id === user.id ? { ...u, ...updates } : u
      );
      localStorage.setItem('todo-users', JSON.stringify(updatedUsers));

      // Update current session
      setUser(updatedUser);
      const currentSession = localStorage.getItem('todo-auth-user') || sessionStorage.getItem('todo-auth-user');
      if (currentSession) {
        const storage = localStorage.getItem('todo-auth-user') ? localStorage : sessionStorage;
        storage.setItem('todo-auth-user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};