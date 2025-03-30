export default function Divider() {
    return (
    <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[oklch(var(--theme-border))]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[oklch(var(--theme-background))] px-2 text-[oklch(var(--theme-muted-foreground))]">
                Or
            </span>
        </div>
    </div>
    );
}