'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/Task';

interface TaskListProps {
  todoTasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
}

export function TaskList({ todoTasks, inProgressTasks, completedTasks }: TaskListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="px-4 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {todoTasks.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-3 text-slate-300">
            A fazer <span className="text-sm text-slate-500">{todoTasks.length}</span>
          </h2>
          <AnimatePresence>
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {inProgressTasks.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-3 text-slate-300">
            Em Progresso <span className="text-sm text-slate-500">{inProgressTasks.length}</span>
          </h2>
          <AnimatePresence>
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {completedTasks.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-3 text-slate-300">
            Finalizado <span className="text-sm text-slate-500">{completedTasks.length}</span>
          </h2>
          <AnimatePresence>
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {todoTasks.length === 0 && inProgressTasks.length === 0 && completedTasks.length === 0 && (
        <motion.div className="text-center text-slate-400 py-12" variants={itemVariants}>
          <p>Nenhuma task encontrada</p>
          <p className="text-sm mt-2">Clique no botão + para adicionar uma nova task</p>
        </motion.div>
      )}
    </motion.div>
  );
}
