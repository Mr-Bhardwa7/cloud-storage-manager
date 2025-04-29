import { Button, Card } from 'nextuiq';
import { FiMail, FiTrash2 } from 'react-icons/fi';
import { TeamMember } from '../../types';

interface DirectorCardProps {
  member: TeamMember;
  index: number;
  onRemove: (index: number) => void;
}

export function DirectorCard({ member, index, onRemove }: DirectorCardProps) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card
      className="group relative overflow-hidden rounded-2xl border border-[oklch(var(--theme-border))] bg-gradient-to-br from-[oklch(var(--theme-background))] to-[oklch(var(--theme-muted)/0.1)] 
      backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-contain opacity-[0.015] pointer-events-none z-0" />

      {/* Glow border effect on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[oklch(var(--theme-primary)/0.3)] transition-all duration-500 z-0" />

      <div className="relative z-10 p-5 flex items-start justify-between gap-4">
        {/* Avatar + Info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 min-w-[3.5rem] rounded-xl bg-[oklch(var(--theme-primary)/0.1)] text-[oklch(var(--theme-primary))] font-bold text-lg flex items-center justify-center shadow-inner tracking-wider select-none group-hover:scale-105 transition-transform duration-300">
            {initials}
          </div>

          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold truncate max-w-[200px] text-[oklch(var(--theme-foreground))] group-hover:text-[oklch(var(--theme-primary))] transition-colors">
                {member.name}
              </h4>
              <span className="text-xs font-medium text-[oklch(var(--theme-primary))] bg-[oklch(var(--theme-primary)/0.1)] px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                {member.position}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] rounded-lg border border-[oklch(var(--theme-border))] bg-[oklch(var(--theme-background))] text-[oklch(var(--theme-foreground))] transition-all duration-300 group-hover:border-[oklch(var(--theme-primary)/0.5)] group-hover:shadow-sm">
              <FiMail className="w-4 h-4 text-[oklch(var(--theme-foreground))] group-hover:text-[oklch(var(--theme-primary))]" />
              <span className="truncate max-w-[220px]">{member.email}</span>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onRemove(index)}
          className="opacity-0 group-hover:opacity-100 rounded-full p-4 transition-all duration-300"
        >
          <FiTrash2 className="w-4 h-4 group-hover:text-[oklch(var(--theme-error))]" />
        </Button>
      </div>
    </Card>
  );
}
