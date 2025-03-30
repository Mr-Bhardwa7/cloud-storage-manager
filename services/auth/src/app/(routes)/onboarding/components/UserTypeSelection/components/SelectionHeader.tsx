interface SelectionHeaderProps {
    title: string;
    description: string;
}

export function SelectionHeader({ title, description }: SelectionHeaderProps) {
    return (
        <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-[oklch(var(--theme-primary))]">
                {title}
            </h2>
            <p className="text-xs text-[oklch(var(--theme-muted-foreground))]">
                {description}
            </p>
        </div>
    );
}