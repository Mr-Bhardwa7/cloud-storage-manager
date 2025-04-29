import { useEffect, useState } from 'react';
import { TeamMember } from '../types';
import { TeamHeader } from './components/TeamHeader';
import { DirectorForm } from './components/DirectorForm';
import { DirectorsList } from './components/DirectorsList';
import { AddDirectorButton } from './components/AddDirectorButton';
import { NavigationButtons } from './components/NavigationButtons';
import { VerificationView } from './components/VerificationView';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateTeamMembers } from '@/store/slices/onboardingSlice';

interface TeamMembersProps {
    onNext: () => void;
    disabled?: boolean;
}

export function TeamMembers({ onNext, disabled = false }: TeamMembersProps) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { teamMembers } = useAppSelector((state) => state.onboarding);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [formData, setFormData] = useState({ name: '', position: '', email: '' });
    const [formErrors, setFormErrors] = useState({ name: '', position: '', email: '' });

    useEffect(() => {
        if (teamMembers && teamMembers.length > 0) {
            setMembers(
                teamMembers.map(({ name, role, email }) => ({
                    name,
                    position: role,
                    email
                }))
            );
            setShowForm(false);
            setShowVerification(true);
            onNext();
        }
    }, [teamMembers])

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'email':
                return !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) 
                    ? 'Please enter a valid email address'
                    : '';
            case 'name':
                return value.length < 2 ? 'Name must be at least 2 characters' : '';
            case 'position':
                return value.length < 2 ? 'Position must be at least 2 characters' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMembers([...members, formData as TeamMember]);
        setShowForm(false);
        setFormData({ name: '', position: '', email: '' });
        setFormErrors({ name: '', position: '', email: '' });
    };

    const handleRemoveMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (!user) {
                throw new Error('User not authenticated');
            }

            const result = await dispatch(updateTeamMembers({
                userId: user.id,
                members
            })).unwrap();

            if (result && result.success === true) {
                setShowVerification(true);
                
                setTimeout(() => {
                    onNext();
                }, 1000);
            } else {
                throw new Error(result.message || 'Failed to update team members');
            }
        } catch (error) {
            console.error('Failed to update team members:', error);
        } finally {
            setLoading(false);
        }
    };

    if (showVerification) {
        return <VerificationView members={members} onRemove={handleRemoveMember} />;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <TeamHeader />

            {members.length > 0 && (
                <DirectorsList members={members} onRemove={handleRemoveMember} />
            )}

            {!showForm && (
                <AddDirectorButton onClick={() => setShowForm(true)} disabled={disabled} />
            )}

             {showForm && (
                <DirectorForm
                    formData={formData}
                    formErrors={formErrors}
                    onSubmit={handleAddMember}
                    onCancel={() => {
                        setShowForm(false);
                        setFormData({ name: '', position: '', email: '' });
                        setFormErrors({ name: '', position: '', email: '' });
                    }}
                    onInputChange={handleInputChange}
                />
            )}

            <NavigationButtons
                onContinue={handleSubmit}
                disabled={disabled || members.length === 0}
                loading={loading}
            />
        </div>
    );
}