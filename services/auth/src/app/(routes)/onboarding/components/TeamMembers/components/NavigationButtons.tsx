import { Button } from 'nextuiq';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface NavigationButtonsProps {
  onBack?: () => void;
  onContinue: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function NavigationButtons({
  onBack,
  onContinue,
  disabled,
  loading,
}: NavigationButtonsProps) {
  return (
    <div
      className={`mt-6 flex items-center ${
        onBack ? 'justify-between gap-4' : 'justify-end'
      }`}
    >
      {onBack && (
        <Button
          onClick={onBack}
          variant="ghost"
          className="flex items-center gap-2 h-11 px-6 text-sm text-gray-600 border border-gray-200 rounded-xl bg-white hover:bg-gray-100 transition-all"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </Button>
      )}
      <Button
        onClick={onContinue}
        disabled={disabled}
        loading={loading}
        className="flex items-center gap-2 h-11 px-8 text-sm font-medium text-white rounded-xl 
                   bg-[oklch(var(--theme-primary))] hover:bg-[oklch(var(--theme-primary)/0.9)] 
                   transition-all duration-300 hover:scale-[1.03] disabled:opacity-60"
      >
        <span className='px-2'>Continue</span>
        <FiArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
