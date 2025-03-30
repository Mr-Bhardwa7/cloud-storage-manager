"use client";
import LoginForm from "./login-form";
import VerificationCard from "./verification-card";
import VerificationCodeCard from "./verification-code-card";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    verificationStep: string;
    email: string;
    requestOtp: (email: string) => void;
    onOtpVerification: (code: string) => void;
    backToLoginStep: () => void;
    goToVerificationStep: () => void;
    loading: boolean;
}

const renderActionCard = ({
  verificationStep,
  email,
  requestOtp,
  onOtpVerification,
  backToLoginStep,
    goToVerificationStep,
  loading
}: Props) => {
  const slideAnimation = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { 
      duration: 0.3
     }
  };

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={verificationStep}
        {...slideAnimation}
      >
        {verificationStep === 'verification' ? (
          <VerificationCard 
            email={email}
            goToVerificationStep={goToVerificationStep}
            backToLoginStep={backToLoginStep}
          />
        ) : verificationStep === 'code' ? (
          <VerificationCodeCard 
            email={email} 
            onSubmit={onOtpVerification}
            backToLoginStep={backToLoginStep}
            loading={loading}
          />
        ) : (
          <LoginForm onSubmit={requestOtp} loading={loading} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default renderActionCard;