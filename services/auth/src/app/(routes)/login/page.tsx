"use client";
import dynamic from "next/dynamic";
import { NetworkAnimation } from "@/components/network-animation";
const RenderActionCard = dynamic(() => import('./render-action-card'), { ssr: false });
import { useState } from "react";
import { signIn } from "next-auth/react";
import { CLOUDLINK_DASHBOARD } from "@/constants/routes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState('login'); // ['login', 'verification', 'code']

  const requestOtp = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/magic/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request magic link");
      setEmail(email);
      setVerificationStep("verification");
    } catch (error: unknown) {
      console.error("Magic link request failed:", error instanceof Error? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const onOtpVerification = async (otp: string): Promise<void> => {
    try {
      setLoading(true);
      // const res = await fetch("/api/auth/magic/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ otp: code, email }),
      // });

      // const data = await res.json();
      // if (res.ok) {
      //   console.log("Login successful!");
        
      //   // Check user onboarding status
      //   const userRes = await fetch("/api/auth/me");
      //   const userData = await userRes.json();
        
      //   const redirectPath = !userData.user?.onboarding?.completed ? "/auth/onboarding" : "/accounts/dashboard";
      //   setTimeout(() => (window.location.href = redirectPath), 2000);
      // } else {
      //   console.log(data.message || "Invalid OTP.");
      // }

      const res = await signIn("credentials", {
        email,
        otp,
        redirect: true, 
        callbackUrl: CLOUDLINK_DASHBOARD
      });

      // Optional: handle response manually if redirect is false
      if (res?.error) {
        console.error("Login failed:", res.error);
      }
    } catch (error: unknown) {
      console.error("OTP verification failed:", error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[oklch(var(--theme-primary))] p-1.5 rotate-12" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-[oklch(var(--theme-background))]">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-semibold text-[oklch(var(--theme-foreground))]">
              Cloud Storage
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-[oklch(var(--theme-foreground))]">
              Your Digital Vault
            </h1>
            <p className="text-[oklch(var(--theme-foreground))]">
              Transform how you store, manage, and access your files.
            </p>
          </div>

          {/* Form */}
          <RenderActionCard
            verificationStep={verificationStep}
            email={email}
            requestOtp={requestOtp}
            onOtpVerification={onOtpVerification}
            backToLoginStep={() => { setVerificationStep('login');}}
            goToVerificationStep={() => { setVerificationStep('code'); }}
            loading={loading} />
        </div>
      </div>

      {/* Right Section - Animation */}
      <div className="max-lg:hidden flex-1 relative rounded-l-3xl bg-[oklch(var(--theme-primary))]">
        <div className="absolute inset-0 w-full h-full p-8 flex justify-center items-center">
            <NetworkAnimation />
        </div>
        
        {/* Text section at the bottom */}
        <div className="absolute bottom-8 left-0 right-0 text-center px-8">
            <p className="text-white text-xs font-semibold">
            Manage your files securely and effortlessly with our cloud storage solution.
            </p>
        </div>
        </div>

    </div>
  );
}