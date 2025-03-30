"use client";
import { useState } from "react";
import { Button, Input, Card, Form } from "nextuiq";
import Divider from "@/components/divider";
import { GithubButton, GoogleButton } from "@/components/socialButtons";
import Link from "next/link";

interface LoginFormProps {
    onSubmit: (email: string) => void;
    loading?: boolean;
}

export default function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [email, setEmail] = useState("");

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setErrors({ email: "Email is required" });
            return false;
        }
        if (!emailRegex.test(email)) {
            setErrors({ email: "Please enter a valid email address" });
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateEmail(email)) {
            onSubmit(email);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <Card 
            className="relative"
            role="region"
            aria-label="Login form"
        >
            <div className="absolute inset-0 bg-[oklch(var(--theme-background))] border rounded-xl border-[oklch(var(--theme-foreground))]" />
            <div className="relative p-6 space-y-6">
                <div 
                    className="grid grid-cols-2 gap-3" 
                    role="group" 
                    aria-label="Sign in with social accounts"
                >
                    <GoogleButton />
                    <GithubButton />
                </div>
                
                <Divider aria-hidden="true" />
                <Form 
                    onSubmit={handleSubmit}
                    aria-label="Email login form"
                    noValidate
                >
                    <div className="space-y-4">
                        <Input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) validateEmail(e.target.value);
                        }}
                        onBlur={() => validateEmail(email)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your personal or work email"
                        aria-label="Email address"
                        required
                        error={!!errors.email}
                        hint={errors.email}
                        className={`h-12 w-full px-4 rounded-lg border border-[oklch(var(--theme-border))] bg-transparent transition-all duration-200
                            ${errors.email
                            ? 'border-[oklch(var(--theme-destructive))] focus:ring-[oklch(var(--theme-destructive))] focus:border-[oklch(var(--theme-destructive))]'
                            : 'hover:border-[oklch(var(--color-black))] focus:ring-[oklch(var(--color-black))]'
                            }`}
                        />

                        <Button 
                            type="submit"
                            aria-label="Continue with email"
                            className="h-12 w-full"
                            loading={loading}
                            disabled={loading}
                        >
                            Continue with email
                        </Button>
                    </div>

                    <div className="mt-4">
                        <p 
                            className="text-center text-[0.6rem] text-[oklch(var(--theme-muted-foreground))]"
                            role="contentinfo"
                        >
                            By continuing, you agree to Anthropic&apos;s{' '}
                            <Link 
                                href="#"
                                aria-label="Consumer Terms (opens in new tab)"
                                className="text-[oklch(var(--theme-primary))] hover:underline focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none rounded-sm"
                            >
                                Consumer Terms
                            </Link>
                            {' '}and{' '}
                            <Link 
                                href="#"
                                aria-label="Usage Policy (opens in new tab)"
                                className="text-[oklch(var(--theme-primary))] hover:underline focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none rounded-sm"
                            >
                                Usage Policy
                            </Link>
                            , and acknowledge their{' '}
                            <Link 
                                href="#"
                                aria-label="Privacy Policy (opens in new tab)"
                                className="text-[oklch(var(--theme-primary))] hover:underline focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none rounded-sm"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </Form>
            </div>
        </Card>
    );
}