"use client";
import { Card, Button } from "nextuiq";
import { useEffect } from "react";
import { HiOutlineMail } from "react-icons/hi";

interface VerificationCardProps {
    email: string;
    goToVerificationStep: () => void;
    backToLoginStep: () => void;
}

export default function VerificationCard({ email, goToVerificationStep, backToLoginStep }: VerificationCardProps) {
    useEffect(() => {
        const timer = setTimeout(goToVerificationStep, 4000);
        return () => clearTimeout(timer);
    }, [goToVerificationStep]);

    return (
        <Card 
            className="relative"
            role="region"
            aria-label="Email verification instructions"
        >
            <div className="absolute inset-0 bg-[oklch(var(--theme-background))] border rounded-xl border-[oklch(var(--theme-foreground))]" />
            <div className="relative p-6 space-y-6 flex flex-col items-center text-center">
                <div 
                    className="w-14 h-14 rounded-full bg-[oklch(var(--theme-muted))] flex items-center justify-center"
                    aria-hidden="true"
                >
                    <HiOutlineMail className="w-9 h-9 text-[oklch(var(--theme-foreground))]" />
                </div>

                <div className="space-y-2">
                    <h2 
                        className="text-lg font-semibold text-[oklch(var(--theme-foreground))]"
                        id="verification-heading"
                    >
                        To continue, click the link sent to
                    </h2>
                    <p 
                        className="font-medium text-[oklch(var(--theme-foreground))]"
                        aria-labelledby="verification-heading"
                    >
                        {email}
                    </p>
                </div>

                <div className="space-y-1 w-full">
                    <p className="text-xs text-[oklch(var(--theme-muted-foreground))]">
                        Signing in from another browser?{' '}
                        <Button 
                            variant="link" 
                            onClick={goToVerificationStep}
                            className="!text-[oklch(var(--theme-primary))] hover:!text-[oklch(var(--theme-primary))]"
                            aria-label="Switch to verification code input"
                        >
                            Enter verification code
                        </Button>
                    </p>
                    <p className="text-xs text-[oklch(var(--theme-muted-foreground))]">
                        Not seeing the email in your inbox?{' '}
                        <Button 
                            variant="link" 
                            onClick={backToLoginStep}
                            className="!text-[oklch(var(--theme-primary))] hover:!text-[oklch(var(--theme-primary))]"
                            aria-label="Resend verification email"
                        >
                            Try sending again
                        </Button>
                    </p>
                </div>
            </div>
        </Card>
    );
}