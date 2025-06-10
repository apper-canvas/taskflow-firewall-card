import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ActionButtons = ({ onEdit, onDelete, className = '', ...props }) => {
    return (
        <div className={`flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${className}`} {...props}>
            {onEdit && (
                <Button
                    onClick={onEdit}
                    className="p-1 text-surface-400 hover:text-primary rounded"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    icon={ApperIcon}
                    iconName="Edit2"
                    iconSize={14}
                />
            )}
            {onDelete && (
                <Button
                    onClick={onDelete}
                    className="p-1 text-surface-400 hover:text-error rounded"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    icon={ApperIcon}
                    iconName="Trash2"
                    iconSize={14}
                />
            )}
        </div>
    );
};

export default ActionButtons;