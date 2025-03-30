import { motion } from 'framer-motion';
import { FiUser, FiUsers } from 'react-icons/fi';

interface TypeIconProps {
    type: 'individual' | 'company';
    isSelected: boolean;
}

export function TypeIcon({ type, isSelected }: TypeIconProps) {
    return (
        <motion.div
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-md mx-auto
                ${isSelected ? 
                    'bg-[oklch(var(--theme-primary))] scale-110' 
                    : 'bg-[oklch(var(--theme-primary))] group-hover:scale-105'
                }`}
            animate={{ rotate: isSelected ? 6 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {type === 'individual' ? 
                <FiUser className="w-8 h-8 text-white" /> : 
                <FiUsers className="w-8 h-8 text-white" />
            }
        </motion.div>
    );
}