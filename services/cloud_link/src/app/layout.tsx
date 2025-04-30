import type { Metadata } from "next";
import { ThemeProviderWrapper } from "@/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud Storage Management",
  description: "Auth microservice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[oklch(var(--theme-background))] antialiased">
          <ThemeProviderWrapper>
            {children}
            </ThemeProviderWrapper>
      </body>
    </html>
  );
}