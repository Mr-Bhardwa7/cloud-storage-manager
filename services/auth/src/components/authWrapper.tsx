'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Loader,
} from 'nextuiq';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AUTHLY_LOGIN } from '@/constants/routes';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useAuthState } from '@/hooks/useAuthState';

interface AuthWrapperProps {
  children: React.ReactNode;
}
const publicRoutes = [
  AUTHLY_LOGIN,
  '/login',
  '/auth/token-verification',
  '/token-verification'
];

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoading, isAuthenticated } = useAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDialog(!isAuthenticated && !publicRoutes.includes(pathname));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[oklch(var(--background))]">
        <Loader className="text-primary" />
      </div>
    );
  }

  return (
    <>
      {children}

      <Dialog open={showDialog} onOpenChange={() => {}}>
        <DialogContent className="w-full max-w-xl mx-auto rounded-xl p-0 overflow-hidden shadow-xl animate-in fade-in duration-300 bg-[oklch(var(--theme-background)/0.8)] backdrop-blur-sm">
          {/* Content Row */}
          <div className="flex p-6 space-x-4">
            {/* Icon */}
            <div className="flex items-start pt-1">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[oklch(var(--theme-warning)/0.15)] text-[oklch(var(--theme-warning)/0.8)] text-xl">
                <HiOutlineExclamationCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <DialogHeader className="text-left space-y-1">
                <DialogTitle className="text-lg font-semibold text-[oklch(var(--theme-foreground))]">
                  Authentication Required
                </DialogTitle>
                <DialogDescription className="text-sm text-[oklch(var(--theme-muted-foreground))]">
                  Your session has expired or you're not authenticated. Please retry or return to login.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[oklch(var(--theme-muted))] px-6 py-4 flex justify-end gap-3 border-t border-[oklch(var(--theme-border))]">
            <Button
              variant="outline"
              className="border border-gray-200 bg-[oklch(var(--theme-primary-foreground))] hover:bg-gray-100 text-gray-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
            <Button
              variant="primary"
              className="bg-[oklch(var(--theme-primary))] hover:bg-[oklch(var(--theme-primary)/0.8)] text-white"
              onClick={() => router.push(AUTHLY_LOGIN)}
            >
              Back to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
