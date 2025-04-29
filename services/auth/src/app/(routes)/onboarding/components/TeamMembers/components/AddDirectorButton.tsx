import { Button } from 'nextuiq';
import { FiUserPlus } from 'react-icons/fi';

interface AddDirectorButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export function AddDirectorButton({ onClick, disabled }: AddDirectorButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            variant="outline"
            className="w-full h-14 border-dashed border-2 border-[oklch(var(--theme-border))] text-[oklch(var(--theme-foreground))] flex items-center justify-center gap-2 hover:bg-[oklch(var(--theme-muted))]"
        >
            <FiUserPlus className="w-5 h-5 text-[oklch(var(--theme-foreground))]" />
            <span className="text-[oklch(var(--theme-foreground))]">Add New Director</span>
        </Button>
    );
}