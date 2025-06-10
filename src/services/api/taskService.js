// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const taskService = {
  // Get all tasks
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "completed", "priority", "due_date", "category_id", "created_at", "completed_at"],
        orderBy: [
          {
            fieldName: "created_at",
            SortType: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const transformedTasks = response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title || task.Name,
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        categoryId: task.category_id?.toString() || null,
        createdAt: task.created_at || task.CreatedOn,
        completedAt: task.completed_at || null
      }));

      return transformedTasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  // Get task by ID
  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "completed", "priority", "due_date", "category_id", "created_at", "completed_at"]
      };

      const response = await apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Task not found');
      }

      // Transform database response to match UI expectations
      const task = response.data;
      return {
        id: task.Id.toString(),
        title: task.title || task.Name,
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        categoryId: task.category_id?.toString() || null,
        createdAt: task.created_at || task.CreatedOn,
        completedAt: task.completed_at || null
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new task
  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.title,
          title: taskData.title,
          completed: taskData.completed || false,
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate || null,
          category_id: taskData.categoryId ? parseInt(taskData.categoryId) : null,
          created_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task:${failedRecords}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          return {
            id: createdTask.Id.toString(),
            title: createdTask.title || createdTask.Name,
            completed: createdTask.completed || false,
            priority: createdTask.priority || 'medium',
            dueDate: createdTask.due_date || null,
            categoryId: createdTask.category_id?.toString() || null,
            createdAt: createdTask.created_at || createdTask.CreatedOn,
            completedAt: createdTask.completed_at || null
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  // Update task
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

      if (updatedData.title !== undefined) {
        updateFields.Name = updatedData.title;
        updateFields.title = updatedData.title;
      }
      if (updatedData.completed !== undefined) {
        updateFields.completed = updatedData.completed;
      }
      if (updatedData.priority !== undefined) {
        updateFields.priority = updatedData.priority;
      }
      if (updatedData.dueDate !== undefined) {
        updateFields.due_date = updatedData.dueDate;
      }
      if (updatedData.categoryId !== undefined) {
        updateFields.category_id = updatedData.categoryId ? parseInt(updatedData.categoryId) : null;
      }
      if (updatedData.completedAt !== undefined) {
        updateFields.completed_at = updatedData.completedAt;
      }

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            id: updatedTask.Id.toString(),
            title: updatedTask.title || updatedTask.Name,
            completed: updatedTask.completed || false,
            priority: updatedTask.priority || 'medium',
            dueDate: updatedTask.due_date || null,
            categoryId: updatedTask.category_id?.toString() || null,
            createdAt: updatedTask.created_at || updatedTask.CreatedOn,
            completedAt: updatedTask.completed_at || null
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete task
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

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  },

  // Get tasks by category
  async getByCategory(categoryId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "completed", "priority", "due_date", "category_id", "created_at", "completed_at"],
        where: [
          {
            fieldName: "category_id",
            operator: "ExactMatch",
            values: [parseInt(categoryId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const transformedTasks = response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title || task.Name,
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        categoryId: task.category_id?.toString() || null,
        createdAt: task.created_at || task.CreatedOn,
        completedAt: task.completed_at || null
      }));

      return transformedTasks;
    } catch (error) {
      console.error(`Error fetching tasks for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get tasks by priority
  async getByPriority(priority) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "completed", "priority", "due_date", "category_id", "created_at", "completed_at"],
        where: [
          {
            fieldName: "priority",
            operator: "ExactMatch",
            values: [priority]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const transformedTasks = response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title || task.Name,
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        categoryId: task.category_id?.toString() || null,
        createdAt: task.created_at || task.CreatedOn,
        completedAt: task.completed_at || null
      }));

      return transformedTasks;
    } catch (error) {
      console.error(`Error fetching tasks for priority ${priority}:`, error);
      throw error;
    }
  },

  // Toggle task completion
  async toggleComplete(id) {
    try {
      // First get the current task
      const task = await this.getById(id);
      
      // Update with toggled completion status
      const updatedTask = {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      };
      
      return await this.update(id, updatedTask);
    } catch (error) {
      console.error(`Error toggling task completion for ID ${id}:`, error);
      throw error;
    }
  }
};

export default taskService;