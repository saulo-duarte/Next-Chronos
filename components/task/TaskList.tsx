'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/Task';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskListProps {
  todoTasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
}

function sortByDueDate(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function TaskList({ todoTasks, inProgressTasks, completedTasks }: TaskListProps) {
  const [collapsedGroups, setCollapsedGroups] = useState({
    todo: false,
    inProgress: false,
    completed: false,
  });

  const [showAll, setShowAll] = useState({
    todo: false,
    inProgress: false,
    completed: false,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
  };

  const sections = useMemo(
    () =>
      [
        { key: 'todo', title: 'A Fazer', tasks: sortByDueDate(todoTasks) },
        { key: 'inProgress', title: 'Em Progresso', tasks: sortByDueDate(inProgressTasks) },
        { key: 'completed', title: 'Finalizado', tasks: sortByDueDate(completedTasks) },
      ] as { key: keyof typeof collapsedGroups; title: string; tasks: Task[] }[],
    [todoTasks, inProgressTasks, completedTasks]
  );

  const toggleCollapse = (key: keyof typeof collapsedGroups) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleShowAll = (key: keyof typeof showAll) => {
    setShowAll((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      className="px-4 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sections.map(({ key, title, tasks }) => {
        if (tasks.length === 0) return null;
        const collapsed = collapsedGroups[key];
        const showingAll = showAll[key];
        const visibleTasks = showingAll ? tasks : tasks.slice(0, 3);

        return (
          <motion.div key={key} className="mb-8" variants={itemVariants}>
            <div
              className={cn(
                'flex items-center justify-between mb-3 py-2 bg-slate-900/90 backdrop-blur-sm',
                'sticky top-[0px] z-20 border-b border-slate-800'
              )}
            >
              <button
                onClick={() => toggleCollapse(key)}
                className="flex items-center gap-2 text-slate-300 font-semibold hover:text-white transition-colors"
              >
                {collapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {title}
                <span className="text-sm text-slate-500 ml-1">({tasks.length})</span>
              </button>

              {!collapsed && tasks.length > 3 && (
                <Button
                  onClick={() => toggleShowAll(key)}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {showingAll ? 'Mostrar menos' : 'Mostrar mais'}
                </Button>
              )}
            </div>

            {/* Lista de tasks */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                  className="grid gap-3 transition-all"
                >
                  {visibleTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {todoTasks.length === 0 && inProgressTasks.length === 0 && completedTasks.length === 0 && (
        <motion.div className="text-center text-slate-400 py-12" variants={itemVariants}>
          <p>Nenhuma task encontrada</p>
          <p className="text-sm mt-2">Clique no botão + para adicionar uma nova task</p>
        </motion.div>
      )}
    </motion.div>
  );
}
