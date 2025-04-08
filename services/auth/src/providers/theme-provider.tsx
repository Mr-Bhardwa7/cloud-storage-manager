"use client";

import { ThemeProvider } from "nextuiq";
import { Provider } from 'react-redux';
import { store } from '@/store/store';  
import { SessionProvider } from "next-auth/react";

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>
        <Provider store={store}>
          <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    </SessionProvider>
}