import React, { useState } from 'react';
import { Task } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { formatDate, isOverdue, isDueToday } from '@/utils';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/constants';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { EditTaskModal } from './EditTaskModal';
import { ReminderModal } from './ReminderModal';
import {
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiPlay,
  FiPause,
  FiFlag,
  FiCalendar,
  FiTag,
  FiMoreHorizontal,
  FiBell
} from 'react-icons/fi';

interface TaskTableProps {
  searchQuery?: string;
}

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onReminder: (task: Task) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, isSelected, onEdit, onDelete, onReminder }) => {
  const { toggleTaskStatus, selectTask } = useTaskContext();

  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
  };

  const handleToggleSelect = () => {
    selectTask(task.id);
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <FiCheck className="text-green-500 dark:text-green-400 h-4 w-4" />;
      case 'in_progress':
        return <FiPlay className="text-blue-500 dark:text-blue-400 h-4 w-4" />;
      default:
        return <FiPause className="text-gray-500 dark:text-gray-400 h-4 w-4" />;
    }
  };

  const getPriorityColor = () => {
    const priority = TASK_PRIORITIES.find(p => p.value === task.priority);
    return priority?.color || '#6b7280';
  };

  const getStatusColor = () => {
    const status = TASK_STATUSES.find(s => s.value === task.status);
    return status?.color || '#6b7280';
  };

  const isTaskOverdue = isOverdue(task.dueDate);
  const isTaskDueToday = isDueToday(task.dueDate);

  return (
    <tr
      className={`
        hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 border-b border-gray-100 dark:border-gray-700
        ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
        ${task.status === 'completed' ? 'opacity-75' : ''}
        ${isTaskOverdue ? 'bg-red-50 dark:bg-red-900/20' : ''}
        ${isTaskDueToday ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}
      `}
    >
      {/* Checkbox */}
      <td className="px-2 py-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelect}
          className="h-3 w-3 text-blue-600 dark:text-blue-400 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        />
      </td>

      {/* Title */}
      <td className="px-2 py-1">
        <div className="w-full overflow-hidden">
          <span
            className={`text-xs font-medium block truncate transition-colors duration-300 ${
              task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
            }`}
            title={task.title}
          >
            {task.title}
          </span>
        </div>
      </td>

      {/* Description */}
      <td className="px-2 py-1">
        <div className="w-full overflow-hidden">
          {task.description ? (
            <span
              className="text-xs text-gray-600 dark:text-gray-300 block truncate transition-colors duration-300"
              title={task.description}
            >
              {task.description}
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">-</span>
          )}
        </div>
      </td>

      {/* Priority */}
      <td className="px-2 py-1">
        <span
          className="text-xs font-medium px-1 py-0.5 rounded capitalize"
          style={{
            backgroundColor: `${getPriorityColor()}20`,
            color: getPriorityColor(),
          }}
        >
          {task.priority}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-2 py-1">
        <div className="w-full overflow-hidden">
          {task.dueDate ? (
            <span
              className={`text-xs block truncate transition-colors duration-300 ${
                isTaskOverdue ? 'text-red-600 dark:text-red-400' : isTaskDueToday ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">-</span>
          )}
        </div>
      </td>

      {/* Created Date */}
      <td className="px-2 py-1">
        <div className="w-full overflow-hidden">
          <span className="text-xs text-gray-600 dark:text-gray-300 block truncate transition-colors duration-300">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </td>

      {/* Progress */}
      <td className="px-2 py-1">
        <span className="text-xs capitalize text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {TASK_STATUSES.find(s => s.value === task.status)?.label}
        </span>
      </td>

      {/* Actions */}
      <td className="px-2 py-1">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onEdit(task)}
            className="p-0.5 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 rounded"
            title="Edit task"
          >
            <FiEdit3 className="h-3 w-3" />
          </button>
          <button
            onClick={() => onReminder(task)}
            className="p-0.5 text-orange-500 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-300 rounded"
            title="Set reminder"
          >
            <FiBell className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-0.5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300 rounded"
            title="Delete task"
          >
            <FiTrash2 className="h-3 w-3" />
          </button>
        </div>
      </td>

    </tr>
  );
};

export const TaskTable: React.FC<TaskTableProps> = ({ searchQuery }) => {
  const { tasks, selectedTasks, loading, error, selectAllTasks, deleteTask } = useTaskContext();
  const allSelected = selectedTasks.length === tasks.length && tasks.length > 0;
  const someSelected = selectedTasks.length > 0 && selectedTasks.length < tasks.length;

  // Modal state management
  const [editModalTask, setEditModalTask] = useState<Task | null>(null);
  const [deleteModalTask, setDeleteModalTask] = useState<Task | null>(null);
  const [reminderModalTask, setReminderModalTask] = useState<Task | null>(null);

  const handleSelectAll = () => {
    selectAllTasks();
  };

  const handleEdit = (task: Task) => {
    setEditModalTask(task);
  };

  const handleDelete = (task: Task) => {
    setDeleteModalTask(task);
  };

  const handleReminder = (task: Task) => {
    setReminderModalTask(task);
  };

  const handleConfirmDelete = async () => {
    if (deleteModalTask) {
      await deleteTask(deleteModalTask.id);
      setDeleteModalTask(null);
    }
  };

  const handleReminderConfirm = (reminderTime: Date) => {
    if (reminderModalTask) {
      alert(`Reminder set for task: "${reminderModalTask.title}" at ${reminderTime.toLocaleString()}`);
      setReminderModalTask(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
            <FiTrash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Error Loading Tasks</h3>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
            <FiTag className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            {searchQuery ? 'No tasks found' : 'No tasks yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Create your first task to get started!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Fixed Header */}
      <div className="w-full">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <tr>
              <th className="px-2 py-2 text-left w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="h-3 w-3 text-blue-600 dark:text-blue-400 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
                />
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-48 transition-colors duration-300">
                Task
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-64 transition-colors duration-300">
                Description
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 transition-colors duration-300">
                Priority
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 transition-colors duration-300">
                Due Date
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 transition-colors duration-300">
                Created
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 transition-colors duration-300">
                Progress
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20 transition-colors duration-300">
                Actions
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 375px)' }}>
        <table className="w-full table-fixed">
          {/* Hidden header to maintain column alignment */}
          <thead className="invisible">
            <tr>
              <th className="px-2 py-2 w-8"></th>
              <th className="px-2 py-2 w-48"></th>
              <th className="px-2 py-2 w-64"></th>
              <th className="px-2 py-2 w-24"></th>
              <th className="px-2 py-2 w-24"></th>
              <th className="px-2 py-2 w-24"></th>
              <th className="px-2 py-2 w-24"></th>
              <th className="px-2 py-2 w-20"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                isSelected={selectedTasks.includes(task.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReminder={handleReminder}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="bg-gray-50 dark:bg-gray-800 px-2 py-2 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 transition-colors duration-300">
          <span>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            {selectedTasks.length > 0 && ` (${selectedTasks.length} selected)`}
          </span>
          <div className="flex items-center gap-3">
            <span>
              C: {tasks.filter(t => t.status === 'completed').length}
            </span>
            <span>
              P: {tasks.filter(t => t.status === 'in_progress').length}
            </span>
            <span>
              T: {tasks.filter(t => t.status === 'pending').length}
            </span>
          </div>
        </div>
      </div>

      {/* Modals - rendered outside table structure */}
      <EditTaskModal
        isOpen={!!editModalTask}
        task={editModalTask}
        onClose={() => setEditModalTask(null)}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteModalTask}
        taskTitle={deleteModalTask?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalTask(null)}
        loading={loading}
      />

      <ReminderModal
        isOpen={!!reminderModalTask}
        taskTitle={reminderModalTask?.title || ''}
        onConfirm={handleReminderConfirm}
        onCancel={() => setReminderModalTask(null)}
        loading={loading}
      />
    </div>
  );
};