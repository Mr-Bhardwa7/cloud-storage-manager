'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from './FormInput';
import ImageUpload from './ImageUpload';
import TeamMembers from './TeamMembers';
import { ProfileType, TeamMember } from '@/types/settings';
import { useAppSelector } from '@/store/hooks';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  role?: string;
  country: string;
  description?: string;
  website?: string;
  size?: string;
  avatar?: string | null;
  logo?: string | null;
};

export default function GeneralSettings() {
  const { user } = useAppSelector((state) => state.user);
  const userProfileType: ProfileType = (user?.onboarding?.userType?.toLowerCase() || 'individual') as ProfileType;
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(user?.onboarding?.company?.teamMembers || []);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userProfileType === 'individual' ? user?.onboarding?.individual?.avatar || null : user?.onboarding?.company?.logo || null
  );

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: (userProfileType === 'individual' ? user?.name : user?.onboarding?.company?.name) || '',
      email: user?.email || '',
      phone: userProfileType === 'individual' 
        ? user?.onboarding?.individual?.mobile 
        : user?.onboarding?.company?.mobile || '',
      role: user?.onboarding?.individual?.role || '',
      country: userProfileType === 'individual'
        ? user?.onboarding?.individual?.country
        : user?.onboarding?.company?.country || '',
      description: user?.onboarding?.company?.description || '',
      website: user?.onboarding?.company?.website || '',
      size: user?.onboarding?.company?.size || '',
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormValues) => {
    const formData = {
      ...data,
      [userProfileType === 'individual' ? 'avatar' : 'logo']: imagePreview,
      ...(userProfileType === 'company' && { teamMembers })
    };
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg">
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 space-y-4">
            <FormInput
              label={userProfileType === 'individual' ? "Name" : "Company Name"}
              type="text"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <FormInput
              label="Email"
              type="email"
              disabled
              {...register('email')}
            />
            <FormInput
              label="Phone"
              type="tel"
              error={errors.phone?.message}
              {...register('phone', {
                pattern: { value: /^\+?[\d\s-]+$/, message: 'Invalid phone number' }
              })}
            />

            {userProfileType === 'individual' ? (
              <>
                <FormInput 
                  label="Role" 
                  type="select"
                  error={errors.role?.message}
                  {...register('role', { required: 'Role is required' })}
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
                  error={errors.country?.message}
                  {...register('country', { required: 'Country is required' })}
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
              </>
            ) : (
              <>
                <FormInput
                  label="Description"
                  type="textarea"
                  rows={3}
                  error={errors.description?.message}
                  {...register('description', { required: 'Description is required' })}
                />
                <FormInput
                  label="Website"
                  type="url"
                  error={errors.website?.message}
                  {...register('website', {
                    pattern: { value: /^https?:\/\/.+\..+$/, message: 'Invalid website URL' }
                  })}
                />
                <FormInput 
                  label="Company Size"
                  type="select"
                  error={errors.size?.message}
                  {...register('size', { required: 'Company size is required' })}
                  options={[
                    { value: '1-10', label: '1-10 employees' },
                    { value: '11-50', label: '11-50 employees' },
                    { value: '51-200', label: '51-200 employees' },
                    { value: '201-500', label: '201-500 employees' },
                    { value: '501-1000', label: '501-1000 employees' },
                    { value: '1000+', label: '1000+ employees' }
                  ]}
                />
              </>
            )}
          </div>
          <ImageUpload
            label={userProfileType === 'individual' ? "Avatar" : "Logo"}
            preview={imagePreview}
            onImageUpload={handleImageUpload}
            isRounded={userProfileType === 'individual'}
          />
        </div>

        {userProfileType === 'company' && (
          <TeamMembers members={teamMembers} setMembers={setTeamMembers} />
        )}

        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}