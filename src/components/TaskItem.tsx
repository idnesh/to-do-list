import React, { useState } from 'react';
import { Task } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { formatDate, isOverdue, isDueToday } from '@/utils';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/constants';
import { FiEdit3, FiTrash2, FiClock, FiCalendar, FiFlag, FiCheck, FiPlay, FiPause } from 'react-icons/fi';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  isDragging?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected, isDragging }) => {
  const { updateTask, deleteTask, toggleTaskStatus, selectTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
  };

  const handleToggleSelect = () => {
    selectTask(task.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <FiCheck className="text-green-500 dark:text-green-400" />;
      case 'in_progress':
        return <FiPlay className="text-blue-500 dark:text-blue-400" />;
      default:
        return <FiPause className="text-gray-500 dark:text-gray-400" />;
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
    <div
      className={`
        task-item bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-900/30
        ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400 border-blue-200 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'}
        ${isDragging ? 'opacity-50 transform rotate-1' : ''}
        ${task.status === 'completed' ? 'opacity-75' : ''}
        ${isTaskOverdue ? 'border-l-4 border-l-red-500 dark:border-l-red-400' : ''}
        ${isTaskDueToday ? 'border-l-4 border-l-yellow-500 dark:border-l-yellow-400' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelect}
          className="mt-1 h-4 w-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        />

        {/* Task content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleToggleStatus}
              className="flex-shrink-0 hover:scale-110 transition-transform duration-300"
              title={`Mark as ${task.status === 'completed' ? 'pending' : task.status === 'pending' ? 'in progress' : 'completed'}`}
            >
              {getStatusIcon()}
            </button>

            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="flex-1 text-lg font-medium border-none outline-none bg-transparent text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 rounded px-1 transition-colors duration-300"
                autoFocus
              />
            ) : (
              <h3
                className={`flex-1 text-lg font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 ${
                  task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                }`}
                onClick={handleEdit}
              >
                {task.title}
              </h3>
            )}

            {/* Priority indicator */}
            <div className="flex items-center gap-1">
              <FiFlag
                style={{ color: getPriorityColor() }}
                className="h-4 w-4"
              />
              <span
                className="text-xs font-medium px-2 py-1 rounded-full capitalize"
                style={{
                  backgroundColor: `${getPriorityColor()}20`,
                  color: getPriorityColor(),
                }}
              >
                {task.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 transition-colors duration-300">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <div className="flex items-center gap-3">
              {/* Due date */}
              {task.dueDate && (
                <div
                  className={`flex items-center gap-1 transition-colors duration-300 ${
                    isTaskOverdue ? 'text-red-600 dark:text-red-400' : isTaskDueToday ? 'text-yellow-600 dark:text-yellow-400' : ''
                  }`}
                >
                  <FiCalendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isTaskOverdue && <span className="text-red-600 dark:text-red-400 font-medium transition-colors duration-300">(Overdue)</span>}
                  {isTaskDueToday && <span className="text-yellow-600 dark:text-yellow-400 font-medium transition-colors duration-300">(Due Today)</span>}
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor() }}
                />
                <span className="capitalize">
                  {TASK_STATUSES.find(s => s.value === task.status)?.label}
                </span>
              </div>
            </div>

            {/* Created date */}
            <div className="flex items-center gap-1">
              <FiClock className="h-3 w-3" />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <button
            onClick={handleEdit}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 rounded"
            title="Edit task"
          >
            <FiEdit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300 rounded"
            title="Delete task"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};