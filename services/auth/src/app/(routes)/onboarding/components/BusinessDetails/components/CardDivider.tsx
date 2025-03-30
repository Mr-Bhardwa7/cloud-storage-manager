export function CardDivider() {
    return (
        <div className="hidden md:block w-[2px] relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(var(--theme-primary)/0.2)] to-transparent group-hover:via-[oklch(var(--theme-primary)/0.4)] transition-colors duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
        </div>
    );
}