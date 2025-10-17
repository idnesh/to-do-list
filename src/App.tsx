import React, { useState } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import { TaskTable } from '@/components/TaskTable';
import { TaskForm } from '@/components/TaskForm';
import { TaskFiltersComponent } from '@/components/TaskFilters';
import { BulkActions } from '@/components/BulkActions';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTaskContext } from '@/context/TaskContext';
import { KeyboardShortcut } from '@/types';
import {
  FiPlus,
  FiHelpCircle,
  FiX,
  FiCheckSquare,
} from 'react-icons/fi';

const AppContent: React.FC = () => {
  const { searchParams } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);


  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrlKey: true,
      action: () => setIsTaskFormOpen(true),
      description: 'Create new task',
    },
    {
      key: '/',
      action: () => setShowHelp(true),
      description: 'Show keyboard shortcuts',
    },
    {
      key: 'Escape',
      action: () => {
        setIsTaskFormOpen(false);
        setShowHelp(false);
      },
      description: 'Close modals',
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FiCheckSquare className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filters and search */}
          <TaskFiltersComponent />

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Add task button */}
              <button
                onClick={() => setIsTaskFormOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="New task (Ctrl+N)"
              >
                <FiPlus className="h-4 w-4" />
                <span>New Task</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Help button */}
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                title="Keyboard shortcuts (/)"
              >
                <FiHelpCircle className="h-4 w-4" />
                <span>Help</span>
              </button>
            </div>
          </div>

          {/* Bulk actions */}
          <BulkActions />

          {/* Task table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <TaskTable searchQuery={searchParams.query} />
          </div>

          {/* Task creation form */}
          <TaskForm
            isOpen={isTaskFormOpen}
            onClose={() => setIsTaskFormOpen(false)}
            mode="create"
          />

          {/* Keyboard shortcuts help modal */}
          {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.ctrlKey && (
                        <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">
                          Ctrl
                        </kbd>
                      )}
                      {shortcut.altKey && (
                        <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">
                          Alt
                        </kbd>
                      )}
                      {shortcut.shiftKey && (
                        <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">
                          Shift
                        </kbd>
                      )}
                      <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded">
                        {shortcut.key}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
          )}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;