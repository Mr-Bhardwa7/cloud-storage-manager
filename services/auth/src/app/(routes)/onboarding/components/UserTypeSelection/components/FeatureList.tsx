import { motion } from 'framer-motion';
import { Feature } from '../../types';

interface FeatureListProps {
    features: Feature[];
    isSelected: boolean;
}

export function FeatureList({ features, isSelected }: FeatureListProps) {
    return (
        <div className="space-y-2">
            {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-[oklch(var(--theme-foreground))]">
                    <motion.span 
                        className={`text-[oklch(var(--theme-primary))] transition-transform ${isSelected ? 'scale-110' : ''}`}
                        animate={{ scale: isSelected ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {feature.icon}
                    </motion.span>
                    {feature.text}
                </div>
            ))}
        </div>
    );
}