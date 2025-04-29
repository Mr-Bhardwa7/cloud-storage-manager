'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiType } from 'react-icons/fi';
import { HiCheckCircle } from 'react-icons/hi';
import { updateUserName } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface NameInputProps {
  onNext: (name: string) => void;
  disabled?: boolean;
}

export function NameInput({ onNext, disabled }: NameInputProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setName(user?.name ||'');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!user) {
      setError('User not authenticated.');
      return;
    }

    if (trimmedName.length < 3) {
      setError('Name must be at least 3 characters long.');
      return;
    }

    setError(null);


    try {
      await dispatch(updateUserName({ 
        email: user.email, 
        name: trimmedName 
      })).unwrap();

      setSubmitted(true);

      setTimeout(() => {
        onNext(trimmedName);
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update name. Please try again.';
      setError(errorMessage);
      setSubmitted(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2">
      <form
        onSubmit={handleSubmit}
        className="bg-[oklch(var(--theme-background))] border border-[oklch(var(--theme-border))] shadow-xl rounded-2xl overflow-hidden font-sans"
      >
        <div className="flex items-center gap-3 px-6 py-5 bg-[oklch(var(--theme-muted))] border-b border-[oklch(var(--theme-border))]">
          <div className="bg-[oklch(var(--theme-primary)/0.1)] rounded-full p-2">
            <FiType className="text-[oklch(var(--theme-primary))] w-5 h-5" />
          </div>
          <h2 className="text-[oklch(var(--theme-foreground))] font-semibold text-lg">What&apos;s your name?</h2>
        </div>

        <AnimatePresence mode="wait">
          {!submitted && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="p-6 sm:p-8 space-y-4"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. John Doe"
                maxLength={120}
                autoFocus
                disabled={disabled}
                className={`w-full px-5 py-3 text-[oklch(var(--theme-foreground))] placeholder-[oklch(var(--theme-muted-foreground))] bg-[oklch(var(--theme-muted))] rounded-xl border ${
                  error ? 'border-red-400' : 'border-[oklch(var(--theme-border))]'
                } focus:ring-2 focus:ring-[oklch(var(--theme-primary))] focus:outline-none transition`}
              />

              <div className="flex justify-between text-sm mt-1">
                <span className="text-red-500 font-medium">{error || ''}</span>
                <span className="text-[oklch(var(--theme-primary))]">{name.length} / 120 characters</span>
              </div>
            </motion.div>
          )}

          {submitted && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-center py-12"
            >
              <HiCheckCircle className="text-green-500 w-6 h-6 mr-2" />
              <p className="text-[oklch(var(--theme-muted-foreground))]">Saving your name...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!submitted && (
          <div className="flex justify-end px-6 py-4 bg-[oklch(var(--theme-muted))] border-t border-[oklch(var(--theme-border))]">
            <button
              type="submit"
              disabled={name.trim().length < 3 || disabled}
              className={`bg-[oklch(var(--theme-primary))] text-white px-6 py-2 rounded-xl text-sm font-medium shadow transition ${
                name.trim().length < 3 || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[oklch(var(--theme-primary)/0.8)]'
              }`}
            >
              Continue
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
