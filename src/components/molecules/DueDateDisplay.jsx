import React from 'react';
import { format, isValid } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DueDateDisplay = ({ dueDate, isOverdue = false, className = '', ...props }) => {
    if (!dueDate || !isValid(new Date(dueDate))) return null;

    const formattedDate = format(new Date(dueDate), 'MMM d');
    const displayClass = isOverdue ? 'text-accent font-medium' : 'text-surface-600';

    return (
        <div className={`flex items-center space-x-1 ${displayClass} ${className}`} {...props}>
            <ApperIcon name="Calendar" size={12} />
            <Text as="span">{formattedDate}</Text>
        </div>
    );
};

export default DueDateDisplay;