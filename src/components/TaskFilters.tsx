import React, { useState } from 'react';
import { TaskFilters, TaskSort, TaskStatus, TaskPriority } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { TASK_STATUSES, TASK_PRIORITIES, SORT_OPTIONS } from '@/constants';
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';

export const TaskFiltersComponent: React.FC = () => {
  const { searchParams, setSearchQuery, setFilters, setSort, clearFilters, tasks } = useTaskContext();
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.query || '');

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
    setSearchQuery(query);
  };

  const handleStatusFilterChange = (status: TaskStatus, checked: boolean) => {
    const currentStatuses = searchParams.filters?.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);

    setFilters({
      ...searchParams.filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handlePriorityFilterChange = (priority: TaskPriority, checked: boolean) => {
    const currentPriorities = searchParams.filters?.priority || [];
    const newPriorities = checked
      ? [...currentPriorities, priority]
      : currentPriorities.filter(p => p !== priority);

    setFilters({
      ...searchParams.filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined,
    });
  };

  const handleTagFilterChange = (tag: string, checked: boolean) => {
    const currentTags = searchParams.filters?.tags || [];
    const newTags = checked
      ? [...currentTags, tag]
      : currentTags.filter(t => t !== tag);

    setFilters({
      ...searchParams.filters,
      tags: newTags.length > 0 ? newTags : undefined,
    });
  };

  const getAvailableTags = () => {
    const allTags = new Set<string>();
    tasks.forEach(task => {
      task.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  const handleSortChange = (field: string, value: string) => {
    const currentSort = searchParams.sort || { by: 'createdAt', order: 'desc' };
    const newSort = { ...currentSort, [field]: value } as TaskSort;
    setSort(newSort);
  };

  const getActiveFiltersCount = () => {
    const filters = searchParams.filters || {};
    let count = 0;
    if (filters.status?.length) count += filters.status.length;
    if (filters.priority?.length) count += filters.priority.length;
    if (filters.tags?.length) count += filters.tags.length;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0 || searchParams.query;

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col gap-4">
        {/* Search bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter and sort controls */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                showFilters || getActiveFiltersCount() > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiFilter className="h-4 w-4" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
              <FiChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <FiX className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={searchParams.sort?.by || 'createdAt'}
              onChange={(e) => handleSortChange('by', e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                handleSortChange('order', searchParams.sort?.order === 'asc' ? 'desc' : 'asc')
              }
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
              title={`Sort ${searchParams.sort?.order === 'asc' ? 'descending' : 'ascending'}`}
            >
              {searchParams.sort?.order === 'asc' ? (
                <FiArrowUp className="h-4 w-4" />
              ) : (
                <FiArrowDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Filter panels */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Progress filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Progress</h4>
              <div className="space-y-2">
                {TASK_STATUSES.map((status) => (
                  <label key={status.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={searchParams.filters?.status?.includes(status.value) || false}
                      onChange={(e) => handleStatusFilterChange(status.value, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
              <div className="space-y-2">
                {TASK_PRIORITIES.map((priority) => (
                  <label key={priority.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={searchParams.filters?.priority?.includes(priority.value) || false}
                      onChange={(e) => handlePriorityFilterChange(priority.value, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className="text-sm font-medium px-2 py-0.5 rounded-full capitalize"
                      style={{
                        backgroundColor: `${priority.color}20`,
                        color: priority.color,
                      }}
                    >
                      {priority.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {getAvailableTags().map((tag) => (
                  <label key={tag} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={searchParams.filters?.tags?.includes(tag) || false}
                      onChange={(e) => handleTagFilterChange(tag, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  </label>
                ))}
                {getAvailableTags().length === 0 && (
                  <span className="text-sm text-gray-400">No tags available</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};