import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Task, TaskFormData, TaskContextType, TaskFilters, TaskSort, TaskSearchParams, TaskStatus } from '@/types';
import { mockApi } from '@/services/mockApi';
import { filterTasks, searchTasks, sortTasks, debounce } from '@/utils';
import { useAuth } from './AuthContext';

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'BULK_DELETE_TASKS'; payload: string[] }
  | { type: 'BULK_UPDATE_TASKS'; payload: { ids: string[]; updates: Partial<Task> } }
  | { type: 'SET_SEARCH_PARAMS'; payload: TaskSearchParams }
  | { type: 'SELECT_TASK'; payload: string }
  | { type: 'SELECT_ALL_TASKS' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'REORDER_TASKS'; payload: { activeId: string; overId: string } };

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchParams: TaskSearchParams;
  selectedTasks: string[];
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  searchParams: {
    query: '',
    filters: {},
    sort: { by: 'createdAt', order: 'desc' },
  },
  selectedTasks: [],
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: false,
        error: null,
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
        loading: false,
        error: null,
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        selectedTasks: state.selectedTasks.filter(id => id !== action.payload),
        loading: false,
        error: null,
      };

    case 'BULK_DELETE_TASKS':
      return {
        ...state,
        tasks: state.tasks.filter(task => !action.payload.includes(task.id)),
        selectedTasks: [],
        loading: false,
        error: null,
      };

    case 'BULK_UPDATE_TASKS':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          action.payload.ids.includes(task.id)
            ? { ...task, ...action.payload.updates }
            : task
        ),
        selectedTasks: [],
        loading: false,
        error: null,
      };

    case 'SET_SEARCH_PARAMS':
      return {
        ...state,
        searchParams: { ...state.searchParams, ...action.payload },
      };

    case 'SELECT_TASK':
      const isSelected = state.selectedTasks.includes(action.payload);
      return {
        ...state,
        selectedTasks: isSelected
          ? state.selectedTasks.filter(id => id !== action.payload)
          : [...state.selectedTasks, action.payload],
      };

    case 'SELECT_ALL_TASKS':
      const allTaskIds = state.tasks.map(task => task.id);
      return {
        ...state,
        selectedTasks: state.selectedTasks.length === allTaskIds.length ? [] : allTaskIds,
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedTasks: [],
      };

    case 'REORDER_TASKS':
      const { activeId, overId } = action.payload;
      const tasks = [...state.tasks];
      const activeIndex = tasks.findIndex(task => task.id === activeId);
      const overIndex = tasks.findIndex(task => task.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const [activeTask] = tasks.splice(activeIndex, 1);
        tasks.splice(overIndex, 0, activeTask);
      }

      return {
        ...state,
        tasks,
      };

    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load tasks when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadTasks();
    } else {
      // Clear tasks when not authenticated
      dispatch({ type: 'SET_TASKS', payload: [] });
    }
  }, [isAuthenticated, user?.id]);

  const loadTasks = async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await mockApi.getUserTasks(user.id);
      if (response.success) {
        dispatch({ type: 'SET_TASKS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load tasks' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' });
    }
  };

  const addTask = async (taskData: TaskFormData) => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await mockApi.createTask({ ...taskData, userId: user.id });
      if (response.success) {
        dispatch({ type: 'ADD_TASK', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to create task' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create task' });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await mockApi.updateTask(id, updates);
      if (response.success) {
        dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to update task' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
    }
  };

  const deleteTask = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await mockApi.deleteTask(id);
      if (response.success) {
        dispatch({ type: 'DELETE_TASK', payload: id });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to delete task' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    let newStatus: TaskStatus;
    switch (task.status) {
      case 'pending':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'pending';
    }

    await updateTask(id, { status: newStatus });
  };

  const selectTask = (id: string) => {
    dispatch({ type: 'SELECT_TASK', payload: id });
  };

  const selectAllTasks = () => {
    dispatch({ type: 'SELECT_ALL_TASKS' });
  };

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const bulkDelete = async () => {
    if (state.selectedTasks.length === 0) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await mockApi.bulkDeleteTasks(state.selectedTasks);
      if (response.success) {
        dispatch({ type: 'BULK_DELETE_TASKS', payload: state.selectedTasks });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to delete tasks' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete tasks' });
    }
  };

  const bulkUpdateStatus = async (status: TaskStatus) => {
    if (state.selectedTasks.length === 0) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await mockApi.bulkUpdateTasks(state.selectedTasks, { status });
      if (response.success) {
        dispatch({
          type: 'BULK_UPDATE_TASKS',
          payload: { ids: state.selectedTasks, updates: { status } },
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to update tasks' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update tasks' });
    }
  };

  // Debounced search function
  const debouncedSetSearchQuery = useCallback(
    debounce((query: string) => {
      dispatch({ type: 'SET_SEARCH_PARAMS', payload: { query } });
    }, 300),
    []
  );

  const setSearchQuery = (query: string) => {
    debouncedSetSearchQuery(query);
  };

  const setFilters = (filters: TaskFilters) => {
    dispatch({ type: 'SET_SEARCH_PARAMS', payload: { filters } });
  };

  const setSort = (sort: TaskSort) => {
    dispatch({ type: 'SET_SEARCH_PARAMS', payload: { sort } });
  };

  const clearFilters = () => {
    dispatch({
      type: 'SET_SEARCH_PARAMS',
      payload: {
        query: '',
        filters: {},
        sort: { by: 'createdAt', order: 'desc' },
      },
    });
  };

  const reorderTasks = (activeId: string, overId: string) => {
    dispatch({ type: 'REORDER_TASKS', payload: { activeId, overId } });
  };

  // Get filtered and sorted tasks
  const getFilteredTasks = () => {
    let filteredTasks = state.tasks;

    // Apply search
    if (state.searchParams.query) {
      filteredTasks = searchTasks(filteredTasks, state.searchParams.query);
    }

    // Apply filters
    if (state.searchParams.filters) {
      filteredTasks = filterTasks(filteredTasks, state.searchParams.filters);
    }

    // Apply sorting
    if (state.searchParams.sort) {
      filteredTasks = sortTasks(filteredTasks, state.searchParams.sort);
    }

    return filteredTasks;
  };

  const contextValue: TaskContextType = {
    tasks: getFilteredTasks(),
    loading: state.loading,
    error: state.error,
    searchParams: state.searchParams,
    selectedTasks: state.selectedTasks,

    // Task operations
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,

    // Bulk operations
    selectTask,
    selectAllTasks,
    clearSelection,
    bulkDelete,
    bulkUpdateStatus,

    // Search and filter
    setSearchQuery,
    setFilters,
    setSort,
    clearFilters,

    // Reordering
    reorderTasks,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};