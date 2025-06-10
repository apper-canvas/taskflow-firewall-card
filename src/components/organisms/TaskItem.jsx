import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Checkbox from '@/components/atoms/Checkbox';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';
import PriorityTag from '@/components/molecules/PriorityTag';
import CategoryTag from '@/components/molecules/CategoryTag';
import DueDateDisplay from '@/components/molecules/DueDateDisplay';
import ActionButtons from '@/components/molecules/ActionButtons';
import taskService from '@/services/api/taskService'; // Keep service import here as it directly uses it

const TaskItem = ({
    task,
    index,
    category,
    onToggleComplete,
    onDelete,
    onDragStart,
    isDragging,
    isOverdue = false,
    className = '',
    ...props
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    const handleEditTitle = async (e) => {
        e.preventDefault();
        if (editTitle.trim() === task.title || !editTitle.trim()) {
            setIsEditing(false);
            return;
        }

        try {
            await taskService.update(task.id, { ...task, title: editTitle.trim() });
            setIsEditing(false);
            // This toast is redundant if parent component re-fetches or updates state
            // For now, keeping it as it was in original TaskCard
            toast.success('Task title updated!');
        } catch (err) {
            toast.error('Failed to update task title');
            setEditTitle(task.title); // Rollback
        }
    };

    const handleFocusOut = () => {
        handleEditTitle({ preventDefault: () => {} }); // Simulate form submit on blur
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditTitle(task.title); // Revert on escape
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: isDragging ? 0.5 : 1,
                y: 0,
                rotate: isDragging ? 2 : 0
            }}
            exit={{ opacity: 0, x: task.completed ? 20 : -20, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-xl p-4 shadow-sm border border-surface-200 hover:shadow-md transition-all hover:scale-[1.01] group ${
                task.completed ? 'task-completed' : ''
            } ${isOverdue ? 'border-l-4 border-l-accent' : ''} ${className}`}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            {...props}
        >
            <div className="flex items-start space-x-3">
                <Checkbox
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                    className="mt-1"
                />

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <form onSubmit={handleEditTitle} className="mb-2">
                            <Input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={handleFocusOut}
                                onKeyDown={handleKeyDown}
                                className="px-2 py-1 border border-primary rounded focus:ring-2 focus:ring-primary/50"
                                autoFocus
                            />
                        </form>
                    ) : (
                        <Text
                            as="h4"
                            className={`font-medium mb-2 cursor-pointer break-words ${
                                task.completed ? 'line-through text-surface-500' : 'text-surface-900'
                            }`}
                            onClick={() => setIsEditing(true)}
                        >
                            {task.title}
                        </Text>
                    )}

                    <div className="flex items-center space-x-3 text-sm">
                        <PriorityTag priority={task.priority} isOverdue={isOverdue} completed={task.completed} />
                        <CategoryTag category={category} />
                        <DueDateDisplay dueDate={task.dueDate} isOverdue={isOverdue && !task.completed} />
                    </div>
                </div>

                <ActionButtons onEdit={() => setIsEditing(true)} onDelete={() => onDelete(task.id)} />
            </div>
        </motion.div>
    );
};

export default TaskItem;