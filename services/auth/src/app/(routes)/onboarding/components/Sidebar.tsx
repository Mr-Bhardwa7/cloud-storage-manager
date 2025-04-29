import { useEffect, useState } from 'react';
import { ProgressIndicator } from './ProgressIndicator';

interface SidebarProps {
  userType: 'individual' | 'company' | null;
  completedSteps: number[];
}

const motivators = [
  "Every great journey starts with a single step 🚀",
  "You’re doing great! Keep going 💪",
  "Trae’s here whenever you need help ✨",
];

export function Sidebar({ userType, completedSteps }: SidebarProps) {
  const [quote, setQuote] = useState(motivators[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(prev => {
        const currentIndex = motivators.indexOf(prev);
        return motivators[(currentIndex + 1) % motivators.length];
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="max-lg:hidden w-1/4 fixed left-0 top-0 h-screen bg-[oklch(var(--theme-primary))] rounded-r-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.2)] z-30 border-r border-white/10">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-cover opacity-10 pointer-events-none animate-shimmer-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10 opacity-10 pointer-events-none" />

      {/* FLOATING ORB */}
      <div className="absolute top-12 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float-glow z-0" />
      
      {/* CONTENT */}
      <div className="relative z-10 flex flex-col h-full px-8 pt-14 pb-8 text-white justify-between">
        {/* HEADER: AI BUBBLE + TEXT */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner ring-2 ring-white/30 animate-breathe-glow">
              AI
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold leading-snug">
                Hello, I&apos;m <span className="text-white">Trae</span>
              </h1>
              <p className="text-sm text-white/80 mt-1">
                I’ll guide you through the process, step-by-step.
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS SECTION */}
        {completedSteps.length !== 1 && (
          <div className="mt-10 flex-1 overflow-y-auto scrollbar-none animate-fade-in-slow">
            <div className="relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/20 before:rounded-full">
              <ProgressIndicator userType={userType} completedSteps={completedSteps} />
            </div>
          </div>
        )}

        {/* MOTIVATIONAL FOOTER */}
        <div className="text-sm text-white/60 italic mt-6 animate-fade-in-slow transition-opacity duration-500">
          {quote}
        </div>
      </div>
    </aside>
  );
}
