'use client';

import { TaskForm } from '@/components/task/TaskForm';
import { TaskList } from '@/components/task/TaskList';
import { useTasks } from '@/hooks/data/useTasksQuery';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const { data: tasks, isLoading, isError, error, refetch } = useTasks();

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Minhas Tarefas</h1>

      <TaskForm onSuccess={refetch} projectId={projectId} />

      {isLoading && <p>Carregando tarefas...</p>}
      {isError && <p>Erro ao carregar tarefas: {String(error)}</p>}

      {tasks && <TaskList tasks={tasks} />}
    </div>
  );
}
