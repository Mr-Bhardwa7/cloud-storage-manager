import { ReactNode } from "react";

interface QuestionHeaderProps {
    icon: ReactNode;
    question: string;
    placeholder: string;
}

export function QuestionHeader({ icon, question, placeholder }: QuestionHeaderProps) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[oklch(var(--theme-primary)/0.1)] flex items-center justify-center">
                <div className="text-[oklch(var(--theme-primary))]">{icon}</div>
            </div>
            <div className="space-y-1">
                <h3 className="text-xl font-medium text-[oklch(var(--theme-foreground))]">{question}</h3>
                <p className="text-sm text-[oklch(var(--theme-muted-foreground)]">{placeholder}</p>
            </div>
        </div>
    );
}