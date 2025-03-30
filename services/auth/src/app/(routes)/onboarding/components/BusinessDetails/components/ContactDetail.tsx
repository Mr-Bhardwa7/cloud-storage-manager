interface ContactDetailProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

export function ContactDetail({ icon, label, value }: ContactDetailProps) {
    return (
        <div className="group/item p-4 rounded-xl bg-[oklch(var(--theme-primary)/0.05)] hover:bg-[oklch(var(--theme-primary)/0.1)] transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[oklch(var(--theme-primary)/0.1)] group-hover/item:bg-[oklch(var(--theme-primary)/0.2)] group-hover/item:scale-110 transition-all duration-300">
                    {icon}
                </div>
                <div className="space-y-1 overflow-hidden">
                    <p className="text-sm text-[oklch(var(--theme-muted-foreground)] group-hover/item:text-[oklch(var(--theme-primary))] transition-colors duration-300">{label}</p>
                    <p className="font-medium truncate">{value}</p>
                </div>
            </div>
        </div>
    );
}