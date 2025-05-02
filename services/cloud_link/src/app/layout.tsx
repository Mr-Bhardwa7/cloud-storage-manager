import type { Metadata } from "next";
import { ThemeProviderWrapper } from "@/providers/theme-provider";
import { StoreProvider } from '@/providers/StoreProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud Storage Management",
  description: "CloudLink microservice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[oklch(var(--theme-background))] antialiased">
        <StoreProvider>
          <AuthProvider>
            <ThemeProviderWrapper>
              {children}
            </ThemeProviderWrapper>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

