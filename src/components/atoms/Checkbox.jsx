import React from 'react';
import { motion } from 'framer-motion';

const Checkbox = ({ checked, onChange, className = '', ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onChange}
            className={`flex-shrink-0 ${className}`}
            {...props}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={() => {}} // Controlled by button click
                className="task-checkbox"
            />
        </motion.button>
    );
};

export default Checkbox;