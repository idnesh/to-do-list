import { Task, TaskFormData, ApiResponse } from '@/types';
import { generateId } from '@/utils';
import { API_DELAYS, STORAGE_KEYS } from '@/constants';

class MockApiService {
  private readonly delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  private loadTasksFromStorage(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) {
        const tasks = JSON.parse(stored);
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
      }
    } catch (error) {
      console.error('Failed to load tasks from storage:', error);
    }
    return this.getInitialTasks();
  }

  private saveTasksToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to storage:', error);
    }
  }

  private getInitialTasks(): Task[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: generateId(),
        title: 'Welcome to your Todo App!',
        description: 'This is a sample task to get you started. You can edit, delete, or mark it as complete.',
        status: 'pending',
        priority: 'medium',
        dueDate: tomorrow,
        createdAt: now,
        updatedAt: now,
        tags: ['welcome', 'sample'],
      },
      {
        id: generateId(),
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the new feature implementation.',
        status: 'in_progress',
        priority: 'high',
        dueDate: nextWeek,
        createdAt: new Date(now.getTime() - 86400000), // Yesterday
        updatedAt: now,
        tags: ['work', 'documentation', 'project'],
      },
      {
        id: generateId(),
        title: 'Buy groceries',
        description: 'Milk, bread, eggs, and vegetables for the week.',
        status: 'pending',
        priority: 'low',
        dueDate: tomorrow,
        createdAt: new Date(now.getTime() - 172800000), // 2 days ago
        updatedAt: new Date(now.getTime() - 172800000),
        tags: ['personal', 'shopping'],
      },
      {
        id: generateId(),
        title: 'Team meeting preparation',
        description: 'Prepare slides and agenda for the weekly team meeting.',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(now.getTime() - 86400000), // Yesterday
        createdAt: new Date(now.getTime() - 259200000), // 3 days ago
        updatedAt: new Date(now.getTime() - 86400000),
        tags: ['work', 'meeting'],
      },
      {
        id: generateId(),
        title: 'Fix critical bug in authentication',
        description: 'Users are unable to login with their credentials. Priority fix needed.',
        status: 'pending',
        priority: 'urgent',
        dueDate: now,
        createdAt: new Date(now.getTime() - 3600000), // 1 hour ago
        updatedAt: new Date(now.getTime() - 3600000),
        tags: ['work', 'bug', 'urgent'],
      },
      {
        id: generateId(),
        title: 'Review code for new feature',
        description: 'Conduct thorough code review for the user dashboard feature before deployment.',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(now.getTime() + 172800000), // 2 days from now
        createdAt: new Date(now.getTime() - 7200000), // 2 hours ago
        updatedAt: new Date(now.getTime() - 7200000),
        tags: ['work', 'review', 'feature'],
      },
      {
        id: generateId(),
        title: 'Book dentist appointment',
        description: 'Schedule annual dental checkup and cleaning.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(now.getTime() + 604800000), // 1 week from now
        createdAt: new Date(now.getTime() - 345600000), // 4 days ago
        updatedAt: new Date(now.getTime() - 345600000),
        tags: ['personal', 'health'],
      },
      {
        id: generateId(),
        title: 'Update resume and LinkedIn profile',
        description: 'Add recent projects and skills to resume and LinkedIn profile.',
        status: 'in_progress',
        priority: 'low',
        dueDate: new Date(now.getTime() + 1209600000), // 2 weeks from now
        createdAt: new Date(now.getTime() - 518400000), // 6 days ago
        updatedAt: new Date(now.getTime() - 86400000), // yesterday
        tags: ['personal', 'career', 'networking'],
      },
      {
        id: generateId(),
        title: 'Plan weekend trip',
        description: 'Research and book hotel for weekend getaway to the mountains.',
        status: 'completed',
        priority: 'low',
        dueDate: new Date(now.getTime() - 259200000), // 3 days ago
        createdAt: new Date(now.getTime() - 604800000), // 1 week ago
        updatedAt: new Date(now.getTime() - 259200000),
        tags: ['personal', 'travel', 'leisure'],
      },
      {
        id: generateId(),
        title: 'Database optimization',
        description: 'Optimize database queries for better performance on the analytics dashboard.',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date(now.getTime() + 432000000), // 5 days from now
        createdAt: new Date(now.getTime() - 432000000), // 5 days ago
        updatedAt: new Date(now.getTime() - 43200000), // 12 hours ago
        tags: ['work', 'database', 'performance'],
      },
      {
        id: generateId(),
        title: 'Call mom',
        description: 'Weekly check-in call with mom to catch up.',
        status: 'pending',
        priority: 'medium',
        dueDate: tomorrow,
        createdAt: new Date(now.getTime() - 21600000), // 6 hours ago
        updatedAt: new Date(now.getTime() - 21600000),
        tags: ['personal', 'family'],
      },
      {
        id: generateId(),
        title: 'Prepare quarterly report',
        description: 'Compile data and insights for Q4 business review presentation.',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(now.getTime() + 259200000), // 3 days from now
        createdAt: new Date(now.getTime() - 172800000), // 2 days ago
        updatedAt: new Date(now.getTime() - 172800000),
        tags: ['work', 'report', 'quarterly'],
      },
      {
        id: generateId(),
        title: 'Learn Docker containerization',
        description: 'Complete online course on Docker and containerization fundamentals.',
        status: 'in_progress',
        priority: 'low',
        dueDate: new Date(now.getTime() + 1814400000), // 3 weeks from now
        createdAt: new Date(now.getTime() - 777600000), // 9 days ago
        updatedAt: new Date(now.getTime() - 172800000), // 2 days ago
        tags: ['personal', 'learning', 'docker', 'devops'],
      },
      {
        id: generateId(),
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment pipeline for the new microservice.',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(now.getTime() + 345600000), // 4 days from now
        createdAt: new Date(now.getTime() - 259200000), // 3 days ago
        updatedAt: new Date(now.getTime() - 259200000),
        tags: ['work', 'devops', 'automation', 'pipeline'],
      },
      {
        id: generateId(),
        title: 'Exercise routine',
        description: 'Go to the gym for cardio and strength training session.',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(now.getTime() - 86400000), // yesterday
        createdAt: new Date(now.getTime() - 172800000), // 2 days ago
        updatedAt: new Date(now.getTime() - 86400000),
        tags: ['personal', 'health', 'fitness'],
      },
      {
        id: generateId(),
        title: 'Security audit',
        description: 'Conduct comprehensive security audit of user authentication system.',
        status: 'pending',
        priority: 'urgent',
        dueDate: new Date(now.getTime() + 86400000), // tomorrow
        createdAt: new Date(now.getTime() - 43200000), // 12 hours ago
        updatedAt: new Date(now.getTime() - 43200000),
        tags: ['work', 'security', 'audit', 'urgent'],
      },
      {
        id: generateId(),
        title: 'Refactor legacy code',
        description: 'Modernize and refactor the payment processing module for better maintainability.',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date(now.getTime() + 691200000), // 8 days from now
        createdAt: new Date(now.getTime() - 604800000), // 1 week ago
        updatedAt: new Date(now.getTime() - 21600000), // 6 hours ago
        tags: ['work', 'refactor', 'legacy', 'payment'],
      },
      {
        id: generateId(),
        title: 'Birthday party planning',
        description: 'Organize surprise birthday party for Sarah including venue, catering, and guest list.',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(now.getTime() - 432000000), // 5 days ago
        createdAt: new Date(now.getTime() - 1209600000), // 2 weeks ago
        updatedAt: new Date(now.getTime() - 432000000),
        tags: ['personal', 'event', 'birthday', 'planning'],
      },
      {
        id: generateId(),
        title: 'API documentation update',
        description: 'Update API documentation with new endpoints and authentication methods.',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(now.getTime() + 777600000), // 9 days from now
        createdAt: new Date(now.getTime() - 345600000), // 4 days ago
        updatedAt: new Date(now.getTime() - 345600000),
        tags: ['work', 'documentation', 'api'],
      },
      {
        id: generateId(),
        title: 'Implement real-time notifications system with WebSocket integration',
        description: 'Design and develop a comprehensive real-time notification system supporting push notifications, email alerts, and in-app messaging with proper queue management, retry logic, and delivery confirmation tracking.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(now.getTime() + 864000000), // 10 days from now
        createdAt: new Date(now.getTime() - 950400000), // 11 days ago
        updatedAt: new Date(now.getTime() - 14400000), // 4 hours ago
        tags: ['work', 'websocket', 'notifications', 'real-time', 'backend', 'architecture'],
      },
      {
        id: generateId(),
        title: 'Complete comprehensive financial audit and tax preparation for Q4 2024',
        description: 'Gather all financial documents, receipts, and investment statements. Review expense categories, calculate quarterly tax obligations, prepare documentation for accountant meeting, and organize digital filing system for future reference.',
        status: 'pending',
        priority: 'urgent',
        dueDate: new Date(now.getTime() + 432000000), // 5 days from now
        createdAt: new Date(now.getTime() - 1296000000), // 15 days ago
        updatedAt: new Date(now.getTime() - 259200000), // 3 days ago
        tags: ['personal', 'finance', 'taxes', 'audit', 'quarterly', 'documentation', 'urgent'],
      },
      {
        id: generateId(),
        title: 'Research and implement advanced caching strategies for microservices architecture',
        description: 'Evaluate Redis Cluster vs MongoDB caching, implement distributed cache invalidation patterns, set up cache warming strategies, configure TTL policies, and establish monitoring for cache hit/miss ratios across multiple service instances.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(now.getTime() + 1555200000), // 18 days from now
        createdAt: new Date(now.getTime() - 691200000), // 8 days ago
        updatedAt: new Date(now.getTime() - 691200000),
        tags: ['work', 'caching', 'redis', 'mongodb', 'microservices', 'performance', 'architecture', 'monitoring'],
      },
      {
        id: generateId(),
        title: 'Organize multi-day conference presentation on "Building Resilient Distributed Systems"',
        description: 'Prepare 45-minute technical presentation covering fault tolerance patterns, circuit breakers, bulkhead isolation, and chaos engineering. Create interactive demos, design slides with code examples, practice delivery, and prepare for Q&A session.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(now.getTime() + 1209600000), // 2 weeks from now
        createdAt: new Date(now.getTime() - 1728000000), // 20 days ago
        updatedAt: new Date(now.getTime() - 86400000), // yesterday
        tags: ['work', 'presentation', 'conference', 'distributed-systems', 'resilience', 'speaking', 'demo'],
      },
      {
        id: generateId(),
        title: 'Complete home renovation project: kitchen and bathroom modernization',
        description: 'Coordinate with contractors for cabinet installation, tile work, plumbing updates, electrical rewiring for new appliances, and final inspection. Track budget, timeline, and ensure all permits are properly filed.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(now.getTime() + 2592000000), // 30 days from now
        createdAt: new Date(now.getTime() - 2592000000), // 30 days ago
        updatedAt: new Date(now.getTime() - 172800000), // 2 days ago
        tags: ['personal', 'renovation', 'home', 'contractors', 'budget', 'permits', 'project-management'],
      },
      {
        id: generateId(),
        title: 'Design and implement comprehensive test automation framework',
        description: 'Build end-to-end testing suite using Playwright, implement visual regression testing, set up performance benchmarking, create test data factories, establish CI/CD integration with parallel test execution, and configure detailed reporting dashboard.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(now.getTime() + 2073600000), // 24 days from now
        createdAt: new Date(now.getTime() - 864000000), // 10 days ago
        updatedAt: new Date(now.getTime() - 432000000), // 5 days ago
        tags: ['work', 'testing', 'automation', 'playwright', 'ci-cd', 'performance', 'visual-regression', 'framework'],
      },
      {
        id: generateId(),
        title: 'Learn advanced machine learning algorithms and implement recommendation engine',
        description: 'Study collaborative filtering, matrix factorization, deep learning approaches for recommendations. Implement prototype using TensorFlow, create evaluation metrics, gather training data, and build A/B testing framework for model comparison.',
        status: 'in_progress',
        priority: 'low',
        dueDate: new Date(now.getTime() + 5184000000), // 60 days from now
        createdAt: new Date(now.getTime() - 1555200000), // 18 days ago
        updatedAt: new Date(now.getTime() - 259200000), // 3 days ago
        tags: ['personal', 'learning', 'machine-learning', 'tensorflow', 'recommendation-engine', 'algorithms', 'data-science'],
      },
      {
        id: generateId(),
        title: 'Establish emergency preparedness plan and disaster recovery procedures',
        description: 'Create comprehensive family emergency plan including evacuation routes, communication protocols, supply inventory, document backup strategies, financial emergency fund planning, and regular drill scheduling.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(now.getTime() + 1728000000), // 20 days from now
        createdAt: new Date(now.getTime() - 1209600000), // 14 days ago
        updatedAt: new Date(now.getTime() - 345600000), // 4 days ago
        tags: ['personal', 'emergency', 'disaster-recovery', 'family', 'planning', 'safety', 'preparedness'],
      },
      {
        id: generateId(),
        title: 'Migrate legacy monolith to cloud-native microservices architecture',
        description: 'Analyze existing codebase dependencies, design service boundaries using domain-driven design, implement API gateways, set up service mesh, configure observability stack, plan zero-downtime migration strategy, and establish rollback procedures.',
        status: 'in_progress',
        priority: 'urgent',
        dueDate: new Date(now.getTime() + 3456000000), // 40 days from now
        createdAt: new Date(now.getTime() - 2160000000), // 25 days ago
        updatedAt: new Date(now.getTime() - 21600000), // 6 hours ago
        tags: ['work', 'migration', 'microservices', 'cloud-native', 'architecture', 'kubernetes', 'observability', 'ddd'],
      },
      {
        id: generateId(),
        title: 'Complete advanced certification in cloud security and compliance frameworks',
        description: 'Study for AWS Security Specialty certification, learn GDPR compliance requirements, understand SOC2 Type II auditing processes, practice with hands-on labs, schedule exam, and update professional credentials.',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date(now.getTime() + 4320000000), // 50 days from now
        createdAt: new Date(now.getTime() - 1814400000), // 21 days ago
        updatedAt: new Date(now.getTime() - 432000000), // 5 days ago
        tags: ['personal', 'certification', 'aws', 'security', 'compliance', 'gdpr', 'soc2', 'learning'],
      },
      {
        id: generateId(),
        title: 'Develop comprehensive data analytics platform with real-time dashboards',
        description: 'Build ETL pipelines using Apache Kafka, implement data warehouse with Snowflake, create interactive dashboards using D3.js, set up automated reporting, configure data quality monitoring, and establish data governance policies.',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(now.getTime() + 2764800000), // 32 days from now
        createdAt: new Date(now.getTime() - 1382400000), // 16 days ago
        updatedAt: new Date(now.getTime() - 604800000), // 1 week ago
        tags: ['work', 'analytics', 'kafka', 'snowflake', 'd3js', 'etl', 'dashboards', 'data-governance'],
      },
      {
        id: generateId(),
        title: 'Plan and execute comprehensive digital detox and mindfulness retreat',
        description: 'Research retreat locations, book accommodations, plan daily meditation schedules, prepare offline activities, set up automatic email responses, delegate work responsibilities, and create post-retreat integration plan.',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(now.getTime() - 604800000), // 1 week ago
        createdAt: new Date(now.getTime() - 2419200000), // 28 days ago
        updatedAt: new Date(now.getTime() - 604800000),
        tags: ['personal', 'wellness', 'retreat', 'mindfulness', 'digital-detox', 'meditation', 'self-care'],
      },
    ];
  }

  async getAllTasks(): Promise<ApiResponse<Task[]>> {
    await this.delay(API_DELAYS.READ);

    try {
      const tasks = this.loadTasksFromStorage();
      return {
        data: tasks,
        success: true,
        message: 'Tasks loaded successfully',
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to load tasks',
      };
    }
  }

  async createTask(taskData: TaskFormData): Promise<ApiResponse<Task>> {
    await this.delay(API_DELAYS.CREATE);

    try {
      const tasks = this.loadTasksFromStorage();
      const now = new Date();

      const newTask: Task = {
        id: generateId(),
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        createdAt: now,
        updatedAt: now,
        tags: taskData.tags,
      };

      const updatedTasks = [...tasks, newTask];
      this.saveTasksToStorage(updatedTasks);

      return {
        data: newTask,
        success: true,
        message: 'Task created successfully',
      };
    } catch (error) {
      return {
        data: {} as Task,
        success: false,
        error: 'Failed to create task',
      };
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    await this.delay(API_DELAYS.UPDATE);

    try {
      const tasks = this.loadTasksFromStorage();
      const taskIndex = tasks.findIndex(task => task.id === id);

      if (taskIndex === -1) {
        return {
          data: {} as Task,
          success: false,
          error: 'Task not found',
        };
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
      };

      tasks[taskIndex] = updatedTask;
      this.saveTasksToStorage(tasks);

      return {
        data: updatedTask,
        success: true,
        message: 'Task updated successfully',
      };
    } catch (error) {
      return {
        data: {} as Task,
        success: false,
        error: 'Failed to update task',
      };
    }
  }

  async deleteTask(id: string): Promise<ApiResponse<boolean>> {
    await this.delay(API_DELAYS.DELETE);

    try {
      const tasks = this.loadTasksFromStorage();
      const filteredTasks = tasks.filter(task => task.id !== id);

      if (filteredTasks.length === tasks.length) {
        return {
          data: false,
          success: false,
          error: 'Task not found',
        };
      }

      this.saveTasksToStorage(filteredTasks);

      return {
        data: true,
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      return {
        data: false,
        success: false,
        error: 'Failed to delete task',
      };
    }
  }

  async bulkDeleteTasks(ids: string[]): Promise<ApiResponse<number>> {
    await this.delay(API_DELAYS.DELETE);

    try {
      const tasks = this.loadTasksFromStorage();
      const filteredTasks = tasks.filter(task => !ids.includes(task.id));
      const deletedCount = tasks.length - filteredTasks.length;

      this.saveTasksToStorage(filteredTasks);

      return {
        data: deletedCount,
        success: true,
        message: `${deletedCount} tasks deleted successfully`,
      };
    } catch (error) {
      return {
        data: 0,
        success: false,
        error: 'Failed to delete tasks',
      };
    }
  }

  async bulkUpdateTasks(ids: string[], updates: Partial<Task>): Promise<ApiResponse<number>> {
    await this.delay(API_DELAYS.UPDATE);

    try {
      const tasks = this.loadTasksFromStorage();
      let updatedCount = 0;

      const updatedTasks = tasks.map(task => {
        if (ids.includes(task.id)) {
          updatedCount++;
          return {
            ...task,
            ...updates,
            updatedAt: new Date(),
          };
        }
        return task;
      });

      this.saveTasksToStorage(updatedTasks);

      return {
        data: updatedCount,
        success: true,
        message: `${updatedCount} tasks updated successfully`,
      };
    } catch (error) {
      return {
        data: 0,
        success: false,
        error: 'Failed to update tasks',
      };
    }
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    await this.delay(API_DELAYS.READ);

    try {
      const tasks = this.loadTasksFromStorage();
      const task = tasks.find(t => t.id === id);

      if (!task) {
        return {
          data: {} as Task,
          success: false,
          error: 'Task not found',
        };
      }

      return {
        data: task,
        success: true,
        message: 'Task loaded successfully',
      };
    } catch (error) {
      return {
        data: {} as Task,
        success: false,
        error: 'Failed to load task',
      };
    }
  }

  // Simulate network errors for testing
  async simulateError(): Promise<ApiResponse<any>> {
    await this.delay(1000);
    return {
      data: null,
      success: false,
      error: 'Simulated network error',
    };
  }

  // Backup functionality
  async createBackup(): Promise<ApiResponse<string>> {
    await this.delay(500);

    try {
      const tasks = this.loadTasksFromStorage();
      const backup = JSON.stringify({
        tasks,
        backedUpAt: new Date(),
        version: '1.0.0',
      });

      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, backup);

      return {
        data: backup,
        success: true,
        message: 'Backup created successfully',
      };
    } catch (error) {
      return {
        data: '',
        success: false,
        error: 'Failed to create backup',
      };
    }
  }

  async restoreFromBackup(backupData: string): Promise<ApiResponse<boolean>> {
    await this.delay(500);

    try {
      const backup = JSON.parse(backupData);
      if (backup.tasks && Array.isArray(backup.tasks)) {
        this.saveTasksToStorage(backup.tasks);
        return {
          data: true,
          success: true,
          message: 'Tasks restored from backup successfully',
        };
      } else {
        return {
          data: false,
          success: false,
          error: 'Invalid backup format',
        };
      }
    } catch (error) {
      return {
        data: false,
        success: false,
        error: 'Failed to restore from backup',
      };
    }
  }
}

export const mockApi = new MockApiService();