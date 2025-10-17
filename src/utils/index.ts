import { format, isAfter, isBefore, isToday, isThisWeek, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskFilters, TaskSort, TaskPriority, TaskStatus } from '@/types';
import { PRIORITY_ORDER, STATUS_ORDER } from '@/constants';

export const generateId = (): string => uuidv4();

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const isOverdue = (dueDate: Date | string | undefined): boolean => {
  if (!dueDate) return false;
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isAfter(new Date(), dateObj) && !isToday(dateObj);
};

export const isDueToday = (dueDate: Date | string | undefined): boolean => {
  if (!dueDate) return false;
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isToday(dateObj);
};

export const isDueThisWeek = (dueDate: Date | string | undefined): boolean => {
  if (!dueDate) return false;
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isThisWeek(dateObj);
};

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter((task) => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => task.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Due date range filter
    if (filters.dueDateRange && task.dueDate) {
      const taskDueDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
      if (isBefore(taskDueDate, filters.dueDateRange.start) ||
          isAfter(taskDueDate, filters.dueDateRange.end)) {
        return false;
      }
    }

    // Overdue filter
    if (filters.isOverdue !== undefined) {
      const taskIsOverdue = isOverdue(task.dueDate);
      if (filters.isOverdue !== taskIsOverdue) return false;
    }

    return true;
  });
};

export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;

  const searchQuery = query.toLowerCase();
  return tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchQuery) ||
      task.description?.toLowerCase().includes(searchQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  });
};

export const sortTasks = (tasks: Task[], sort: TaskSort): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sort.by) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'dueDate':
        const aDate = a.dueDate ? (typeof a.dueDate === 'string' ? parseISO(a.dueDate) : a.dueDate) : new Date(0);
        const bDate = b.dueDate ? (typeof b.dueDate === 'string' ? parseISO(b.dueDate) : b.dueDate) : new Date(0);
        comparison = aDate.getTime() - bDate.getTime();
        break;
      case 'priority':
        comparison = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        break;
      case 'status':
        comparison = STATUS_ORDER[b.status] - STATUS_ORDER[a.status];
        break;
      case 'createdAt':
        const aCreated = typeof a.createdAt === 'string' ? parseISO(a.createdAt) : a.createdAt;
        const bCreated = typeof b.createdAt === 'string' ? parseISO(b.createdAt) : b.createdAt;
        comparison = aCreated.getTime() - bCreated.getTime();
        break;
      default:
        comparison = 0;
    }

    return sort.order === 'desc' ? -comparison : comparison;
  });
};



export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
  switch (currentStatus) {
    case 'pending':
      return 'in_progress';
    case 'in_progress':
      return 'completed';
    case 'completed':
      return 'pending';
    default:
      return 'pending';
  }
};

export const validateTaskForm = (data: { title: string; dueDate?: Date }): string[] => {
  const errors: string[] = [];

  if (!data.title.trim()) {
    errors.push('Title is required');
  }

  if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.dueDate && isBefore(data.dueDate, new Date())) {
    errors.push('Due date cannot be in the past');
  }

  return errors;
};