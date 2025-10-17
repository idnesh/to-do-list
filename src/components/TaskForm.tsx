import React, { useState, useEffect } from 'react';
import { TaskFormData, TaskPriority } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { validateTaskForm } from '@/utils';
import { TASK_PRIORITIES, DEFAULT_TAGS } from '@/constants';
import { FiPlus, FiX, FiCalendar, FiFlag, FiTag } from 'react-icons/fi';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<TaskFormData>;
  mode?: 'create' | 'edit';
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  initialData,
  mode = 'create',
}) => {
  const { addTask, loading } = useTaskContext();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: undefined,
    tags: [],
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        priority: initialData?.priority || 'medium',
        dueDate: initialData?.dueDate,
        tags: initialData?.tags || [],
      });
      setErrors([]);
      setNewTag('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateTaskForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await addTask(formData);
      onClose();
    } catch (error) {
      setErrors(['Failed to create task. Please try again.']);
    }
  };

  const handleInputChange = (
    field: keyof TaskFormData,
    value: string | Date | TaskPriority | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      handleInputChange('tags', [...formData.tags, trimmedTag]);
    }
    setNewTag('');
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag(newTag);
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
    }
  };

  const getFilteredTagSuggestions = () => {
    const query = newTag.toLowerCase();
    return DEFAULT_TAGS.filter(
      tag =>
        tag.toLowerCase().includes(query) &&
        !formData.tags.includes(tag)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto" style={{ height: '100%', maxHeight: 'calc(100vh - 120px)' }}>
          {/* Error display */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              <FiFlag className="inline h-4 w-4 mr-1" />
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              <FiCalendar className="inline h-4 w-4 mr-1" />
              Due Date
            </label>
            <input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate ? formData.dueDate.toISOString().slice(0, 16) : ''}
              onChange={(e) =>
                handleInputChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiTag className="inline h-4 w-4 mr-1" />
              Tags
            </label>

            {/* Existing tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag input */}
            <div className="relative">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onFocus={() => setShowTagSuggestions(true)}
                placeholder="Add tags..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Tag suggestions */}
              {showTagSuggestions && newTag && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                  {getFilteredTagSuggestions().map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                  {newTag.trim() && !DEFAULT_TAGS.includes(newTag.toLowerCase()) && (
                    <button
                      type="button"
                      onClick={() => handleAddTag(newTag)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-blue-600"
                    >
                      Create "{newTag.trim()}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus className="h-4 w-4" />
                  {mode === 'create' ? 'Create Task' : 'Update Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};