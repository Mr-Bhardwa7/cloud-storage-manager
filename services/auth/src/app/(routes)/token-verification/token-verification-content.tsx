"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "nextuiq";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function TokenVerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [otp, setOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/magic/verify-token?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOtp(data.otp);
          } else {
            setError(data.message || "Token is invalid or expired.");
          }
        })
        .catch(() => setError("Something went wrong while verifying the token."));
    }
  }, [token]);

  const handleCopy = async () => {
    if (otp) {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[oklch(var(--theme-background))]">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[oklch(var(--theme-primary))] to-[oklch(var(--theme-secondary))] bg-clip-text text-transparent">
            Magic Login
          </h1>
          <p className="text-[oklch(var(--theme-muted-foreground))]">
            Secure authentication process
          </p>
        </div>

        {error ? (
          <div className="p-4 rounded-xl bg-[oklch(var(--theme-destructive)/0.1)] text-[oklch(var(--theme-destructive))]">
            {error}
          </div>
        ) : otp ? (
          <div className="space-y-4">
            <p className="text-[oklch(var(--theme-muted-foreground))]">
              Enter the OTP sent to your email:
            </p>
            <div className="relative">
              <div className="p-4 font-mono text-lg bg-[oklch(var(--theme-muted)/0.1)] text-[oklch(var(--theme-foreground))] rounded-xl border border-[oklch(var(--theme-border))]">
                {otp}
              </div>
              <Button
                variant="ghost"
                size="md"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleCopy}
              >
                {copied ? (
                  <FiCheck className="w-4 h-4 text-[oklch(var(--theme-primary))]" />
                ) : (
                  <FiCopy className="w-4 h-4 text-[oklch(var(--theme-foreground))]" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="w-6 h-6 border-2 border-[oklch(var(--theme-primary))] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}