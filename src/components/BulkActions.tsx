import React, { useState } from 'react';
import { TaskStatus } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { TASK_STATUSES } from '@/constants';
import {
  FiCheck,
  FiSquare,
  FiTrash2,
  FiEdit,
  FiChevronDown,
  FiX,
} from 'react-icons/fi';

export const BulkActions: React.FC = () => {
  const {
    tasks,
    selectedTasks,
    selectAllTasks,
    clearSelection,
    bulkDelete,
    bulkUpdateStatus,
    loading,
  } = useTaskContext();

  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const allSelected = selectedTasks.length === tasks.length && tasks.length > 0;
  const someSelected = selectedTasks.length > 0;

  const handleSelectAll = () => {
    selectAllTasks();
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)?`)) {
      await bulkDelete();
    }
  };

  const handleBulkStatusUpdate = async (status: TaskStatus) => {
    await bulkUpdateStatus(status);
    setShowStatusMenu(false);
  };

  if (!someSelected) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Select all/none toggle */}
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 transition-colors"
          >
            {allSelected ? (
              <>
                <FiCheck className="h-4 w-4" />
                <span>Deselect all</span>
              </>
            ) : (
              <>
                <FiSquare className="h-4 w-4" />
                <span>Select all ({tasks.length})</span>
              </>
            )}
          </button>

          {/* Selected count */}
          <span className="text-sm text-blue-600 font-medium">
            {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
          </span>
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-2">
          {/* Status update dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiEdit className="h-4 w-4" />
              <span>Change Status</span>
              <FiChevronDown className="h-3 w-3" />
            </button>

            {showStatusMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[160px]">
                {TASK_STATUSES.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleBulkStatusUpdate(status.value)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span>{status.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bulk delete */}
          <button
            onClick={handleBulkDelete}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiTrash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>

          {/* Clear selection */}
          <button
            onClick={clearSelection}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear selection"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};