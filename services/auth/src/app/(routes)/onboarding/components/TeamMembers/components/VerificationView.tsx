import { TeamMember } from '../../types';
import { TeamHeader } from './TeamHeader';
import { DirectorsList } from './DirectorsList';

interface VerificationViewProps {
    members: TeamMember[];
    onRemove: (index: number) => void;
}

export function VerificationView({ members, onRemove }: VerificationViewProps) {
    return (
        <div className="space-y-8">
            <div className="pointer-events-none">
                <TeamHeader />
                {members.length > 0 && (
                    <div className="space-y-4 mt-8">
                        <DirectorsList members={members} onRemove={onRemove} />
                    </div>
                )}
            </div>
        </div>
    );
}