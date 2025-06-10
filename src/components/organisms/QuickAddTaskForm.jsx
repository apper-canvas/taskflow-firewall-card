import React, { useRef, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const QuickAddTaskForm = ({ show, onToggleShow, onAddTask, className = '', ...props }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus();
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTask(e);
    };

    const handleInputBlur = () => {
        // Only hide if input is empty, otherwise allow form submission
        if (!inputRef.current.value.trim()) {
            onToggleShow(false);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Escape') {
            onToggleShow(false);
        }
    };

    return (
        <div className={className} {...props}>
            {show ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        innerRef={inputRef}
                        name="title"
                        type="text"
                        placeholder="What needs to be done?"
                        className="px-3 py-2"
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                    />
                    <div className="flex space-x-2">
                        <Button
                            type="submit"
                            className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                            Add Task
                        </Button>
                        <Button
                            type="button"
                            onClick={() => onToggleShow(false)}
                            className="px-3 py-2 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
                            icon={ApperIcon}
                            iconName="X"
                            iconSize={14}
                        />
                    </div>
                </form>
            ) : (
                <Button
                    onClick={() => onToggleShow(true)}
                    className="w-full py-3 border-2 border-dashed border-surface-300 rounded-lg text-surface-600 hover:border-primary hover:text-primary transition-colors flex items-center justify-center space-x-2"
                    icon={ApperIcon}
                    iconName="Plus"
                    iconSize={16}
                >
                    <span>Quick Add Task</span>
                </Button>
            )}
        </div>
    );
};

export default QuickAddTaskForm;