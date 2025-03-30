interface AIMessageProps {
    isCompleted: boolean;
    step: number;
    completedSteps: number[];
    userType: 'individual' | 'company' | null;
}

export function AIMessage({ isCompleted, step, completedSteps, userType }: AIMessageProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[oklch(var(--theme-primary))] flex items-center justify-center text-white font-semibold text-sm lg:text-base shrink-0">
                AI
            </div>
            <div className="flex-1 p-3 lg:p-4 rounded-2xl rounded-tl-none bg-[oklch(var(--theme-muted))] shadow-md">
                <p className="text-sm lg:text-base text-[oklch(var(--theme-foreground))]">
                    {step === completedSteps.length && isCompleted 
                        ? (
                            <>
                                🎉 Fantastic! Your account is all set up and ready to go. 
                                <span className="block mt-2 text-[oklch(var(--theme-primary))] font-medium">
                                    Don&apos;t worry! You can always update your information later in your profile settings.
                                </span>
                                <span className="block mt-2 text-[oklch(var(--theme-muted-foreground)] italic">
                                    Redirecting you to your dashboard in just a moment...
                                </span>
                            </>
                        )
                        : step === 1
                        ? "Let's start by selecting your account type. Are you signing up as an individual or a company?"
                        : step === 2
                        ? "Great choice! Now, let's fill in your details."
                        : step === 3 && userType === 'company'
                        ? "Next, set up your team details."
                        : step === 4 && userType === 'company'
                        ? "Great progress! Let's quickly verify your mobile number and wrap things up."
                        : "Almost there! Let's verify your phone number."
                    }
                </p>
            </div>
        </div>
    );
}