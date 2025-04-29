import {  FiShield, FiCloud } from 'react-icons/fi';
import { SelectionHeader } from './components/SelectionHeader';
import { SelectionCard } from './components/SelectionCard';
import { Features } from '../types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useState } from 'react';
import { updateUserType } from '@/store/slices/onboardingSlice';

interface UserTypeSelectionProps {
    value: 'individual' | 'company' | null;
    onChange: (type: 'individual' | 'company') => void;
    selected?: 'individual' | 'company' | null;
}

export function UserTypeSelection({ value, onChange, selected }: UserTypeSelectionProps) {
    const features: Features = {
        individual: [
            { icon: <FiCloud />, text: "10GB Secure Personal Storage" },
            { icon: <FiShield />, text: "Private End-to-End Encryption" },
        ],
        company: [
            { icon: <FiCloud />, text: "Enterprise-Level Scalable Storage" },
            { icon: <FiShield />, text: "Advanced Security & Compliance" },
        ]
    };

    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSelect = async (type: 'individual' | 'company') => {
        if (isSubmitting || !user || value) return;
        
        setIsSubmitting(true);
        
        try {
            await dispatch(updateUserType({
                userId: user.id,
                userType: type
            })).unwrap();
            
            setTimeout(() => {
                onChange(type);
                setIsSubmitting(false);
            }, 1000);
        } catch (error) {
            setIsSubmitting(false);
            console.error('Failed to update user type:', error);
        }
    };

    return (
        <div className="space-y-8 px-4 sm:px-0 max-w-[calc(100vw-32px)] sm:max-w-none mx-auto">
            <SelectionHeader 
                title="Select Your Cloud Solution"
                description="Your selection will define your storage experience and features."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {['individual', 'company'].map((type) => (
                    <SelectionCard
                        key={type}
                        type={type as 'individual' | 'company'}
                        isSelected={value === type || selected === type}
                        features={features[type as keyof Features]}
                        onClick={() => onSelect(type as 'individual' | 'company')}
                        isSubmitting={isSubmitting}
                    />
                ))}
            </div>
        </div>
    );
}
