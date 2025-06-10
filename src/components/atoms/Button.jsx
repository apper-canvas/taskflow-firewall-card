import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', whileHover, whileTap, icon: Icon, iconSize, iconClassName, ...props }) => {
    const Component = whileHover || whileTap ? motion.button : 'button';

    const filteredProps = { ...props };
    delete filteredProps.icon;
    delete filteredProps.iconSize;
    delete filteredProps.iconClassName;

    return (
        <Component
            className={className}
            onClick={onClick}
            type={type}
            whileHover={whileHover}
            whileTap={whileTap}
            {...filteredProps}
        >
            {Icon && <Icon size={iconSize} className={iconClassName} />}
            {children}
        </Component>
    );
};

export default Button;