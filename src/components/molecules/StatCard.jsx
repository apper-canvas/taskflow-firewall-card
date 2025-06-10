import React from 'react';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ title, value, description, iconName, className = '', ...props }) => {
    return (
        <div className={`p-3 rounded-lg ${className}`} {...props}>
            {iconName ? (
                <div className="flex items-center justify-between">
                    <div>
                        <Text as="div" className="text-2xl font-bold">{value}</Text>
                        <Text as="div" className="text-sm opacity-90">{description}</Text>
                    </div>
                    <ApperIcon name={iconName} size={24} />
                </div>
            ) : (
                <>
                    <Text as="div" className="text-lg font-semibold">{value}</Text>
                    <Text as="div" className="text-xs text-surface-600">{description}</Text>
                </>
            )}
        </div>
    );
};

export default StatCard;