import mockCategories from '../mockData/categories.json';
import taskService from './taskService';

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulates database)
let categories = [...mockCategories];

const categoryService = {
  // Get all categories with task counts
  async getAll() {
    await delay(200);
    const tasks = await taskService.getAll();
    
    return categories.map(category => ({
      ...category,
      taskCount: tasks.filter(t => t.categoryId === category.id && !t.completed).length
    }));
  },

  // Get category by ID
  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  },

  // Create new category
  async create(categoryData) {
    await delay(250);
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  // Update category
  async update(id, updatedData) {
    await delay(200);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories[index] = {
      ...categories[index],
      ...updatedData,
      id // Ensure ID doesn't change
    };
    
    return { ...categories[index] };
  },

  // Delete category
  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories.splice(index, 1);
    return true;
  }
};

export default categoryService;