import { TeamMember } from '../../types';
import { FiUser } from 'react-icons/fi';

interface DirectorFormProps {
  formData: Partial<TeamMember>;
  formErrors: Record<string, string>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DirectorForm({
  formData,
  formErrors,
  onSubmit,
  onCancel,
  onInputChange,
}: DirectorFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-[oklch(var(--theme-background))] border border-[oklch(var(--theme-border))] shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4"
    >
      <div className="flex items-center gap-3 px-6 py-5 bg-[oklch(var(--theme-muted))] border-b border-[oklch(var(--theme-border))]">
        <div className="bg-[oklch(var(--theme-primary)/0.1)] rounded-full p-2">
          <FiUser className="w-5 h-5 text-[oklch(var(--theme-primary))]" />
        </div>
        <h2 className="text-[oklch(var(--theme-foreground))] font-semibold text-lg">Add a Director</h2>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        <div>
          <input
            name="name"
            value={formData.name || ''}
            onChange={onInputChange}
            placeholder="e.g. Jane Doe"
            maxLength={100}
            className={`w-full px-5 py-3 text-base text-[oklch(var(--theme-foreground))] placeholder-[oklch(var(--theme-muted-foreground))] bg-[oklch(var(--theme-muted))] [&:autofill]:bg-[oklch(var(--theme-muted))] [&:autofill]:text-[oklch(var(--theme-foreground))] [&:-webkit-autofill]:!bg-[oklch(var(--theme-muted))] [&:-webkit-autofill]:!text-[oklch(var(--theme-foreground))] [&:-webkit-autofill]:shadow-[0_0_0_30px_oklch(var(--theme-muted))_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:oklch(var(--theme-foreground))] rounded-xl border ${
              formErrors.name
                ? 'border-red-400'
                : formData.name
                ? 'border-[oklch(var(--theme-primary))]'
                : 'border-[oklch(var(--theme-border))]'
            } focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none transition`}
          />
          <div className="text-sm text-red-500 mt-1">{formErrors.name}</div>
        </div>

        <div>
          <input
            name="position"
            value={formData.position || ''}
            onChange={onInputChange}
            placeholder="e.g. Chief Technology Officer"
            maxLength={100}
            className={`w-full px-5 py-3 text-base text-[oklch(var(--theme-foreground))] placeholder-[oklch(var(--theme-muted-foreground))] bg-[oklch(var(--theme-muted))] [&:autofill]:bg-[oklch(var(--theme-muted))] [&:autofill]:text-[oklch(var(--theme-foreground))] [&:-webkit-autofill]:!bg-[oklch(var(--theme-muted))] [&:-webkit-autofill]:!text-[oklch(var(--theme-foreground))] [&:-webkit-autofill]:shadow-[0_0_0_30px_oklch(var(--theme-muted))_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:oklch(var(--theme-foreground))] rounded-xl border ${
              formErrors.position
                ? 'border-red-400'
                : formData.position
                ? 'border-[oklch(var(--theme-primary))]'
                : 'border-[oklch(var(--theme-border))]'
            } focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none transition`}
          />
          <div className="text-sm text-red-500 mt-1">{formErrors.position}</div>
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={onInputChange}
            placeholder="e.g. jane@example.com"
            maxLength={100}
            className={`w-full px-5 py-3 text-base text-[oklch(var(--theme-foreground))] placeholder-[oklch(var(--theme-muted-foreground))] bg-[oklch(var(--theme-muted))] [&:autofill]:bg-[oklch(var(--theme-muted))] [&:autofill]:text-[oklch(var(--theme-foreground))] [&:-webkit-autofill]:!bg-[oklch(var(--theme-muted))] [&:-webkit-autofill]:!text-[oklch(var(--theme-foreground))] [&:-webkit-autofill]:shadow-[0_0_0_30px_oklch(var(--theme-muted))_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:oklch(var(--theme-foreground))] rounded-xl border ${
              formErrors.email
                ? 'border-red-400'
                : formData.email
                ? 'border-[oklch(var(--theme-primary))]'
                : 'border-[oklch(var(--theme-border))]'
            } focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none transition`}
          />
          <div className="text-sm text-red-500 mt-1">{formErrors.email}</div>
        </div>
      </div>

      <div className="flex justify-end gap-3 px-6 py-4 bg-[oklch(var(--theme-muted))] border-t border-[oklch(var(--theme-border))]">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-xl text-sm font-medium text-[oklch(var(--theme-primary))] border border-[oklch(var(--theme-border))] bg-[oklch(var(--theme-background))] hover:bg-[oklch(var(--theme-muted))] transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            !formData.name ||
            !formData.position ||
            !formData.email ||
            Object.values(formErrors).some((e) => e)
          }
          className="px-6 py-2 rounded-xl text-sm font-medium text-white bg-[oklch(var(--theme-primary))] hover:bg-[oklch(var(--theme-primary)/0.8)] transition disabled:opacity-60"
        >
          Add Director
        </button>
      </div>
    </form>
  );
}
