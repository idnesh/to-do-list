import React, { useState } from 'react';
import { FiX, FiBell, FiClock } from 'react-icons/fi';

interface ReminderModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: (reminderTime: Date) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [reminderTime, setReminderTime] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const quickOptions = [
    { label: 'In 15 minutes', value: 15 },
    { label: 'In 30 minutes', value: 30 },
    { label: 'In 1 hour', value: 60 },
    { label: 'In 2 hours', value: 120 },
    { label: 'Tomorrow at 9 AM', value: 'tomorrow' },
    { label: 'Custom time', value: 'custom' },
  ];

  const handleQuickSelect = (option: typeof quickOptions[0]) => {
    setErrors([]);
    if (option.value === 'custom') {
      setReminderTime('custom');
    } else if (option.value === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setCustomTime(tomorrow.toISOString().slice(0, 16));
      setReminderTime('custom');
    } else {
      const now = new Date();
      now.setMinutes(now.getMinutes() + (option.value as number));
      setCustomTime(now.toISOString().slice(0, 16));
      setReminderTime(option.label);
    }
  };

  const handleConfirm = () => {
    setErrors([]);

    let selectedTime: Date;

    if (reminderTime === 'custom' || customTime) {
      if (!customTime) {
        setErrors(['Please select a reminder time']);
        return;
      }
      selectedTime = new Date(customTime);
    } else {
      // Handle quick options
      const selectedOption = quickOptions.find(opt => opt.label === reminderTime);
      if (!selectedOption) {
        setErrors(['Please select a reminder time']);
        return;
      }

      if (selectedOption.value === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        selectedTime = tomorrow;
      } else {
        const now = new Date();
        now.setMinutes(now.getMinutes() + (selectedOption.value as number));
        selectedTime = now;
      }
    }

    // Validate that the time is in the future
    if (selectedTime <= new Date()) {
      setErrors(['Reminder time must be in the future']);
      return;
    }

    onConfirm(selectedTime);
    handleReset();
  };

  const handleReset = () => {
    setReminderTime('');
    setCustomTime('');
    setErrors([]);
  };

  const handleCancel = () => {
    onCancel();
    handleReset();
  };

  if (!isOpen) return null;

  const now = new Date();
  const minDateTime = new Date(now.getTime() + 60000).toISOString().slice(0, 16); // 1 minute from now

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <FiBell className="h-5 w-5 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Set Reminder</h2>
          </div>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            When would you like to be reminded about this task?
          </p>

          <div className="bg-gray-50 rounded-lg p-3 border mb-6">
            <h4 className="font-medium text-gray-900 mb-1">Task:</h4>
            <p className="text-sm text-gray-700 truncate" title={taskTitle}>
              {taskTitle}
            </p>
          </div>

          {/* Error display */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick options */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-gray-700">Quick Options:</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleQuickSelect(option)}
                  className={`p-3 text-left border rounded-lg transition-colors hover:bg-gray-50 ${
                    reminderTime === option.label
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom time input */}
          {(reminderTime === 'custom' || customTime) && (
            <div className="space-y-2">
              <label htmlFor="customTime" className="block text-sm font-medium text-gray-700">
                Select specific date and time:
              </label>
              <input
                id="customTime"
                type="datetime-local"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                min={minDateTime}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (!reminderTime && !customTime)}
            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting...
              </>
            ) : (
              <>
                <FiBell className="h-4 w-4" />
                Set Reminder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};