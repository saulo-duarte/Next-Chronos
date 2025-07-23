'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useCreateTask } from '@/hooks/data/useTasksQuery';

interface TaskFormProps {
  onSuccess: () => void;
  projectId?: string;
}

export function TaskForm({ onSuccess, projectId }: TaskFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'PROJECT' | 'STUDY' | 'EVENT'>('PROJECT');

  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTask.mutateAsync({
        name,
        type,
        status: 'TODO',
        priority: 'MEDIUM',
        projectId,
      });

      onSuccess();
      setName('');
      setType('PROJECT');
    } catch (err) {
      console.error('Erro ao criar task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <Input
        placeholder="Nome da tarefa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Select
        value={type}
        onValueChange={(value) => setType(value as 'PROJECT' | 'STUDY' | 'EVENT')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tipo de tarefa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PROJECT">Projeto</SelectItem>
          <SelectItem value="STUDY">Estudo</SelectItem>
          <SelectItem value="EVENT">Evento</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" disabled={createTask.isPending}>
        {createTask.isPending ? 'Criando...' : 'Criar tarefa'}
      </Button>
    </form>
  );
}
