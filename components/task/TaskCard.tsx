'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/Task';
import { useUpdateTask } from '@/hooks/data/useTasksQuery';
import { useTaskStore } from '@/stores/useTaskStore';
import { cn } from '@/lib/utils';
import { FaArrowDown } from 'react-icons/fa6';
import { IoFlagSharp, IoWarning } from 'react-icons/io5';

interface TaskCardProps {
  task: Task;
}

function formatDate(dateString?: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export function TaskCard({ task }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const [isCompleting, setIsCompleting] = useState(false);

  const setSelectedTask = useTaskStore((state) => state.setSelectedTask);
  const setModalOpen = useTaskStore((state) => state.setModalOpen);

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
    setSelectedTask(task.id);
    setModalOpen(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-lg mb-3 shadow-sm transition-colors duration-500 ${getStatusColor(task.status)}`}
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
                'inline-block relative z-10 transition-all duration-300',
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

          <p
            className={`text-xs font-medium line-clamp-2 mb-2 ${getTitleColor(task.status)} ${
              willBeDone ? 'opacity-60' : 'opacity-80'
            }`}
          >
            {task.description}
          </p>

          <div className="flex items-center gap-2 text-xs font-medium">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">{formatDate(task.dueDate)}</span>
            <Badge className="bg-transparent">
              {getPriorityIcon(task.priority)}
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-2 ${
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
          {(isDone || willBeDone) && <FaCheckCircle className="w-6 h-6 text-green-800" />}
        </motion.div>
      </div>
    </motion.div>
  );
}

function getTitleColor(status: Task['status']) {
  switch (status) {
    case 'TODO':
      return 'text-[#1E3A8A]';
    case 'IN_PROGRESS':
      return 'text-[#5D2E70]';
    case 'DONE':
      return 'text-green-800';
    default:
      return 'text-slate-700';
  }
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

function getPriorityIcon(priority: Task['priority']) {
  switch (priority) {
    case 'HIGH':
      return <IoWarning className="w-3 h-3" />;
    case 'MEDIUM':
      return <IoFlagSharp className="w-3 h-3" />;
    case 'LOW':
      return <FaArrowDown className="w-3 h-3" />;
    default:
      return null;
  }
}

function getPriorityLabel(priority: Task['priority']) {
  switch (priority) {
    case 'HIGH':
      return 'Alta';
    case 'MEDIUM':
      return 'Média';
    case 'LOW':
      return 'Baixa';
    default:
      return 'Normal';
  }
}
