import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast, isValid } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import taskService from '../services/api/taskService';
import categoryService from '../services/api/categoryService';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const quickAddRef = useRef(null);

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
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Quick add focus
  useEffect(() => {
    if (showQuickAdd && quickAddRef.current) {
      quickAddRef.current.focus();
    }
  }, [showQuickAdd]);

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
    e.preventDefault();
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
      e.target.reset();
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

    const updatedTask = { ...draggedTask, categoryId: targetCategory };
    
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === draggedTask.id ? updatedTask : t));

    try {
      await taskService.update(draggedTask.id, updatedTask);
      toast.success('Task moved!');
    } catch (err) {
      // Rollback
      setTasks(prev => prev.map(t => t.id === draggedTask.id ? draggedTask : t));
      toast.error('Failed to move task');
    }

    setDraggedTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-high text-white';
      case 'medium': return 'bg-medium text-white';
      case 'low': return 'bg-low text-white';
      default: return 'bg-surface-300 text-surface-700';
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#64748b';
  };

  const getTaskCounts = () => {
    const total = tasks.filter(t => !t.completed).length;
    const today = todayTasks.filter(t => !t.completed).length;
    const overdue = overdueTasks.length;
    return { total, today, overdue };
  };

  const counts = getTaskCounts();

  if (loading) {
    return (
      <div className="h-full flex">
        {/* Sidebar skeleton */}
        <div className="w-80 bg-white border-r border-surface-200 p-6">
          <div className="space-y-6">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-10 bg-surface-200 rounded-lg"></div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-surface-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="animate-pulse"
              >
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex max-w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-surface-200 flex-shrink-0 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
              <div>
                <div className="text-2xl font-bold">{counts.total}</div>
                <div className="text-sm opacity-90">Active Tasks</div>
              </div>
              <ApperIcon name="Target" size={24} />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-info/10 rounded-lg">
                <div className="text-lg font-semibold text-info">{counts.today}</div>
                <div className="text-xs text-surface-600">Due Today</div>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <div className="text-lg font-semibold text-accent">{counts.overdue}</div>
                <div className="text-xs text-surface-600">Overdue</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Quick Add */}
          <div>
            {showQuickAdd ? (
              <form onSubmit={handleQuickAdd} className="space-y-3">
                <input
                  ref={quickAddRef}
                  name="title"
                  type="text"
                  placeholder="What needs to be done?"
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onBlur={() => setShowQuickAdd(false)}
                  onKeyDown={(e) => e.key === 'Escape' && setShowQuickAdd(false)}
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(false)}
                    className="px-3 py-2 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    <ApperIcon name="X" size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowQuickAdd(true)}
                className="w-full py-3 border-2 border-dashed border-surface-300 rounded-lg text-surface-600 hover:border-primary hover:text-primary transition-colors flex items-center justify-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Quick Add Task</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-surface-700 mb-2">Filter by Priority</h3>
              <div className="space-y-1">
                {['all', 'high', 'medium', 'low'].map(priority => (
                  <button
                    key={priority}
                    onClick={() => setSelectedPriority(priority)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors capitalize ${
                      selectedPriority === priority 
                        ? 'bg-primary text-white' 
                        : 'text-surface-700 hover:bg-surface-100'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-surface-700 mb-2">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-primary text-white' 
                      : 'text-surface-700 hover:bg-surface-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
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
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-700">Show Completed</span>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  showCompleted ? 'bg-primary' : 'bg-surface-300'
                } relative`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  showCompleted ? 'translate-x-6' : 'translate-x-0.5'
                } absolute top-0.5`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 min-w-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-surface-900">
                {selectedCategory === 'all' ? 'All Tasks' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-surface-600">
                {filteredTasks.length} tasks {searchQuery && `matching "${searchQuery}"`}
              </p>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-6">
            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-3 flex items-center">
                  <ApperIcon name="AlertTriangle" size={20} className="mr-2" />
                  Overdue ({overdueTasks.length})
                </h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {overdueTasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        category={categories.find(c => c.id === task.categoryId)}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onDragStart={handleDragStart}
                        isDragging={draggedTask?.id === task.id}
                        isOverdue={true}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Today's Tasks */}
            {todayTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-info mb-3 flex items-center">
                  <ApperIcon name="Calendar" size={20} className="mr-2" />
                  Due Today ({todayTasks.length})
                </h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {todayTasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        category={categories.find(c => c.id === task.categoryId)}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onDragStart={handleDragStart}
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Other Tasks */}
            {otherTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-surface-700 mb-3 flex items-center">
                  <ApperIcon name="List" size={20} className="mr-2" />
                  Other Tasks ({otherTasks.length})
                </h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {otherTasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        category={categories.find(c => c.id === task.categoryId)}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onDragStart={handleDragStart}
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Empty State */}
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
                <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
                  {searchQuery ? 'No matching tasks' : 'All caught up!'}
                </h3>
                <p className="text-surface-600 mb-4">
                  {searchQuery 
                    ? `Try adjusting your search or filters` 
                    : 'Time to add some new tasks and stay productive'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowQuickAdd(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Your First Task
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({ task, index, category, onToggleComplete, onDelete, onDragStart, isDragging, isOverdue = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = async (e) => {
    e.preventDefault();
    if (editTitle.trim() === task.title || !editTitle.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      await taskService.update(task.id, { ...task, title: editTitle.trim() });
      setIsEditing(false);
      toast.success('Task updated!');
    } catch (err) {
      toast.error('Failed to update task');
      setEditTitle(task.title);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-high';
      case 'medium': return 'bg-medium';
      case 'low': return 'bg-low';
      default: return 'bg-surface-300';
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
      className={`bg-white rounded-xl p-4 shadow-sm border border-surface-200 hover:shadow-md transition-all hover:scale-[1.01] ${
        task.completed ? 'task-completed' : ''
      } ${isOverdue ? 'border-l-4 border-l-accent' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => {}}
            className="task-checkbox"
          />
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <form onSubmit={handleEdit} className="mb-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="w-full px-2 py-1 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
            </form>
          ) : (
            <h4 
              className={`font-medium mb-2 cursor-pointer break-words ${
                task.completed ? 'line-through text-surface-500' : 'text-surface-900'
              }`}
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h4>
          )}

          {/* Meta info */}
          <div className="flex items-center space-x-3 text-sm">
            {/* Priority */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
              getPriorityColor(task.priority)
            } ${isOverdue && !task.completed ? 'priority-pulse' : ''}`}>
              {task.priority}
            </div>

            {/* Category */}
            {category && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-surface-600">{category.name}</span>
              </div>
            )}

            {/* Due date */}
            {task.dueDate && isValid(new Date(task.dueDate)) && (
              <div className={`flex items-center space-x-1 ${
                isOverdue && !task.completed ? 'text-accent font-medium' : 'text-surface-600'
              }`}>
                <ApperIcon name="Calendar" size={12} />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="p-1 text-surface-400 hover:text-error rounded"
          >
            <ApperIcon name="Trash2" size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;