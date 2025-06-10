import React, { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { format } from 'date-fns';

const TaskForm = ({
    editingTask,
    categories,
    onSave,
    onCancel,
    className = '',
    ...props
}) => {
    const [formData, setFormData] = useState({
        title: '',
        priority: 'medium',
        dueDate: '',
        categoryId: categories[0]?.id || ''
    });

    useEffect(() => {
        if (editingTask) {
            setFormData({
                title: editingTask.title,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate ? format(new Date(editingTask.dueDate), 'yyyy-MM-dd') : '',
                categoryId: editingTask.categoryId || categories[0]?.id || ''
            });
        } else {
            setFormData({
                title: '',
                priority: 'medium',
                dueDate: '',
                categoryId: categories[0]?.id || ''
            });
        }
    }, [editingTask, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name
    }));

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} {...props}>
            <Text as="h3" className="text-lg font-heading font-semibold mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
            </Text>

            <FormField
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
                autoFocus
            />

            <FormField
                label="Priority"
                type="select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={priorityOptions}
            />

            <FormField
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
            />

            <FormField
                label="Category"
                type="select"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                options={categoryOptions}
            />

            <div className="flex space-x-3 pt-4">
                <Button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
                <Button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default TaskForm;