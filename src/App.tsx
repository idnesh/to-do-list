import React, { useState, useCallback } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { TaskTable } from '@/components/TaskTable';
import { TaskForm } from '@/components/TaskForm';
import { TaskFiltersComponent } from '@/components/TaskFilters';
import { BulkActions } from '@/components/BulkActions';
import { HomePage } from '@/components/HomePage';
import { LoginForm } from '@/components/LoginForm';
import { SignupForm } from '@/components/SignupForm';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { KeyboardShortcut } from '@/types';
import { debounce } from '@/utils';
import {
  FiPlus,
  FiHelpCircle,
  FiX,
  FiCheckSquare,
  FiSearch,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { searchParams, setSearchQuery } = useTaskContext();
  const { toggleTheme } = useTheme();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.query || '');

  const debouncedSetSearchQuery = useCallback(
    debounce((query: string) => setSearchQuery(query), 300),
    [setSearchQuery]
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSetSearchQuery(value);
  };

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrlKey: true,
      action: () => setIsTaskFormOpen(true),
      description: 'Create new task',
    },
    {
      key: 't',
      ctrlKey: true,
      shiftKey: true,
      action: () => toggleTheme(),
      description: 'Toggle theme',
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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FiCheckSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 transition-colors" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">TodoPro</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-3">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors">Welcome, {user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                title="Sign out"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left sidebar - Filters */}
          <div className="w-80 flex-shrink-0">
            <TaskFiltersComponent />
          </div>

          {/* Right content area */}
          <div className="flex-1 space-y-6">
            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Add task button */}
                <button
                  onClick={() => setIsTaskFormOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  title="Keyboard shortcuts (/)"
                >
                  <FiHelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </button>
              </div>
            </div>

            {/* Search tasks */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 transition-colors" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Bulk actions */}
            <BulkActions />

            {/* Task table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <TaskTable searchQuery={searchParams.query} />
            </div>
          </div>
        </div>

        {/* Task creation form */}
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          mode="create"
        />

        {/* Keyboard shortcuts help modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transition-colors duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.ctrlKey && (
                          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors">
                            Ctrl
                          </kbd>
                        )}
                        {shortcut.altKey && (
                          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors">
                            Alt
                          </kbd>
                        )}
                        {shortcut.shiftKey && (
                          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors">
                            Shift
                          </kbd>
                        )}
                        <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors">
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
      </main>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleShowSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedRoute
          fallback={
            <>
              <HomePage
                onLogin={handleShowLogin}
                onSignup={handleShowSignup}
              />
              <LoginForm
                isOpen={showLogin}
                onClose={handleCloseModals}
                onSwitchToSignup={handleSwitchToSignup}
              />
              <SignupForm
                isOpen={showSignup}
                onClose={handleCloseModals}
                onSwitchToLogin={handleSwitchToLogin}
              />
            </>
          }
        >
          <AuthenticatedApp />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;