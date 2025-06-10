import React from 'react';
import Button from '@/components/atoms/Button';

const ToggleSwitch = ({ checked, onChange, label, className = '', ...props }) => {
    return (
        <div className={`flex items-center justify-between ${className}`} {...props}>
            <span className="text-sm text-surface-700">{label}</span>
            <Button
                onClick={onChange}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                    checked ? 'bg-primary' : 'bg-surface-300'
                }`}
            >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 ${
                    checked ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
            </Button>
        </div>
    );
};

export default ToggleSwitch;