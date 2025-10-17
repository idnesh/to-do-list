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
}

const TaskRow: React.FC<TaskRowProps> = ({ task, isSelected }) => {
  const { deleteTask, toggleTaskStatus, selectTask, loading } = useTaskContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
  };

  const handleToggleSelect = () => {
    selectTask(task.id);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await deleteTask(task.id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleRemindMe = () => {
    setShowReminderModal(true);
  };

  const handleReminderConfirm = (reminderTime: Date) => {
    // For now, we'll show a simple alert. In a real app, this would set up notifications
    alert(`Reminder set for task: "${task.title}" at ${reminderTime.toLocaleString()}`);
    setShowReminderModal(false);
  };

  const handleReminderCancel = () => {
    setShowReminderModal(false);
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <FiCheck className="text-green-500 h-4 w-4" />;
      case 'in_progress':
        return <FiPlay className="text-blue-500 h-4 w-4" />;
      default:
        return <FiPause className="text-gray-500 h-4 w-4" />;
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
        hover:bg-gray-50 transition-colors border-b border-gray-100
        ${isSelected ? 'bg-blue-50' : ''}
        ${task.status === 'completed' ? 'opacity-75' : ''}
        ${isTaskOverdue ? 'bg-red-50' : ''}
        ${isTaskDueToday ? 'bg-yellow-50' : ''}
      `}
    >
      {/* Checkbox */}
      <td className="px-2 py-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelect}
          className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </td>

      {/* Title */}
      <td className="px-2 py-1">
        <div className="w-full overflow-hidden">
          <span
            className={`text-xs font-medium block truncate ${
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
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
              className="text-xs text-gray-600 block truncate"
              title={task.description}
            >
              {task.description}
            </span>
          ) : (
            <span className="text-xs text-gray-400">-</span>
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
              className={`text-xs block truncate ${
                isTaskOverdue ? 'text-red-600' : isTaskDueToday ? 'text-yellow-600' : 'text-gray-600'
              }`}
            >
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
      </td>

      {/* Created Date */}
      <td className="px-2 py-1">
        <div className="w-full overflow-hidden">
          <span className="text-xs text-gray-600 block truncate">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </td>

      {/* Progress */}
      <td className="px-2 py-1">
        <span className="text-xs capitalize text-gray-600">
          {TASK_STATUSES.find(s => s.value === task.status)?.label}
        </span>
      </td>

      {/* Actions */}
      <td className="px-2 py-1">
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleEdit}
            className="p-0.5 text-blue-500 hover:text-blue-700 transition-colors rounded"
            title="Edit task"
          >
            <FiEdit3 className="h-3 w-3" />
          </button>
          <button
            onClick={handleRemindMe}
            className="p-0.5 text-orange-500 hover:text-orange-700 transition-colors rounded"
            title="Set reminder"
          >
            <FiBell className="h-3 w-3" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-0.5 text-red-500 hover:text-red-700 transition-colors rounded"
            title="Delete task"
          >
            <FiTrash2 className="h-3 w-3" />
          </button>
        </div>
      </td>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        task={task}
        onClose={() => setShowEditModal(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        taskTitle={task.title}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={loading}
      />

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        taskTitle={task.title}
        onConfirm={handleReminderConfirm}
        onCancel={handleReminderCancel}
        loading={loading}
      />
    </tr>
  );
};

export const TaskTable: React.FC<TaskTableProps> = ({ searchQuery }) => {
  const { tasks, selectedTasks, loading, error, selectAllTasks } = useTaskContext();
  const allSelected = selectedTasks.length === tasks.length && tasks.length > 0;
  const someSelected = selectedTasks.length > 0 && selectedTasks.length < tasks.length;

  const handleSelectAll = () => {
    selectAllTasks();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Tasks</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTag className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No tasks found' : 'No tasks yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Create your first task to get started!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Fixed Header */}
      <div className="w-full">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 text-left w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Task
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Description
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Priority
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Due Date
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Created
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Progress
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div className="overflow-y-auto max-h-96">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                isSelected={selectedTasks.includes(task.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="bg-gray-50 px-2 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
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
    </div>
  );
};