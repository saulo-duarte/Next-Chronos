'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/task/TaskList';
import { FilterSheet } from '@/components/task/TaskFIlterSheet';
import { Task } from '@/types/Task';
import { FaFilter } from 'react-icons/fa';
import { MdAssignmentAdd } from 'react-icons/md';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { EventDialog } from '@/components/event-dialog';
import { useParams } from 'next/navigation';
import { useTaskStore } from '@/stores/useTaskStore';
import { useFilteredProjectTasks } from '@/hooks/data/useProjectsTasks';
import { TaskEditDialog } from '@/components/task/TaskEditDialog';
import { useProject } from '@/hooks/data/useProjectQuery';
import { AppHeader } from '@/components/AppHeader';
import { FaSuitcase } from 'react-icons/fa6';

export default function TasksPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const params = useParams();
  const projectId = typeof params.id === 'string' ? params.id : undefined;
  const setModalOpen = useTaskStore((state) => state.setModalOpen);
  const filters = useTaskStore((state) => state.filters);
  const { tasks = [] } = useFilteredProjectTasks(projectId, filters);
  const { data: project } = projectId ? useProject(projectId) : { data: null };
  const selectedProjectTitle = project?.title || 'Projeto';

  const tasksByStatus = useMemo(() => {
    const group = {
      todo: [] as Task[],
      inProgress: [] as Task[],
      completed: [] as Task[],
    };

    (Array.isArray(tasks) ? tasks : []).forEach((task) => {
      if (task.status === 'TODO') group.todo.push(task);
      else if (task.status === 'IN_PROGRESS') group.inProgress.push(task);
      else if (task.status === 'DONE') group.completed.push(task);
    });

    return group;
  }, [tasks]);

  const breadcrumbs = [
    {
      label: 'Projetos',
      href: '/projetos',
      icon: <FaSuitcase size={16} className="mr-2" />,
      isCurrent: false,
    },
    {
      label: selectedProjectTitle,
      isCurrent: true,
    },
  ];

  return (
    <>
      <AppHeader breadcrumbs={breadcrumbs} />
      <div className="h-screen flex flex-col bg-background">
        <div className="sticky top-0 z-40 bg-background px-4 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (window.location.href = '/projetos')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-semibold">{selectedProjectTitle}</h1>
          </div>

          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="w-full bg-background">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
              <TabsTrigger value="archives">Arquivos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <Tabs defaultValue="tasks">
            <TabsContent value="tasks">
              <TaskList
                todoTasks={tasksByStatus.todo}
                inProgressTasks={tasksByStatus.inProgress}
                completedTasks={tasksByStatus.completed}
              />
            </TabsContent>

            <TabsContent value="statistics">
              <div className="text-center text-slate-400 py-8">Estatísticas em desenvolvimento</div>
            </TabsContent>

            <TabsContent value="archives">
              <div className="text-center text-slate-400 py-8">Arquivos em desenvolvimento</div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="fixed bottom-20 right-6 flex flex-col gap-3 z-50">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-[54px] w-[54px]"
          >
            <button
              className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
              onClick={() => setIsFilterOpen(true)}
            >
              <FaFilter size={24} />
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-[54px] w-[54px]"
          >
            <button
              className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <MdAssignmentAdd size={28} />
            </button>
          </motion.div>
        </div>

        {projectId && <EventDialog taskType="PROJECT" projectId={projectId} />}
        <FilterSheet open={isFilterOpen} onOpenChange={setIsFilterOpen} />
        <MobileBottomNav />

        <TaskEditDialog />
      </div>
    </>
  );
}
