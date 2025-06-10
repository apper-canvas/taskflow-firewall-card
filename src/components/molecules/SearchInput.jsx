import React from 'react';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '', ...props }) => {
    return (
        <div className={`relative ${className}`} {...props}>
            <ApperIcon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="pl-10 pr-4 py-2"
            />
        </div>
    );
};

export default SearchInput;