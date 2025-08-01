'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock } from 'lucide-react';
import { useUpdateTask, useDeleteTask } from '@/hooks/data/useTasksQuery';
import type { TaskStatus, TaskType, TaskPriority } from '@/types/Task';
import { toast } from 'sonner';
import { getPriorityBadge, getStatusBadge, getTaskTypeIcon } from '@/components/utils';
import { useTaskStore } from '@/stores/useTaskStore';

interface TaskFormData {
  name: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  startDate: string;
  startTime: string;
  dueDate: string;
  dueTime: string;
}

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

const DateTimeSelector = ({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  label: string;
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}) => {
  const [dateOpen, setDateOpen] = useState(false);

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-200">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal bg-slate-800 border-slate-700 text-white hover:bg-slate-700',
                !date && 'text-slate-400'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDateForDisplay(date) : 'Data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={(selectedDate) => {
                onDateChange(selectedDate ? selectedDate.toISOString() : '');
                setDateOpen(false);
              }}
              className="text-white"
            />
          </PopoverContent>
        </Popover>

        <Select value={time} onValueChange={onTimeChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-full">
            <Clock className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Horário" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 max-h-48">
            {TIME_OPTIONS.map((timeOption) => (
              <SelectItem key={timeOption} value={timeOption} className="text-white">
                {timeOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const StatusPrioritySelector = ({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: {
  status: TaskStatus;
  priority: TaskPriority;
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
}) => {
  const statusOptions = [
    { value: 'TODO' as TaskStatus, label: 'A fazer', badge: getStatusBadge('TODO') },
    {
      value: 'IN_PROGRESS' as TaskStatus,
      label: 'Em progresso',
      badge: getStatusBadge('IN_PROGRESS'),
    },
    { value: 'DONE' as TaskStatus, label: 'Concluído', badge: getStatusBadge('DONE') },
  ];

  const priorityOptions = [
    { value: 'LOW' as TaskPriority, label: 'Baixa', badge: getPriorityBadge('LOW') },
    { value: 'MEDIUM' as TaskPriority, label: 'Média', badge: getPriorityBadge('MEDIUM') },
    { value: 'HIGH' as TaskPriority, label: 'Alta', badge: getPriorityBadge('HIGH') },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-slate-200">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {statusOptions.map(({ value, label, badge }) => (
              <SelectItem key={value} value={value} className="text-white">
                <div className="flex items-center gap-2">
                  {badge.icon}
                  <span>{label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-200">Prioridade</Label>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {priorityOptions.map(({ value, label, badge }) => (
              <SelectItem key={value} value={value} className="text-white">
                <div className="flex items-center gap-2">
                  {badge.icon}
                  <span>{label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export function TaskEditDrawer() {
  const { isEditDrawerOpen, editingTaskId, setEditDrawerOpen, setEditingTask, selectedTask } =
    useTaskStore();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const parseDateTime = (isoString: string) => {
    if (!isoString) return { date: '', time: '' };
    const date = new Date(isoString);
    return {
      date: date.toISOString(),
      time: format(date, 'HH:mm'),
    };
  };

  const combineDateTime = (date: string, time: string) => {
    if (!date) return '';
    if (!time) return date;

    const dateObj = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    dateObj.setHours(hours, minutes, 0, 0);
    return dateObj.toISOString();
  };

  const getInitialFormData = (): TaskFormData => {
    if (!selectedTask) {
      return {
        name: '',
        description: '',
        status: 'TODO',
        type: 'PROJECT',
        priority: 'MEDIUM',
        startDate: '',
        startTime: '',
        dueDate: '',
        dueTime: '',
      };
    }

    const startDateTime = parseDateTime(selectedTask.startDate || '');
    const dueDateTime = parseDateTime(selectedTask.dueDate || '');

    return {
      name: selectedTask.name,
      description: selectedTask.description || '',
      status: selectedTask.status,
      type: selectedTask.type,
      priority: selectedTask.priority,
      startDate: startDateTime.date,
      startTime: startDateTime.time,
      dueDate: dueDateTime.date,
      dueTime: dueDateTime.time,
    };
  };

  const [formData, setFormData] = useState<TaskFormData>(getInitialFormData);

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [selectedTask]);

  const handleClose = () => {
    setEditDrawerOpen(false);
    setEditingTask(null);
  };

  const handleSave = async () => {
    if (!editingTaskId || !formData.name.trim()) {
      toast.error('Nome da tarefa é obrigatório');
      return;
    }

    const startDateTime = combineDateTime(formData.startDate, formData.startTime);
    const dueDateTime = combineDateTime(formData.dueDate, formData.dueTime);

    await updateTask.mutateAsync({
      id: selectedTask!.id,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      startDate: startDateTime || undefined,
      dueDate: dueDateTime || undefined,
    });

    toast.success('Tarefa atualizada com sucesso!');
    handleClose();
  };

  const handleDelete = async () => {
    if (!editingTaskId) return;
    await deleteTask.mutateAsync({ id: editingTaskId });
    toast.success('Tarefa excluída com sucesso!');
    handleClose();
  };

  const updateFormData = (updates: Partial<TaskFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  if (!selectedTask) {
    return (
      <Drawer open={isEditDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <DrawerContent className="bg-slate-900 border-slate-800">
          <div className="mx-auto max-w-full w-full">
            <DrawerHeader>
              <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  const typeIcon = getTaskTypeIcon(formData.type);
  const typeLabel =
    formData.type === 'PROJECT' ? 'Projeto' : formData.type === 'STUDY' ? 'Estudo' : 'Evento';

  return (
    <Drawer open={isEditDrawerOpen} onOpenChange={setEditDrawerOpen}>
      <DrawerContent className="bg-slate-900 border-slate-800 text-white">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="text-xl font-semibold text-white flex items-center gap-2">
              {selectedTask.name || 'Editar Tarefa'}
            </DrawerTitle>
            <div className="flex items-center gap-2 text-slate-300">
              {typeIcon.icon}
              <span className="text-sm">{typeLabel}</span>
            </div>
          </DrawerHeader>

          <div className="px-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Nome da tarefa
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="Digite o nome da tarefa"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-200">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Adicione uma descrição"
                rows={3}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 resize-none"
              />
            </div>

            <StatusPrioritySelector
              status={formData.status}
              priority={formData.priority}
              onStatusChange={(status) => updateFormData({ status })}
              onPriorityChange={(priority) => updateFormData({ priority })}
            />

            <DateTimeSelector
              label="Data de início"
              date={formData.startDate}
              time={formData.startTime}
              onDateChange={(date) => updateFormData({ startDate: date })}
              onTimeChange={(time) => updateFormData({ startTime: time })}
            />

            <DateTimeSelector
              label="Data de entrega"
              date={formData.dueDate}
              time={formData.dueTime}
              onDateChange={(date) => updateFormData({ dueDate: date })}
              onTimeChange={(time) => updateFormData({ dueTime: time })}
            />
          </div>

          <DrawerFooter className="pt-6">
            <div className="flex gap-3">
              <Button variant="destructive" onClick={handleDelete} disabled={deleteTask.isPending}>
                {deleteTask.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  Fechar
                </Button>
              </DrawerClose>
              <Button onClick={handleSave} disabled={updateTask.isPending || !formData.name.trim()}>
                {updateTask.isPending ? 'Salvando...' : 'Concluir'}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
