import React from 'react';
import Text from '@/components/atoms/Text';

const PriorityTag = ({ priority, isOverdue = false, completed = false, className = '', ...props }) => {
    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'bg-high text-white';
            case 'medium': return 'bg-medium text-white';
            case 'low': return 'bg-low text-white';
            default: return 'bg-surface-300 text-surface-700';
        }
    };

    return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)} ${isOverdue && !completed ? 'priority-pulse' : ''} ${className}`} {...props}>
            <Text as="span">{priority}</Text>
        </div>
    );
};

export default PriorityTag;