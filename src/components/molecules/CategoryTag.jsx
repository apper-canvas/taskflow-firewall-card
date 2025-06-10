import React from 'react';
import Text from '@/components/atoms/Text';

const CategoryTag = ({ category, className = '', ...props }) => {
    if (!category) return null;

    return (
        <div className={`flex items-center space-x-1 ${className}`} {...props}>
            <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color || '#64748b' }}
            ></div>
            <Text as="span" className="text-surface-600">{category.name}</Text>
        </div>
    );
};

export default CategoryTag;