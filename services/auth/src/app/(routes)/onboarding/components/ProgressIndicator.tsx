interface ProgressIndicatorProps {
    userType: 'individual' | 'company' | null;
    completedSteps: number[];
}

export function ProgressIndicator({ userType, completedSteps }: ProgressIndicatorProps) {
    const steps = ['Account Type', 'Basic Details', userType === 'company' ? 'Team Setup' : 'Verification', 'Verification']
        .slice(0, userType === 'company' ? 4 : 3);

    return (
        <div className="mt-auto p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-sm font-medium mb-3">Current Progress</p>
            <div className="space-y-2">
                {steps.map((label, index) => (
                    <div key={index} className={`flex items-center gap-2 ${completedSteps.includes(index + 1) ? 'text-white' : 'text-white/50'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all 
                            ${completedSteps.includes(index + 1) ? 'bg-white text-[oklch(var(--theme-primary))] scale-110' : 'border border-white/50'}
                        `}>
                            {index + 1}
                        </div>
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}