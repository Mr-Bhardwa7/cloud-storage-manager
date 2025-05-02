'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/userSlice';

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call our logout API
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error('Logout failed:', await response.json());
        }
        
        // Clear Redux state
        dispatch(logout());
        
        // Redirect to login page
        const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_URL || '/auth';
        window.location.href = `${authServiceUrl}/login`;
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/auth/login';
      }
    };
    
    performLogout();
  }, [dispatch, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mx-auto"></div>
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">Logging out...</h1>
        <p className="mt-2 text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}