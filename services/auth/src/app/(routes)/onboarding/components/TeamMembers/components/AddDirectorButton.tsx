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
            className="w-full h-14 border-dashed border-2 flex items-center justify-center gap-2"
        >
            <FiUserPlus className="w-5 h-5" />
            Add New Director
        </Button>
    );
}