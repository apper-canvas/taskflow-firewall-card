import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TaskItem from '@/components/organisms/TaskItem';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const TaskList = ({
    overdueTasks,
    todayTasks,
    otherTasks,
    filteredTasks,
    searchQuery,
    categories,
    onToggleComplete,
    onDelete,
    onDragStart,
    draggedTask,
    onQuickAddClick,
    className = '',
    ...props
}) => {
    const getCategory = (categoryId) => categories.find(c => c.id === categoryId);

    const renderTaskGroup = (title, iconName, tasks, titleClassName, isOverdueGroup = false) => {
        if (tasks.length === 0) return null;
        return (
            <div>
                <Text as="h3" className={`text-lg font-semibold mb-3 flex items-center ${titleClassName}`}>
                    <ApperIcon name={iconName} size={20} className="mr-2" />
                    {title} ({tasks.length})
                </Text>
                <div className="space-y-3">
                    <AnimatePresence>
                        {tasks.map((task, index) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                index={index}
                                category={getCategory(task.categoryId)}
                                onToggleComplete={onToggleComplete}
                                onDelete={onDelete}
                                onDragStart={onDragStart}
                                isDragging={draggedTask?.id === task.id}
                                isOverdue={isOverdueGroup}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    return (
        <div className={`space-y-6 ${className}`} {...props}>
            {renderTaskGroup('Overdue', 'AlertTriangle', overdueTasks, 'text-accent', true)}
            {renderTaskGroup('Due Today', 'Calendar', todayTasks, 'text-info')}
            {renderTaskGroup('Other Tasks', 'List', otherTasks, 'text-surface-700')}

            {filteredTasks.length === 0 && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        <ApperIcon name="CheckCircle2" className="w-16 h-16 text-success mx-auto mb-4" />
                    </motion.div>
                    <Text as="h3" className="text-xl font-heading font-semibold text-surface-900 mb-2">
                        {searchQuery ? 'No matching tasks' : 'All caught up!'}
                    </Text>
                    <Text as="p" className="text-surface-600 mb-4">
                        {searchQuery
                            ? `Try adjusting your search or filters`
                            : 'Time to add some new tasks and stay productive'
                        }
                    </Text>
                    {!searchQuery && (
                        <Button
                            onClick={onQuickAddClick}
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105"
                            icon={ApperIcon}
                            iconName="Plus"
                            iconSize={16}
                        >
                            Add Your First Task
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default TaskList;