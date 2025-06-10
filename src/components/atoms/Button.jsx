import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', whileHover, whileTap, icon: Icon, iconSize, iconClassName, ...props }) => {
    const hasMotionProps = whileHover || whileTap;
    const Component = hasMotionProps ? motion.button : 'button';

    // Filter out all Framer Motion props and custom props
    const motionProps = ['whileHover', 'whileTap', 'initial', 'animate', 'exit', 'variants', 'transition', 'drag', 'dragConstraints', 'whileDrag', 'layout', 'layoutId'];
    const customProps = ['icon', 'iconSize', 'iconClassName'];
    const propsToFilter = [...motionProps, ...customProps];
    
    const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (!propsToFilter.includes(key)) {
            acc[key] = props[key];
        }
        return acc;
    }, {});

    // Only add motion props if using motion.button
    const componentProps = hasMotionProps 
        ? { whileHover, whileTap, ...filteredProps }
        : filteredProps;

    return (
        <Component
            className={className}
            onClick={onClick}
            type={type}
            {...componentProps}
        >
            {Icon && <Icon size={iconSize} className={iconClassName} />}
            {children}
        </Component>
    );
};

export default Button;