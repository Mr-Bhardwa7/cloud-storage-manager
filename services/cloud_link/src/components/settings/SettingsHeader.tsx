interface SettingsHeaderProps {
  title: string;
  description: string;
}

export default function SettingsHeader({ title, description }: SettingsHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}