'use client';

import { useState } from 'react';
import FormInput from './FormInput';
import ImageUpload from './ImageUpload';
import TeamMembers from './TeamMembers';
import { ProfileType, TeamMember } from '@/types/settings';

export default function GeneralSettings() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const userProfileType: ProfileType = 'individual' as ProfileType;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setPreview: (preview: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 space-y-6">
        {userProfileType === 'individual' ? (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-1 space-y-4">
                <FormInput label="Name" type="text" />
                <FormInput label="Email" type="email" disabled />
                <FormInput label="Phone" type="tel" />
                <FormInput 
                  label="Role" 
                  type="select"
                  options={[
                    { value: 'Student', label: 'Student' },
                    { value: 'Freelancer', label: 'Freelancer' },
                    { value: 'Developer', label: 'Developer' },
                    { value: 'Content Creator', label: 'Content Creator' },
                    { value: 'Researcher', label: 'Researcher' }
                  ]}
                />
                <FormInput 
                  label="Country/Region" 
                  type="select"
                  options={[
                    { value: 'US', label: 'United States' },
                    { value: 'UK', label: 'United Kingdom' },
                    { value: 'CA', label: 'Canada' },
                    { value: 'AU', label: 'Australia' },
                    { value: 'DE', label: 'Germany' },
                    { value: 'FR', label: 'France' },
                    { value: 'JP', label: 'Japan' }
                  ]}
                />
              </div>
              <ImageUpload
                label="Avatar"
                preview={avatarPreview}
                onImageUpload={(e) => handleImageUpload(e, setAvatarPreview)}
                isRounded={true}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-1 space-y-4">
                <FormInput label="Company Name" type="text" />
                <FormInput label="Description" type="textarea" rows={3} />
                <FormInput label="Email" type="email" disabled />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Phone" type="tel" />
                  <FormInput label="Website" type="url" />
                </div>
                <FormInput 
                  label="Company Size" 
                  type="select"
                  options={[
                    { value: '1-10', label: '1-10 employees' },
                    { value: '11-50', label: '11-50 employees' },
                    { value: '51-200', label: '51-200 employees' },
                    { value: '201-500', label: '201-500 employees' },
                    { value: '501-1000', label: '501-1000 employees' },
                    { value: '1000+', label: '1000+ employees' }
                  ]}
                />
              </div>
              <ImageUpload
                label="Logo"
                preview={logoPreview}
                onImageUpload={(e) => handleImageUpload(e, setLogoPreview)}
                isRounded={false}
              />
            </div>
            <TeamMembers members={teamMembers} setMembers={setTeamMembers} />
          </div>
        )}
      </div>
    </div>
  );
}