'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi';
import { FiMail, FiPhone, FiGlobe, FiType, FiInfo, FiUser } from 'react-icons/fi';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateBusinessDetails } from '@/store/slices/onboardingSlice';
import { isEmpty } from 'lodash';

type Step = 'name' | 'description' | 'email' | 'phone' | 'website' | 'role' | 'done';
type AnswerKey = Exclude<Step, 'done'>;
type UserType = 'company' | 'individual';

interface BusinessDetailsProps {
  userType: UserType;
  onNext: (data: Record<string, string>) => void;
  initialData?: Partial<Pick<Record<AnswerKey, string>, 'name' | 'email' | 'phone'>>;
  values?: Record<string, string>;
}

const roles = ['Student', 'Freelancer', 'Developer', 'Content Creator', 'Researcher'];

const icons: Record<Step, ReactNode> = {
  name: <FiType className="text-[oklch(var(--theme-primary))] w-5 h-5" />,
  description: <FiInfo className="text-[oklch(var(--theme-primary))] w-5 h-5" />,
  email: <FiMail className="text-[oklch(var(--theme-primary))] w-5 h-5" />,
  phone: <FiPhone className="text-[oklch(var(--theme-primary))] w-5 h-5" />,
  website: <FiGlobe className="text-[oklch(var(--theme-primary))] w-5 h-5" />,
  role: <FiUser className="text-[oklch(var(--theme-primary))] w-5 h-5" />,
  done: <HiCheckCircle className="text-[oklch(var(--theme-primary))] w-6 h-6" />,
};

