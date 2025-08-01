'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Task } from '@/types/Task';
import { useTaskStore } from '@/stores/useTaskStore';
import { useUpdateTask } from '@/hooks/data/useTasksQuery';
import { FaCheckCircle } from 'react-icons/fa';

interface StudyCardProps {
  task: Task;
}

export function StudyCard({ task }: StudyCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { setSelectedTask, setEditingTask, setEditDrawerOpen } = useTaskStore();
  const updateTask = useUpdateTask();

  const isDone = task.status === 'DONE';
  const willBeDone = !isDone && isCompleting;

  const toggleTaskStatus = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    e.stopPropagation?.();

    if (!isDone) {
      setIsCompleting(true);

      setTimeout(() => {
        updateTask.mutate({
          id: task.id,
          status: 'DONE',
          doneAt: new Date().toISOString(),
        });
        setIsCompleting(false);
      }, 600);
    } else {
      updateTask.mutate({
        id: task.id,
        status: 'TODO',
        doneAt: undefined,
      });
    }
  };

  const handleCardClick = () => {
    setSelectedTask(task);
    setEditingTask(task.id);
    setEditDrawerOpen(true);
  };

  const formatHour = (dateString?: string) => {
    if (!dateString) return 'Aberto';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`relative py-1 px-4 rounded-lg shadow-sm transition-colors duration-500 cursor-pointer ${getStatusColor(task.status)}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <motion.div
          className="flex-1"
          animate={{
            opacity: willBeDone ? 0.4 : 1,
            filter: willBeDone ? 'brightness(0.7)' : 'brightness(1)',
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.h3 className="text-md font-semibold mb-1 relative overflow-hidden">
            <span
              className={cn(
                'inline-block relative z-10 transition-all duration-300 text-sm',
                (isDone || willBeDone) && 'line-through opacity-70'
              )}
            >
              {task.name}
            </span>
            {willBeDone && (
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute left-0 top-1/2 h-[2px] w-full bg-green-700 origin-left z-0"
              />
            )}
          </motion.h3>

          <div className="flex items-center gap-4 text-xs mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {task.startDate && task.dueDate
                  ? `${formatHour(task.startDate)} - ${formatHour(task.dueDate)}`
                  : task.startDate
                    ? formatHour(task.startDate)
                    : task.dueDate
                      ? formatHour(task.dueDate)
                      : 'Aberto'}
              </span>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.status === 'IN_PROGRESS' && (
              <Badge className="bg-purple-600 text-white text-xs">Em Andamento</Badge>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className={`w-8 h-8 rounded-full mt-2 flex items-center justify-center cursor-pointer border-2 ${
            isDone ? 'text-white' : 'border-current text-current'
          }`}
          onClick={toggleTaskStatus}
          title={isDone ? 'Desmarcar como concluída' : 'Marcar como concluída'}
          role="checkbox"
          aria-checked={isDone}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleTaskStatus(e);
            }
          }}
        >
          {(isDone || willBeDone) && <FaCheckCircle className="w-8 h-8 text-green-800" />}
        </motion.div>
      </div>
    </motion.div>
  );
}

function getStatusColor(status: Task['status']) {
  switch (status) {
    case 'TODO':
      return 'bg-[#83B7F3] hover:bg-[#83B7F3]/40 text-[#1E3A8A] dark:text-[#072059] shadow-[#83B7F3]/10';
    case 'IN_PROGRESS':
      return 'bg-[#D899EF] hover:bg-[#D899EF]/40 text-[#5D2E70] dark:text-[#440E58] shadow-[#D899EF]/10';
    case 'DONE':
      return 'bg-[#85E889] hover:bg-[#85E889]/40 text-[#1B5E20] dark:text-[#07590A] shadow-[#85E889]/10';
    default:
      return 'bg-slate-500 text-white';
  }
}
