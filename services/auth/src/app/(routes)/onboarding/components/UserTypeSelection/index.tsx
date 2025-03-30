import {  FiShield, FiCloud } from 'react-icons/fi';
import { SelectionHeader } from './components/SelectionHeader';
import { SelectionCard } from './components/SelectionCard';
import { Features } from '../types';

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
                        onClick={() => onChange(type as 'individual' | 'company')}
                    />
                ))}
            </div>
        </div>
    );
}
