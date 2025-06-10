// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const categoryService = {
  // Get all categories with task counts
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "color", "task_count"]
      };

      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Get task counts from tasks table
      const taskParams = {
        fields: ["category_id", "completed"],
        where: [
          {
            fieldName: "completed",
            operator: "ExactMatch",
            values: [false]
          }
        ]
      };

      const tasksResponse = await apperClient.fetchRecords('task', taskParams);
      let taskCounts = {};
      
      if (tasksResponse.success && tasksResponse.data) {
        tasksResponse.data.forEach(task => {
          const categoryId = task.category_id?.toString();
          if (categoryId) {
            taskCounts[categoryId] = (taskCounts[categoryId] || 0) + 1;
          }
        });
      }

      // Transform database response to match UI expectations
      const transformedCategories = response.data.map(category => ({
        id: category.Id.toString(),
        name: category.Name,
        color: category.color || '#5B4FE9',
        taskCount: taskCounts[category.Id.toString()] || 0
      }));

      return transformedCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get category by ID
  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "color", "task_count"]
      };

      const response = await apperClient.getRecordById('category', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Category not found');
      }

      // Transform database response to match UI expectations
      const category = response.data;
      return {
        id: category.Id.toString(),
        name: category.Name,
        color: category.color || '#5B4FE9',
        taskCount: category.task_count || 0
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new category
  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: categoryData.name,
          color: categoryData.color || '#5B4FE9',
          task_count: 0
        }]
      };

      const response = await apperClient.createRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create category:${failedRecords}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdCategory = successfulRecords[0].data;
          return {
            id: createdCategory.Id.toString(),
            name: createdCategory.Name,
            color: createdCategory.color || '#5B4FE9',
            taskCount: createdCategory.task_count || 0
          };
        }
      }
      
      throw new Error('Failed to create category');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category
  async update(id, updatedData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateFields = {
        Id: parseInt(id)
      };

      if (updatedData.name !== undefined) {
        updateFields.Name = updatedData.name;
      }
      if (updatedData.color !== undefined) {
        updateFields.color = updatedData.color;
      }
      if (updatedData.taskCount !== undefined) {
        updateFields.task_count = updatedData.taskCount;
      }

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update category:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedCategory = successfulUpdates[0].data;
          return {
            id: updatedCategory.Id.toString(),
            name: updatedCategory.Name,
            color: updatedCategory.color || '#5B4FE9',
            taskCount: updatedCategory.task_count || 0
          };
        }
      }
      
      throw new Error('Failed to update category');
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete category
  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete category:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }
};

export default categoryService;