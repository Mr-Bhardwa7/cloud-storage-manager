import { Suspense } from "react";
import TokenVerificationContent from "./token-verification-content";

export default function TokenVerificationPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-[oklch(var(--theme-background))]">
          <div className="w-6 h-6 border-2 border-[oklch(var(--theme-primary))] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TokenVerificationContent />
    </Suspense>
  );
}