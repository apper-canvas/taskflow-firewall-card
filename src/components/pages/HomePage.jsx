import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { isToday, isPast } from 'date-fns';

import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

import TaskDashboardLayout from '@/components/organisms/TaskDashboardLayout';
import SidebarStats from '@/components/organisms/SidebarStats';
import SearchInput from '@/components/molecules/SearchInput';
import QuickAddTaskForm from '@/components/organisms/QuickAddTaskForm';
import TaskFilters from '@/components/organisms/TaskFilters';
import TaskList from '@/components/organisms/TaskList';
import Modal from '@/components/molecules/Modal';
import TaskForm from '@/components/organisms/TaskForm';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';


function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [showCompleted, setShowCompleted] = useState(false);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showTaskFormModal, setShowTaskFormModal] = useState(false); // For detailed task form
    const [editingTask, setEditingTask] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);

    // Load data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [tasksData, categoriesData] = await Promise.all([
                    taskService.getAll(),
                    categoryService.getAll()
                ]);
                setTasks(tasksData);
                setCategories(categoriesData);
            } catch (err) {
                setError(err.message || 'Failed to load data');
                toast.error('Failed to load tasks and categories');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (!showCompleted && task.completed) return false;
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) return false;
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
        return true;
    });

    // Group tasks
    const todayTasks = filteredTasks.filter(task => task.dueDate && isToday(new Date(task.dueDate)));
    const overdueTasks = filteredTasks.filter(task =>
        task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
    );
    const otherTasks = filteredTasks.filter(task =>
        !task.dueDate || (!isToday(new Date(task.dueDate)) && !isPast(new Date(task.dueDate)))
    );

    // Task actions
    const handleToggleComplete = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const updatedTask = {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null
        };

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

        try {
            await taskService.update(taskId, updatedTask);
            if (updatedTask.completed) {
                toast.success('Task completed! 🎉');
            }
        } catch (err) {
            // Rollback on error
            setTasks(prev => prev.map(t => t.id === taskId ? task : t));
            toast.error('Failed to update task');
        }
    };

    const handleQuickAdd = async (e) => {
        const title = e.target.title.value.trim();
        if (!title) return;

        const newTask = {
            title,
            completed: false,
            priority: 'medium',
            dueDate: null,
            categoryId: categories[0]?.id || null,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        try {
            const createdTask = await taskService.create(newTask);
            setTasks(prev => [createdTask, ...prev]);
            setShowQuickAdd(false);
            e.target.reset(); // Reset form field
            toast.success('Task added!');
        } catch (err) {
            toast.error('Failed to add task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskService.delete(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            toast.success('Task deleted');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    // Drag and drop
    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, targetCategory) => {
        e.preventDefault();
        if (!draggedTask || draggedTask.categoryId === targetCategory) {
            setDraggedTask(null);
            return;
        }

        const originalTask = draggedTask;
        const updatedTask = { ...draggedTask, categoryId: targetCategory };

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === draggedTask.id ? updatedTask : t));

        try {
            await taskService.update(draggedTask.id, updatedTask);
            toast.success('Task moved!');
        } catch (err) {
            // Rollback
            setTasks(prev => prev.map(t => t.id === originalTask.id ? originalTask : t));
            toast.error('Failed to move task');
        }

        setDraggedTask(null);
    };

    const getTaskCounts = () => {
        const total = tasks.filter(t => !t.completed).length;
        const today = todayTasks.filter(t => !t.completed).length;
        const overdue = overdueTasks.length;
        return { total, today, overdue };
    };

    const counts = getTaskCounts();

    const handleOpenTaskForm = (task = null) => {
        setEditingTask(task);
        setShowTaskFormModal(true);
    };

    const handleCloseTaskForm = () => {
        setEditingTask(null);
        setShowTaskFormModal(false);
    };

    const handleSaveTask = async (formData) => {
        const taskData = {
            title: formData.title.trim(),
            priority: formData.priority,
            dueDate: formData.dueDate || null,
            categoryId: formData.categoryId || categories[0]?.id,
            completed: editingTask?.completed || false, // Preserve completed status if editing
            createdAt: editingTask?.createdAt || new Date().toISOString(),
            completedAt: editingTask?.completedAt || null
        };

        try {
            if (editingTask) {
                const updatedTask = await taskService.update(editingTask.id, { ...editingTask, ...taskData });
                setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
                toast.success('Task updated!');
            } else {
                const newTask = await taskService.create(taskData);
                setTasks(prev => [newTask, ...prev]);
                toast.success('Task created!');
            }
            handleCloseTaskForm();
        } catch (err) {
            toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
        }
    };


    const sidebarContent = (
        <>
            <SidebarStats counts={counts} />
            <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
            />
            <QuickAddTaskForm
                show={showQuickAdd}
                onToggleShow={setShowQuickAdd}
                onAddTask={handleQuickAdd}
            />
            <TaskFilters
                selectedPriority={selectedPriority}
                setSelectedPriority={setSelectedPriority}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                showCompleted={showCompleted}
                setShowCompleted={setShowCompleted}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                draggedTask={draggedTask}
            />
             <Button
                onClick={() => handleOpenTaskForm()}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 mt-6"
                icon={ApperIcon}
                iconName="Plus"
                iconSize={16}
            >
                Add New Task (Detailed)
            </Button>
        </>
    );

    const mainHeader = (
        <>
            <div>
                <Text as="h2" className="text-2xl font-heading font-bold text-surface-900">
                    {selectedCategory === 'all' ? 'All Tasks' : categories.find(c => c.id === selectedCategory)?.name}
                </Text>
                <Text as="p" className="text-surface-600">
                    {filteredTasks.length} tasks {searchQuery && `matching "${searchQuery}"`}
                </Text>
            </div>
        </>
    );

    const mainContent = (
        <TaskList
            overdueTasks={overdueTasks}
            todayTasks={todayTasks}
            otherTasks={otherTasks}
            filteredTasks={filteredTasks}
            searchQuery={searchQuery}
            categories={categories}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onDragStart={handleDragStart}
            draggedTask={draggedTask}
            onQuickAddClick={() => setShowQuickAdd(true)} // Re-use quick add logic for empty state
        />
    );


    return (
        <TaskDashboardLayout
            sidebarContent={sidebarContent}
            mainHeader={mainHeader}
            mainContent={mainContent}
            loading={loading}
            error={error}
        >
            <Modal show={showTaskFormModal} onClose={handleCloseTaskForm}>
                <TaskForm
                    editingTask={editingTask}
                    categories={categories}
                    onSave={handleSaveTask}
                    onCancel={handleCloseTaskForm}
                />
            </Modal>
        </TaskDashboardLayout>
    );
}

export default HomePage;