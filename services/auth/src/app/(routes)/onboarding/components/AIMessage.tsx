interface AIMessageProps {
  isCompleted: boolean;
  step: number;
  completedSteps: number[];
  userType: 'individual' | 'company' | null;
  username?: string | null;
}

export function AIMessage({ isCompleted, step, completedSteps, userType, username }: AIMessageProps) {
  if (step === 0 && username) return null;

  const renderMessage = () => {
    if (step === completedSteps.length - 1 && isCompleted) {
      return (
        <>
          <p className="text-base font-medium text-[oklch(var(--theme-foreground))] mb-2">
            🎉 Fantastic! Your account is all set up and ready to go.
          </p>
          <p className="text-sm text-[oklch(var(--theme-primary))] font-semibold">
            Don't worry! You can always update your information later in your profile settings.
          </p>
          <p className="text-sm text-[oklch(var(--theme-muted-foreground))] italic mt-2">
            Redirecting you to your dashboard in just a moment...
          </p>
        </>
      );
    }

    switch (step) {
      case 0:
        return (
          <>
            <p className="text-base font-medium text-[oklch(var(--theme-foreground))]">
              Hi there! 👋 I'm <span className="font-bold text-[oklch(var(--theme-primary))]">Trae</span>, your AI assistant.
            </p>
            <p className="text-sm text-[oklch(var(--theme-muted-foreground))] mt-1">
              Let's start our conversation by getting to know each other.
            </p>
          </>
        );

      case 1:
        return (
          <>
            <p className="text-base font-medium text-[oklch(var(--theme-foreground))]">
              Hello{username ? ` ${username}` : ''}! 👋 Welcome to our platform.
            </p>
            <p className="text-sm text-[oklch(var(--theme-muted-foreground))] mt-1">
              Let's start by selecting your account type: individual or company.
            </p>
          </>
        );

      case 2:
        return (
          <p className="text-base text-[oklch(var(--theme-foreground))]">
            Great choice! Now, let's fill in your details.
          </p>
        );

      case 3:
        return userType === 'company' ? (
          <p className="text-base text-[oklch(var(--theme-foreground))]">
            Next up: Let's add your team members.
          </p>
        ) : (
          <p className="text-base text-[oklch(var(--theme-foreground))]">
            Almost there! Let's verify your phone number.
          </p>
        );

      case 4:
        return userType === 'company' && (
          <p className="text-base text-[oklch(var(--theme-foreground))]">
            Great progress! Let's quickly verify your mobile number and wrap things up.
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-3 py-6 animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-[oklch(var(--theme-primary))] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
        AI
      </div>
      <div className="flex-1 p-4 rounded-2xl rounded-tl-none bg-[oklch(var(--theme-muted))] shadow-sm border border-[oklch(var(--theme-border))]">
        {renderMessage()}
      </div>
    </div>
  );
}
