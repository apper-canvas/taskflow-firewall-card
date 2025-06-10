import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ show, onClose, children, className = '', ...props }) => {
    return (
        <AnimatePresence>
            {show && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        {...props}
                    >
                        <div className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 ${className}`}>
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;