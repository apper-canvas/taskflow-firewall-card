import React from 'react';
import Button from '@/components/atoms/Button';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const TaskFilters = ({
    selectedPriority,
    setSelectedPriority,
    selectedCategory,
    setSelectedCategory,
    categories,
    showCompleted,
    setShowCompleted,
    handleDragOver,
    handleDrop,
    draggedTask,
    className = '',
    ...props
}) => {
    return (
        <div className={`space-y-4 ${className}`} {...props}>
            <div>
                <Text as="h3" className="text-sm font-medium text-surface-700 mb-2">Filter by Priority</Text>
                <div className="space-y-1">
                    {['all', 'high', 'medium', 'low'].map(priority => (
                        <Button
                            key={priority}
                            onClick={() => setSelectedPriority(priority)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors capitalize ${
                                selectedPriority === priority
                                    ? 'bg-primary text-white'
                                    : 'text-surface-700 hover:bg-surface-100'
                            }`}
                        >
                            {priority}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <Text as="h3" className="text-sm font-medium text-surface-700 mb-2">Categories</Text>
                <div className="space-y-1">
                    <Button
                        onClick={() => setSelectedCategory('all')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === 'all'
                                ? 'bg-primary text-white'
                                : 'text-surface-700 hover:bg-surface-100'
                        }`}
                    >
                        All Categories
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, category.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                                selectedCategory === category.id
                                    ? 'bg-primary text-white'
                                    : 'text-surface-700 hover:bg-surface-100'
                            } ${draggedTask ? 'border-2 border-dashed border-primary/50' : ''}`}
                        >
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="min-w-0 flex-1">{category.name}</span>
                            <span className="text-xs opacity-75">{category.taskCount}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <ToggleSwitch
                label="Show Completed"
                checked={showCompleted}
                onChange={() => setShowCompleted(!showCompleted)}
            />
        </div>
    );
};

export default TaskFilters;