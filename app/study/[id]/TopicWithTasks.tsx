'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useTasksByTopic } from '@/hooks/data/useTasksQuery';
import { StudyCard } from '../components/StudyCard';
import { Task } from '@/types/Task';
import { useTaskStore } from '@/stores/useTaskStore';

type Props = {
  topicId: string;
  name: string;
  description?: string;
};

export function TopicWithTasks({ topicId, name, description }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const { data: tasks = [], isLoading } = useTasksByTopic(topicId);
  const { setModalOpen, setSelectedTopicId } = useTaskStore();

  const handleCreateTask = () => {
    setSelectedTopicId(topicId);
    setModalOpen(true);
  };

  const progress = tasks.length
    ? (tasks.filter((task) => task.status === 'DONE').length / tasks.length) * 100
    : 0;

  return (
    <div className="space-y-3 border-b border-gray-700 pb-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed((prev) => !prev)}
          className="h-auto text-gray-400 hover:text-white hover:bg-gray-800 -mr-3"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{name}</h2>
            <Button size="sm" onClick={handleCreateTask}>
              <Plus className="w-4 h-4" />
              Task
            </Button>
          </div>

          <p className="text-sm text-gray-400 mb-2">{description}</p>

          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1 h-2 bg-gray-700" />
            <span className="text-sm text-gray-400 min-w-fit">
              {tasks.filter((t) => t.status === 'DONE').length}/{tasks.length}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 ml-7"
          >
            {isLoading ? (
              <div className="text-gray-400">Carregando tarefas...</div>
            ) : (
              tasks.map((task: Task) => <StudyCard key={task.id} task={task} />)
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
