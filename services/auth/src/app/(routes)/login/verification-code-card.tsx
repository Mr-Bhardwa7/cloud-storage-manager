"use client";
import { Card, OTPInput, Button, Form } from "nextuiq";
import { useState } from "react";

interface VerificationCodeCardProps {
    email: string;
    onSubmit: (code: string) => void;
    backToLoginStep: () => void;
    loading?: boolean;
}

export default function VerificationCodeCard({ email, onSubmit, backToLoginStep, loading = false }: VerificationCodeCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <Card 
            className="relative"
            role="region"
            aria-label="Verification code input"
        >
            <div className="absolute inset-0 bg-[oklch(var(--theme-background))] border rounded-xl border-[oklch(var(--theme-foreground))]" />
            <div className="relative p-6 space-y-4">
                <div className="space-y-2 text-center">
                    <h2 className="text-base font-medium text-[oklch(var(--theme-foreground))]">
                        Have a verification code instead?
                    </h2>
                    <p className="text-sm text-[oklch(var(--theme-foreground))]">
                        Enter the code generated from the link sent to<br />
                        <span className="font-medium text-[oklch(var(--theme-foreground))]">{email}</span>
                    </p>
                </div>

                <Form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        onSubmit(formData.get('code') as string);
                    }} 
                    className="space-y-6"
                    noValidate
                >
                    <div className="space-y-4">
                        <OTPInput
                            name="code"
                            length={6}
                            label=""
                            description=""
                            required
                            inputType="numeric"
                            className="justify-center focus:ring-0"
                            onChange={(code) => {
                                if (code.length === 6) {
                                    setIsLoading(true);
                                    onSubmit(code);
                                } else if (code.length === 5) {
                                    setIsLoading(false);
                                }
                            }}
                        />
                        
                        <Button 
                            type="submit"
                            className="h-12 w-full"
                            loading={isLoading || loading}
                        >
                            Verify Email Address
                        </Button>
                    </div>
                </Form>

                <div className="text-center">
                    <p className="text-xs text-[oklch(var(--theme-foreground))]">
                        Not seeing the email in your inbox?{' '}
                        <Button 
                            variant="link" 
                            onClick={backToLoginStep}
                            className="!text-[oklch(var(--theme-primary))] hover:!text-[oklch(var(--theme-primary))]"
                        >
                            Try sending again
                        </Button>
                    </p>
                </div>
            </div>
        </Card>
    );
}