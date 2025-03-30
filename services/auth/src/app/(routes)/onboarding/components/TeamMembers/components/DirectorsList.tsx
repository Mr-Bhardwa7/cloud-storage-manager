import { TeamMember } from '../../types';
import { DirectorCard } from './DirectorCard';

interface DirectorsListProps {
    members: TeamMember[];
    onRemove: (index: number) => void;
}

export function DirectorsList({ members, onRemove }: DirectorsListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="font-medium text-[oklch(var(--theme-foreground))]">
                    Directors ({members.length})
                </p>
            </div>
            <div className="space-y-3">
                {members.map((member, index) => (
                    <DirectorCard 
                        key={index} 
                        member={member} 
                        index={index}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
}