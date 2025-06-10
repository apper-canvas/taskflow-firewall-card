import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ label, type = 'text', value, onChange, placeholder, options, className = '', inputRef, ...props }) => {
    const id = React.useId();

    const renderInput = () => {
        if (type === 'select') {
            return (
                <Select
                    id={id}
                    value={value}
                    onChange={onChange}
                    options={options}
                    {...props}
                />
            );
        } else {
            return (
                <Input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    innerRef={inputRef}
                    {...props}
                />
            );
        }
    };

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1">
                {label}
            </label>
            {renderInput()}
        </div>
    );
};

export default FormField;