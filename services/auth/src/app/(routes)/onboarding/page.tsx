'use client';

import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { UserTypeSelection } from './components/UserTypeSelection';
import { BusinessDetails } from './components/BusinessDetails';
import { TeamMembers } from './components/TeamMembers';
import { MobileVerification } from './components/MobileVerification';
import { useRouter } from 'next/navigation';
import { MobileHeader } from './components/MobileHeader';
import { Sidebar } from './components/Sidebar';
import { AIMessage } from './components/AIMessage';
import { CLOUDLINK_DASHBOARD } from '@/constants/routes';

type UserType = 'individual' | 'company' | null;

export default function Onboarding() {
    const [userType, setUserType] = useState<UserType>(null);
    const [completedSteps, setCompletedSteps] = useState<number[]>([1]); // Start with step 1
    const lastStepRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleNext = () => {
        setCompletedSteps(prev => [...prev, prev.length + 1]);
    };

   useEffect(() => {
    if (lastStepRef.current) {
        setTimeout(() => {
            lastStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200); 
    }
}, [completedSteps]);

    const handleComplete = () => {
        setIsCompleted(true);
        setShowConfetti(true);
        handleNext();

        setTimeout(() => {
            setShowConfetti(false);
            router.replace(CLOUDLINK_DASHBOARD);
        }, 5000);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[oklch(var(--theme-background))] relative">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 100,
                        pointerEvents: 'none'
                    }}
                />
            )}

            <MobileHeader />
            <Sidebar userType={userType} completedSteps={completedSteps} />

            <main className="flex-1 lg:ml-[25%] max-lg:w-full">
                <div className="min-h-[calc(100vh-88px)] lg:min-h-screen overflow-y-auto flex flex-col items-center justify-start px-4 sm:px-8 lg:px-24 py-6 lg:py-12">
                    <div className="max-w-3xl w-full space-y-6">
                        {completedSteps.map((step, index) => (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="space-y-4"
                                ref={index === completedSteps.length - 1 ? lastStepRef : null}
                            >
                                <AIMessage 
                                    isCompleted={isCompleted}
                                    step={step}
                                    completedSteps={completedSteps}
                                    userType={userType}
                                />

                                <div className="lg:ml-14">
                                    {step === 1 && (
                                        <UserTypeSelection
                                            value={userType}
                                            onChange={(value) => {
                                               if (!completedSteps.includes(2)) { 
                                                    setUserType(value);
                                                    setTimeout(() => {
                                                        handleNext();
                                                    }, 1000);
                                                }
                                            }}
                                        />
                                    )}
                                    {step === 2 && (
                                        <BusinessDetails
                                            type={userType!}
                                            onNext={handleNext}
                                            disabled={completedSteps.includes(3)}
                                        />
                                    )}
                                    {step === 3 && userType === 'company' && (
                                        <TeamMembers
                                            onNext={handleNext}
                                            disabled={!completedSteps.includes(3)}
                                        />
                                    )}
                                    {((step === 3 && userType === 'individual') || (step === 4 && userType === 'company')) && (
                                        <MobileVerification
                                            disabled={!completedSteps.includes(3)}
                                            onCompleted={handleComplete}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
