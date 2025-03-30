"use client";

import { ThemeProvider } from "nextuiq";
import { Provider } from 'react-redux';
import { store } from '@/store/store';  

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>
    <ThemeProvider>{children}</ThemeProvider>
  </Provider>
}