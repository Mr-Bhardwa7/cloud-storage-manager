import { Button, TextArea } from "nextuiq";
import { FiSend } from 'react-icons/fi';

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    isValid: boolean;
    disabled?: boolean;
}

export function TextInput({ value, onChange, onNext, isValid, disabled }: TextInputProps) {
    return (
        <div className="relative w-full group">
            <div className="relative">
                <TextArea
                    value={value}
                    onChange={onChange}
                    placeholder="Type your answer here..."
                    className="min-h-[120px] pr-14 rounded-xl bg-[oklch(var(--theme-muted)/0.1)] border-2 focus:border-[oklch(var(--theme-primary))] hover:bg-[oklch(var(--theme-muted)/0.2)] transition-all duration-300"
                    disabled={disabled}
                />
                <Button
                    onClick={onNext}
                    disabled={disabled || !isValid}
                    size="sm"
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:hover:translate-y-0 transition-all duration-300"
                >
                    <FiSend className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}