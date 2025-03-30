import { useState } from 'react';
import VerificationCard from './components/VerificationCard';
import VerificationHeader from './components/VerificationHeader';

interface MobileVerificationProps {
  onCompleted: (verificationData: { verified: boolean }) => void;
  disabled?: boolean;
}

export function MobileVerification({ onCompleted, disabled = false }: MobileVerificationProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (disabled) return;
    setLoading(true);
    try {
      onCompleted({ verified: true });
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <VerificationHeader />
      <VerificationCard
        code={code}
        setCode={setCode}
        handleVerify={handleVerify}
        loading={loading}
        disabled={disabled}
      />
    </div>
  );
}
