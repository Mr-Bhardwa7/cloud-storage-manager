"use client";

import { useEffect, ReactNode, useState } from 'react';
import {  usePathname } from 'next/navigation';
import { useUserState } from '@/hooks/useUserState';
import { deleteClientCookie } from '@/utils/cookie';

const basePath =  '/account';
const PUBLIC_PATHS = [
  `${basePath}/error`, 
  `${basePath}/unauthorized`, 
  `${basePath}/maintenance`, 
  `${basePath}/not-found`
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, error, refreshUser } = useUserState();
  const [isChecking, setIsChecking] = useState(true);
  
  const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path));
  
  useEffect(() => {
    // For debugging
    console.log("Auth state:", { pathname, isAuthenticated, isLoading, error, isPublicPath });
    
    // Skip auth check for public paths
    if (isPublicPath) {
      setIsChecking(false);
      return;
    }
    
    const checkAuth = async () => {
      try {
        // Only refresh if not authenticated and not already loading
        if (!isAuthenticated && !isLoading) {
          await refreshUser();
        }
        setIsChecking(false);
      } catch (err) {
        console.error('Authentication check failed:', err);
        handleAuthFailure();
      }
    };
    
    checkAuth();
  }, [pathname]); 
  
  // Handle authentication failure
  const handleAuthFailure = () => {
    // Clear auth cookies
    deleteClientCookie('next-auth.session-token');
    deleteClientCookie('next-auth.callback-url');
    deleteClientCookie('next-auth.csrf-token');
    
    // Redirect to auth service login with proper callback URL
    const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_URL || '/auth';
    const currentPath = pathname || `${basePath}/dashboard`;
    const fullUrl = window.location.origin + currentPath;
    
    window.location.href = `${authServiceUrl}/login?callbackUrl=${encodeURIComponent(fullUrl)}`;
  };
  
  // Check authentication status after initial check
  useEffect(() => {
    if (!isPublicPath && !isChecking && !isLoading && !isAuthenticated) {
      handleAuthFailure();
    }
  }, [isAuthenticated, isLoading, isChecking, isPublicPath]);
  
  // Show loading state while checking
  if (!isPublicPath && (isLoading || isChecking)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Render children once authenticated or on public paths
  return <>{children}</>;
}

