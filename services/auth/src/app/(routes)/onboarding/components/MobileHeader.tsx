export function MobileHeader() {
    return (
        <div className="max-md:block lg:hidden relative overflow-hidden">
            <div className="absolute inset-0 bg-[oklch(var(--theme-primary))]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.1]" />
            
            <div className="relative flex items-center gap-4 p-8 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-semibold shadow-lg transform hover:scale-105 transition-transform duration-200">
                    AI
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Hello, I&apos;m Trae
                    </h1>
                    <p className="text-sm text-white/90 font-medium">
                        Let&apos;s set up your account
                    </p>
                </div>
            </div>
        </div>
    );
}