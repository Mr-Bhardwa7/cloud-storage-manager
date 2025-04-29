"use client";

import { ThemeProvider } from "nextuiq";
import { Provider } from 'react-redux';
import { store } from '@/store/store';  
import { SessionProvider } from "next-auth/react";
import AuthWrapper from "@/components/authWrapper";

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>
        <Provider store={store}>
        <AuthWrapper>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthWrapper>
      </Provider>
    </SessionProvider>
}