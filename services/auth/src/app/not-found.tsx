"use client";

import { Button } from "nextuiq";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[oklch(var(--theme-background))]">
            <div className="max-w-md w-full p-8 text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-[oklch(var(--theme-primary))] to-[oklch(var(--theme-secondary))] bg-clip-text text-transparent">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold text-[oklch(var(--theme-foreground))]">
                        Page Not Found
                    </h2>
                    <p className="text-[oklch(var(--theme-muted-foreground))]">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been removed or the link might be broken.
                    </p>
                </div>

                <Link href="/" className="inline-block">
                    <Button 
                        variant="outline"
                        className="gap-2"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}