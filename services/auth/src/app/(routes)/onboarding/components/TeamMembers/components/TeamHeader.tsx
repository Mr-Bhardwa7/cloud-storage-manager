import { FiUsers } from 'react-icons/fi';

export function TeamHeader() {
    return (
        <div className="flex items-center gap-4 bg-[oklch(var(--theme-primary)/0.05)] p-4 rounded-2xl">
            <div className="w-14 h-14 rounded-xl bg-[oklch(var(--theme-primary)/0.1)] flex items-center justify-center text-[oklch(var(--theme-primary))]">
                <FiUsers className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-semibold text-[oklch(var(--theme-foreground))]">
                    Board of Directors
                </h3>
                <p className="text-sm text-[oklch(var(--theme-muted-foreground))]">
                    Add your company&apos;s directors
                </p>
            </div>
        </div>
    );
}