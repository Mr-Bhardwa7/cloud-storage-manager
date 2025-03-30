import { Button } from 'nextuiq';
import { BusinessDetailsData } from './index';
import { FiPhone, FiMail } from 'react-icons/fi';
import { ProfileAvatar } from './components/ProfileAvatar';

interface DetailsCardProps {
    details: BusinessDetailsData;
    onConfirm: () => void;
    type: "company" | "individual";
    disabled?: boolean;
}

export function DetailsCard({ type, details, onConfirm, disabled = false }: DetailsCardProps) {
    return (
        <div className="p-4 rounded-xl border border-[oklch(var(--theme-primary)/0.3)] bg-white shadow-md backdrop-blur-lg flex flex-col gap-4 w-120">
            {/* Profile Section */}
            <div className="flex items-center gap-4">
                <ProfileAvatar type={type} name={details.name}/>
                <div className="flex flex-col w-full space-y-2">
                    <h3 className="text-xl font-bold bg-[oklch(var(--theme-primary))] bg-clip-text text-transparent">
                        {details.name.toUpperCase()}
                    </h3>
                    <div className="flex gap-4 items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[oklch(var(--theme-border))] bg-[oklch(var(--theme-background))] text-[oklch(var(--theme-muted-foreground)] group-hover:border-[oklch(var(--theme-primary)/0.5)] group-hover:shadow-sm transition-all duration-300">
                                <FiMail className="w-4 h-4 text-[oklch(var(--theme-primary))]" />
                                <span className="text-sm truncate">{details.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[oklch(var(--theme-border))] bg-[oklch(var(--theme-background))] text-[oklch(var(--theme-muted-foreground)] group-hover:border-[oklch(var(--theme-primary)/0.5)] group-hover:shadow-sm transition-all duration-300">
                                <FiPhone className="w-4 h-4 text-[oklch(var(--theme-primary))]" />
                                <span className="text-sm truncate">{details.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="flex flex-col space-y-2">
                <p className="text-sm text-[oklch(var(--theme-muted-foreground))] overflow-hidden max-h-32 group">
                    {details.description}
                </p>
            </div>

            {/* Action Button */}
            <div>
                <Button
                    onClick={onConfirm}
                    disabled={disabled}
                    className={`w-full h-10 rounded-lg font-medium transition-transform transform hover:scale-105 duration-300 shadow-sm
                        ${disabled 
                            ? 'bg-[oklch(var(--theme-muted))] cursor-not-allowed opacity-50' 
                            : 'bg-[oklch(var(--theme-primary))] text-white shadow-[oklch(var(--theme-primary)/0.3)] hover:shadow-md'
                        }`}
                >
                    {type === "company" ? "Continue to Team Setup" : "Complete Setup"}
                </Button>
            </div>
        </div>
    );
}