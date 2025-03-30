import { ReactNode } from 'react';

export type UserType = 'individual' | 'company' | null;

export interface BusinessDetailsData {
    name: string;
    email: string;
    phone: string;
    description?: string;
}

export interface TeamMemberData {
    name: string;
    position: string;
    email: string;
}

export interface UserTypeSelectionProps {
    value: UserType;
    onChange: (type: 'individual' | 'company') => void;
}

export interface BusinessDetailsProps {
    type: 'individual' | 'company';
    onBack: () => void;
    onNext: (details: BusinessDetailsData) => void;
}

export interface TeamMembersProps {
    onBack: () => void;
    onNext: (members: TeamMemberData[]) => void;
}

export interface MobileVerificationProps {
    onBack: () => void;
    onComplete: () => void;
}

export interface Feature {
    icon: ReactNode;
    text: string;
}

export interface Features {
    individual: Feature[];
    company: Feature[];
}

export interface TeamMember {
    name: string;
    position: string;
    email: string;
}