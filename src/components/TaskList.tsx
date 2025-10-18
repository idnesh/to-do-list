import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Task } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { TaskItem } from './TaskItem';
import { FiInbox, FiSearch } from 'react-icons/fi';

interface SortableTaskItemProps {
  task: Task;
  isSelected: boolean;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({ task, isSelected }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <TaskItem
        task={task}
        isSelected={isSelected}
        isDragging={isDragging}
      />
    </div>
  );
};

interface TaskListProps {
  searchQuery?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ searchQuery }) => {
  const { tasks, selectedTasks, reorderTasks, loading, error } = useTaskContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string);
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
            <FiInbox className="w-6 h-6 text-red-600 dark:text-red-400" />
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
            {searchQuery ? (
              <FiSearch className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            ) : (
              <FiInbox className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            )}
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              isSelected={selectedTasks.includes(task.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};