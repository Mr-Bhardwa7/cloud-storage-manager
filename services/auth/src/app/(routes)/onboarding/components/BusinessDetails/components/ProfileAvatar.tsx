import { PiBuildings } from "react-icons/pi";

interface ProfileAvatarProps {
    type: "company" | "individual";
    name: string;
}

export function ProfileAvatar({ type, name }: ProfileAvatarProps) {
    return (
        <div className="relative group/avatar">
            {type === "company" ? (
                <div className="w-24 h-24 rounded-2xl bg-[oklch(var(--theme-primary))] p-[2px] group-hover/avatar:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center p-3">
                        <PiBuildings className="w-full h-full text-[oklch(var(--theme-primary))]" />
                    </div>
                </div>
            ) : (
                <div className="w-24 h-24 rounded-2xl bg-[oklch(var(--theme-primary))] p-[2px] group-hover/avatar:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-2xl bg-[oklch(var(--theme-primary))] flex items-center justify-center text-white text-3xl font-bold">
                        {name.charAt(0)}
                    </div>
                </div>
            )}
        </div>
    );
}