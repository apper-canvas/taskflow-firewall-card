import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', onBlur, onKeyDown, name, autoFocus, ...props }) => {
    const filteredProps = { ...props };
    // Filter out any non-standard HTML props if needed, e.g., `ref` might be passed as `innerRef`
    delete filteredProps.innerRef; // Example of a custom prop that might be passed and needs filtering

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            name={name}
            autoFocus={autoFocus}
            ref={props.innerRef} // Use innerRef if passed, assuming it's a ref
            {...filteredProps}
        />
    );
};

export default Input;