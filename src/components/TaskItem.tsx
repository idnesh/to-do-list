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
        return <FiCheck className="text-green-500" />;
      case 'in_progress':
        return <FiPlay className="text-blue-500" />;
      default:
        return <FiPause className="text-gray-500" />;
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
        task-item bg-white border rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-200'}
        ${isDragging ? 'opacity-50 transform rotate-1' : ''}
        ${task.status === 'completed' ? 'opacity-75' : ''}
        ${isTaskOverdue ? 'border-l-4 border-l-red-500' : ''}
        ${isTaskDueToday ? 'border-l-4 border-l-yellow-500' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelect}
          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />

        {/* Task content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleToggleStatus}
              className="flex-shrink-0 hover:scale-110 transition-transform"
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
                className="flex-1 text-lg font-medium border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                autoFocus
              />
            ) : (
              <h3
                className={`flex-1 text-lg font-medium cursor-pointer hover:text-blue-600 transition-colors ${
                  task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
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
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              {/* Due date */}
              {task.dueDate && (
                <div
                  className={`flex items-center gap-1 ${
                    isTaskOverdue ? 'text-red-600' : isTaskDueToday ? 'text-yellow-600' : ''
                  }`}
                >
                  <FiCalendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isTaskOverdue && <span className="text-red-600 font-medium">(Overdue)</span>}
                  {isTaskDueToday && <span className="text-yellow-600 font-medium">(Due Today)</span>}
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
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Edit task"
          >
            <FiEdit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};