export function BusinessDetails({ userType, onNext, initialData, values }: BusinessDetailsProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const steps: Step[] =
    userType === 'company'
      ? ['name', 'description', 'email', 'phone', 'website', 'done']
      : ['phone', 'role', 'done'];

  const questions: Record<Step, string> = {
    name: userType === 'company' ? "What's your company name?" : "What's your name?",
    description: 'What does your company do?',
    email: "What's your email?",
    phone: "What's your mobile number?",
    website: "What's your company website?",
    role: 'Pick a role for a better experience',
    done: '',
  };

  const placeholders: Record<Step, string> = {
    name: userType === 'company' ? 'e.g. Bytewave Inc.' : 'e.g. John Doe',
    description: 'e.g. We help manage cloud storage for teams.',
    email: 'e.g. hello@example.com',
    phone: 'e.g. +1 234 567 890',
    website: 'e.g. https://example.com (optional)',
    role: 'e.g. Developer',
    done: '',
  };

  const [step, setStep] = useState<Step>(steps[0]);
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({
    name: userType !== 'company' ? initialData?.name || '' : '',
    description: '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    website: '',
    role: '',
  });

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasCalledNext, setHasCalledNext] = useState(false);

  useEffect(() => {
   if(!isEmpty(values)) {
     setAnswers(values as Record<AnswerKey, string>);
     setStep('done');
   }
  }, [values]);

  useEffect(() => {
    if (step !== 'done') {
      const prefill = answers[step as AnswerKey];
      setInput(prefill || '');
    }
  }, [step, answers]);

  useEffect(() => {
    if (step === 'done' && !hasCalledNext) {
      const timeout = setTimeout(() => {
        onNext(answers);
        setHasCalledNext(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [step, hasCalledNext, answers, onNext]);

  const validate = (): string | null => {
    if (step === 'website') return null;
    if (!input.trim()) return 'This field is required.';
    if (step === 'email' && !/\S+@\S+\.\S+/.test(input)) return 'Invalid email format.';
    if (step === 'phone' && input.length < 10) return 'Invalid phone number.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const updatedAnswers = { ...answers, [step]: input.trim() };
      setAnswers(updatedAnswers);
      setError(null);

      const nextStep = steps[steps.indexOf(step) + 1];
      if (nextStep === 'done' && user) {
        await dispatch(updateBusinessDetails({
          userId: user.id,
          name: updatedAnswers.name,
          email: updatedAnswers.email,
          description: updatedAnswers.description,
          phone: updatedAnswers.phone,
          website: updatedAnswers.website,
          role: updatedAnswers.role,
        })).unwrap();
      }

      setTimeout(() => setStep(nextStep), 300);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save details. Please try again.';
      setError(errorMessage);
    }
};

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 font-sans">
      <div className="flex flex-col gap-10 w-full">
        {step !== 'done' && (
          <form onSubmit={handleSubmit} className="bg-[oklch(var(--theme-background))] border border-[oklch(var(--theme-border))] shadow-xl rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 bg-[oklch(var(--theme-muted))] border-b border-[oklch(var(--theme-border))]">
              <div className="bg-[oklch(var(--theme-primary)/0.1)] rounded-full p-2">{icons[step]}</div>
              <h2 className="text-[oklch(var(--theme-foreground))] font-semibold text-lg">{questions[step]}</h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="p-6 sm:p-8 space-y-4"
              >
                {step === 'phone' ? (
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={input}
                    onChange={(value) => {
                      setInput(value || '');
                      setError(null);
                    }}
                    placeholder={placeholders[step]}
                    className="w-full bg-[oklch(var(--theme-muted))] text-[oklch(var(--theme-foreground))] border border-[oklch(var(--theme-border))] rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-[oklch(var(--theme-primary))] focus-within:outline-none"
                  />
                ) : step === 'role' ? (
                  <select
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setError(null);
                    }}
                    className={`w-full px-5 py-3 text-base bg-[oklch(var(--theme-muted))] border ${
                      error ? 'border-red-400' : 'border-[oklch(var(--theme-border))]'
                    } rounded-xl text-[oklch(var(--theme-foreground))] focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none`}
                  >
                    <option value="" className="bg-[oklch(var(--theme-background))]">Select Role</option>
                    {roles.map((role) => (
                      <option key={role} value={role} className="bg-[oklch(var(--theme-background))]">
                        {role}
                      </option>
                    ))}
                  </select>
                ) : (
                 <input
                  type={step === 'email' ? 'email' : step === 'website' ? 'url' : 'text'}
                  value={input}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (step === 'website') {
                      if (value && !/^https?:\/\//i.test(value)) {
                        value = 'https://' + value;
                      }
                    }
                    setInput(value);
                    setError(null);
                  }}
                  placeholder={placeholders[step]}
                  maxLength={120}
                  className={`w-full px-5 py-3 text-base text-[oklch(var(--theme-foreground))] placeholder-[oklch(var(--theme-muted-foreground))] bg-[oklch(var(--theme-muted))] rounded-xl border ${
                    error ? 'border-red-400' : 'border-[oklch(var(--theme-border))]'
                  } focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none transition`}
                />
                )}

                <div className="flex justify-between text-sm mt-1">
                  <span className="text-red-500 font-medium">{error || ''}</span>
                  <span className="text-[oklch(var(--theme-primary))]">{input.length} / 120 characters</span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-end px-6 py-4 bg-[oklch(var(--theme-muted))] border-t border-[oklch(var(--theme-border))]">
              <button
                type="submit"
                className="bg-[oklch(var(--theme-primary))] text-[oklch(var(--theme-primary-foreground))] px-6 py-2 rounded-xl text-sm font-medium shadow hover:bg-[oklch(var(--theme-primary)/0.8)] transition"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {step === 'done' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[oklch(var(--theme-background))] border border-[oklch(var(--theme-border))] rounded-3xl shadow-xl"
          >
            <div className="flex items-center gap-3 px-6 py-6 border-b border-[oklch(var(--theme-border))] bg-[oklch(var(--theme-muted))] rounded-3xl">
              <div className="bg-[oklch(var(--theme-primary)/0.1)] rounded-full p-2">{icons.done}</div>
              <h2 className="text-[oklch(var(--theme-foreground))] font-bold text-lg">Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
              {(Object.entries(answers) as [AnswerKey, string][]).map(
                ([key, value]) =>
                  value && <SummaryField key={key} label={capitalize(key)} value={value} />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span
        className="text-xs uppercase font-medium tracking-wide mb-1"
        style={{ color: "oklch(var(--theme-muted-foreground))" }}
      >
        {label}
      </span>
      <span
        className="text-base font-normal"
        style={{ color: "oklch(var(--theme-foreground))" }}
      >
        {value}
      </span>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
