import { Button, Form, Input, Card } from 'nextuiq';
import { TeamMember } from '../../types';

interface DirectorFormProps {
    formData: Partial<TeamMember>;
    formErrors: Record<string, string>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DirectorForm({ formData, formErrors, onSubmit, onCancel, onInputChange }: DirectorFormProps) {
    return (
        <Card className="p-6 border-2 shadow-lg transform transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <Form onSubmit={onSubmit} className="space-y-4">
                <Input
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={onInputChange}
                    placeholder="Enter director's name"
                    className={`h-12 transition-all duration-300 ${
                        formErrors.name ? 'border-[oklch(var(--theme-destructive))]' : 
                        formData.name ? 'border-[oklch(var(--theme-primary))]' : ''
                    }`}
                    error={!!formErrors.name}
                    required
                />
                <Input
                    name="position"
                    label="Position"
                    value={formData.position}
                    onChange={onInputChange}
                    placeholder="Enter director's position"
                    className={`h-12 transition-all duration-300 ${
                        formErrors.position ? 'border-[oklch(var(--theme-destructive))]' : 
                        formData.position ? 'border-[oklch(var(--theme-primary))]' : ''
                    }`}
                    error={!!formErrors.position}
                    required
                />
                <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="Enter director's email"
                    className={`h-12 transition-all duration-300 ${
                        formErrors.email ? 'border-[oklch(var(--theme-destructive))]' : 
                        formData.email ? 'border-[oklch(var(--theme-primary))]' : ''
                    }`}
                    error={!!formErrors.email}
                    required
                />
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        className="flex-1"
                        disabled={!formData.name || !formData.position || !formData.email || 
                            Object.values(formErrors).some(error => error)}
                    >
                        Add Director
                    </Button>
                </div>
            </Form>
        </Card>
    );
}