import { Button } from 'nextuiq';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface NavigationButtonsProps {
    onBack?: () => void;
    onContinue: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export function NavigationButtons({ onBack, onContinue, disabled, loading }: NavigationButtonsProps) {
    return (
        <div className="flex items-center justify-between pt-4">
            <Button
                onClick={onBack}
                variant="ghost"
                className="flex items-center gap-2 h-12 px-6"
            >
                <FiArrowLeft className="w-4 h-4" />
                Back
            </Button>
            <Button
                onClick={onContinue}
                disabled={disabled}
                loading={loading}
                className="flex items-center gap-2 px-8 h-12 rounded-xl 
                    bg-[oklch(var(--theme-primary))] hover:bg-[oklch(var(--theme-primary)/0.9)]
                    transition-all duration-300 hover:scale-105"
            >
                Continue
                <FiArrowRight className="w-4 h-4" />
            </Button>
        </div>
    );
}