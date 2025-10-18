export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type SortBy = 'dueDate' | 'priority' | 'status' | 'title' | 'createdAt';

export type SortOrder = 'asc' | 'desc';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isSelected?: boolean;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  userId?: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  tags?: string[];
  dueDateRange?: {
    start: Date;
    end: Date;
  };
  isOverdue?: boolean;
}

export interface TaskSort {
  by: SortBy;
  order: SortOrder;
}

export interface TaskSearchParams {
  query?: string;
  filters?: TaskFilters;
  sort?: TaskSort;
}

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchParams: TaskSearchParams;
  selectedTasks: string[];

  // Task operations
  addTask: (taskData: TaskFormData) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;

  // Bulk operations
  selectTask: (id: string) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  bulkDelete: () => Promise<void>;
  bulkUpdateStatus: (status: TaskStatus) => Promise<void>;

  // Search and filter
  setSearchQuery: (query: string) => void;
  setFilters: (filters: TaskFilters) => void;
  setSort: (sort: TaskSort) => void;
  clearFilters: () => void;

  // Reordering
  reorderTasks: (activeId: string, overId: string) => void;
}



export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
};

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Auth operations
  login: (credentials: LoginFormData) => Promise<void>;
  signup: (userData: SignupFormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;

  // User operations
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}