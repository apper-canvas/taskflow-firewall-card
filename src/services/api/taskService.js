import mockTasks from '../mockData/tasks.json';

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulates database)
let tasks = [...mockTasks];

const taskService = {
  // Get all tasks
  async getAll() {
    await delay(300);
    return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get task by ID
  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  // Create new task
  async create(taskData) {
    await delay(250);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.unshift(newTask);
    return { ...newTask };
  },

  // Update task
  async update(id, updatedData) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks[index] = {
      ...tasks[index],
      ...updatedData,
      id // Ensure ID doesn't change
    };
    
    return { ...tasks[index] };
  },

  // Delete task
  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks.splice(index, 1);
    return true;
  },

  // Get tasks by category
  async getByCategory(categoryId) {
    await delay(250);
    return tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  },

  // Get tasks by priority
  async getByPriority(priority) {
    await delay(250);
    return tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  },

  // Toggle task completion
  async toggleComplete(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    };
    
    return this.update(id, updatedTask);
  }
};

export default taskService;