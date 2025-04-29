import { useState, useEffect, useCallback } from 'react';
import VerificationCard from './components/VerificationCard';
import VerificationHeader from './components/VerificationHeader';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyMobile } from '@/store/slices/onboardingSlice';
import { firebasePhoneAuth } from '@/lib/firebase';

interface MobileVerificationProps {
  onCompleted: (verificationData: { verified: boolean }) => void;
  disabled?: boolean;
  mobile: string;
}

export function MobileVerification({ onCompleted, disabled = false, mobile }: MobileVerificationProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = useCallback(async () => {
    console.log('handleSendOTP called for:', mobile);
    setLoading(true);
    setError(null);
    
    try {
      const success = await firebasePhoneAuth.sendOTP(mobile);
      console.log('OTP send result:', success);
      if (!success) {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('OTP send error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [mobile]); // Only recreate when mobile changes

  useEffect(() => {
    console.log('Initializing reCAPTCHA for mobile:', mobile);
    firebasePhoneAuth.initRecaptcha('verify-mobile');
    
    const timer = setTimeout(() => {
      console.log('Attempting to send OTP to:', mobile);
      handleSendOTP();
    }, 1000);

    return () => {
      console.log('Cleaning up Firebase auth');
      clearTimeout(timer);
      firebasePhoneAuth.cleanup();
    };
  }, [mobile, handleSendOTP]);

  const handleVerify = async () => {
    if (disabled || !user) return;
    setLoading(true);
    setError(null);

    try {
      const firebaseUser = await firebasePhoneAuth.verifyOTP(code);
      
      if (firebaseUser) {
        await dispatch(verifyMobile({
          userEmail: user.email
        })).unwrap();

        setTimeout(async () => {
          onCompleted({ verified: true });
          // await update({
          //   ...session,
          //   user: {
          //     ...session?.user,
          //     isNew: false
          //   }
          // });
        }, 300);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <VerificationHeader />
      <div id="verify-mobile"></div>
      <VerificationCard
        code={code}
        setCode={setCode}
        handleVerify={handleVerify}
        loading={loading}
        disabled={disabled}
        error={error}
        mobile={mobile}
        onResend={handleSendOTP}
      />
    </div>
  );
}
