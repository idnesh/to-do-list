import { TaskPriority, TaskStatus, SortBy } from '@/types';

export const TASK_STATUSES: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: '#6b7280' },
  { value: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { value: 'completed', label: 'Completed', color: '#10b981' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'urgent', label: 'Urgent', color: '#dc2626' },
];

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'title', label: 'Title' },
  { value: 'createdAt', label: 'Created Date' },
];

export const DEFAULT_TAGS = [
  'work',
  'personal',
  'urgent',
  'meeting',
  'project',
  'review',
  'bug',
  'feature',
  'documentation',
  'testing',
];

export const STORAGE_KEYS = {
  TASKS: 'todo-app-tasks',
  PREFERENCES: 'todo-app-preferences',
  LAST_BACKUP: 'todo-app-last-backup',
} as const;

export const API_DELAYS = {
  CREATE: 500,
  READ: 300,
  UPDATE: 400,
  DELETE: 600,
} as const;

export const KEYBOARD_SHORTCUTS = [
  { key: 'n', ctrlKey: true, description: 'Create new task' },
  { key: 'f', ctrlKey: true, description: 'Search tasks' },
  { key: 'a', ctrlKey: true, description: 'Select all tasks' },
  { key: 'Delete', description: 'Delete selected tasks' },
  { key: 'e', ctrlKey: true, description: 'Export tasks' },
  { key: '/', description: 'Toggle shortcuts help' },
] as const;

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const STATUS_ORDER: Record<TaskStatus, number> = {
  in_progress: 3,
  pending: 2,
  completed: 1,
};