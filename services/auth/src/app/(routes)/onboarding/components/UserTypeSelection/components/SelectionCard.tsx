import { Card } from 'nextuiq';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import { TypeIcon } from './TypeIcon';
import { FeatureList } from './FeatureList';
import { Feature } from '../../types';

interface SelectionCardProps {
    type: 'individual' | 'company';
    isSelected: boolean;
    features: Feature[];
    onClick: () => void;
    isSubmitting?: boolean;
}

export function SelectionCard({ type, isSelected, features, onClick, isSubmitting }: SelectionCardProps) {
    return (
        <motion.div
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: isSelected ? 1.05 : 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            <Card 
                onClick={onClick}
                className={`group relative p-6 cursor-pointer transition-all duration-500 
                    rounded-2xl backdrop-blur-lg shadow-lg border border-transparent min-h-[280px]
                    ${isSelected ? 
                        'border-[oklch(var(--theme-primary))] ring-4 ring-[oklch(var(--theme-primary)/0.4)] shadow-xl bg-gradient-to-br from-[oklch(var(--theme-primary)/0.1)] to-transparent' 
                        : 'hover:border-[oklch(var(--theme-primary)/0.3)] bg-[rgba(255,255,255,0.07)]'
                    }`}
            >
                <div className="relative space-y-6 flex flex-col justify-between h-full">
                    <TypeIcon type={type} isSelected={isSelected} />

                    <div className="text-center">
                        <h3 className="text-lg font-bold mb-1 text-[oklch(var(--theme-foreground))]">
                            {type === 'individual' ? 'Personal Cloud' : 'Enterprise Cloud'}
                        </h3>
                        <p className="text-xs text-[oklch(var(--theme-muted-foreground))]">
                            {type === 'individual' 
                                ? 'A secure and intuitive cloud experience for individual users.'
                                : 'A powerful cloud ecosystem with advanced team and security features.'
                            }
                        </p>
                    </div>

                    <FeatureList features={features} isSelected={isSelected} />

                    <div className={`flex items-center gap-2 font-medium transition-all duration-300 text-sm
                        ${isSelected 
                            ? 'text-[oklch(var(--theme-primary))] scale-105' 
                            : 'text-[oklch(var(--theme-muted-foreground))]'
                        }`}>
                        {isSubmitting && (
                            <div className="animate-spin w-4 h-4 border-b-2 border-[oklch(var(--theme-primary))] rounded-full"></div>
                        )}
                        {isSelected ? "✓ Selected" : "Select Plan"}
                        <FiChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'transform translate-x-1' : ''}`} />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}