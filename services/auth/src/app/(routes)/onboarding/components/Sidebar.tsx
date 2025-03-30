import { ProgressIndicator } from './ProgressIndicator';

interface SidebarProps {
    userType: 'individual' | 'company' | null;
    completedSteps: number[];
}

export function Sidebar({ userType, completedSteps }: SidebarProps) {
    return (
        <aside className="max-lg:hidden w-1/4 fixed left-0 h-screen rounded-r-3xl bg-[oklch(var(--theme-primary))] overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative p-8 text-white h-full flex flex-col">
                <div className="flex items-start gap-4 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold shadow-lg">
                        AI
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold">Hello, I&apos;m Trae</h1>
                        <p className="text-lg text-white/80 leading-relaxed">
                            I&apos;ll guide you step by step to set up your account.
                        </p>
                    </div>
                </div>
                <ProgressIndicator userType={userType} completedSteps={completedSteps} />
            </div>
        </aside>
    );
}
