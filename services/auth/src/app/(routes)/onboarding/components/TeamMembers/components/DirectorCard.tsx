import { Button, Card } from 'nextuiq';
import { FiMail, FiTrash2 } from 'react-icons/fi';
import { TeamMember } from '../../types';

interface DirectorCardProps {
    member: TeamMember;
    index: number;
    onRemove: (index: number) => void;
}

export function DirectorCard({ member, index, onRemove }: DirectorCardProps) {
    return (
        <Card className="group relative overflow-hidden border border-[oklch(var(--theme-border))] hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
            <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            <div className="relative p-5 flex justify-between items-start gap-4">
                <div className="flex gap-4 items-start flex-1 min-w-0">
                    <div className="relative group/avatar">
                        <div className="w-12 h-12 rounded-xl bg-[oklch(var(--theme-primary)/0.7)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <span className="text-xl font-semibold bg-white bg-clip-text text-transparent">
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                        </div>
                    </div>
                    
                    <div className="space-y-2.5 min-w-0 py-0.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="font-semibold text-lg truncate group-hover:text-[oklch(var(--theme-primary))] transition-colors">
                                {member.name}
                            </h4>
                            <div className="h-1.5 w-1.5 rounded-full bg-[oklch(var(--theme-primary)/0.3)]" />
                            <span className="text-[oklch(var(--theme-primary)] font-medium text-sm bg-[oklch(var(--theme-muted-foreground)/0.1)] px-3 py-0.5 rounded-full">
                                {member.position}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[oklch(var(--theme-border))] bg-[oklch(var(--theme-background))] text-[oklch(var(--theme-muted-foreground)] group-hover:border-[oklch(var(--theme-primary)/0.5)] group-hover:shadow-sm transition-all duration-300">
                                <FiMail className="w-4 h-4 text-[oklch(var(--theme-primary))]" />
                                <span className="text-sm truncate">{member.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="opacity-0 group-hover:opacity-100 -mr-2 text-[oklch(var(--theme-muted-foreground)] hover:text-[oklch(var(--theme-destructive))] hover:bg-[oklch(var(--theme-destructive)/0.1)] transition-all duration-300"
                >
                    <FiTrash2 className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
}