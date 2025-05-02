'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserSession } from '@/store/slices/userSlice';

export function useUserState() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.user);
  
  useEffect(() => {
    const shouldFetchSession = !isAuthenticated && !isLoading && !error;
    
    if (shouldFetchSession) {
      dispatch(fetchUserSession());
    }
  }, [dispatch]); 
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    refreshUser: () => dispatch(fetchUserSession()),
  };
}
