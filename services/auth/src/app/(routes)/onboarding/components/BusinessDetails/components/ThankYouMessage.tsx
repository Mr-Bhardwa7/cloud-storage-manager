import { FiMessageSquare } from "react-icons/fi";

interface ThankYouMessageProps {
    type: "company" | "individual";
}

export function ThankYouMessage({ type }: ThankYouMessageProps) {
    return (
        <div className="p-4 rounded-xl bg-[oklch(var(--theme-primary)/0.05)] border border-[oklch(var(--theme-primary)/0.1)]">
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[oklch(var(--theme-primary)/0.1)]">
                    <FiMessageSquare className="w-5 h-5 text-[oklch(var(--theme-primary))]" />
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-[oklch(var(--theme-foreground))]">
                        Thank you for providing your details
                    </p>
                   <p className="text-sm text-[oklch(var(--theme-muted-foreground))]">
                        Here&apos;s a preview of your {type === "company" ? "business" : "personal"} card. Click continue to proceed to the next step.
                    </p>
                </div>
            </div>
        </div>
    );
}