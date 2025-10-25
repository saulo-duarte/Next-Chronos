'use client';

import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from '@remixicon/react';

import { useTaskStore } from '@/stores/useTaskStore';
import { useCreateTask, useDeleteTask, useTask, useUpdateTask } from '@/hooks/data/useTasksQuery';
import { TaskPayload, UpdateTaskPayload, TaskPriority, TaskStatus } from '@/types/Task';
import { DefaultEndHour, DefaultStartHour, EndHour, StartHour } from '@/components/constants';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BsFillFlagFill } from 'react-icons/bs';
import { TiWarning } from 'react-icons/ti';
import { DatePicker } from './DatePicker';

interface EventDialogProps {
  taskType?: 'EVENT' | 'PROJECT' | 'STUDY';
  projectId?: string;
  topicId?: string;
}

export function EventDialog({ taskType = 'EVENT', projectId, topicId }: EventDialogProps) {
  const isProject = taskType === 'PROJECT';
  const isStudy = taskType === 'STUDY';
  const isEvent = taskType === 'EVENT';

  const { selectedTaskId, selectedTopicId, isModalOpen, setModalOpen, setSelectedTask } =
    useTaskStore();
  const effectiveTopicId = topicId ?? selectedTopicId;

  const { data: task } = useTask(selectedTaskId ?? '');
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`);
  const [endTime, setEndTime] = useState(`${DefaultEndHour}:00`);
  const [allDay, setAllDay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>('TODO');

  useEffect(() => {
    if (task) {
      setTitle(task.name ?? '');
      setDescription(task.description ?? '');
      const start = task.startDate ? new Date(task.startDate) : undefined;
      const end = task.dueDate ? new Date(task.dueDate) : undefined;
      setPriority(task.priority ?? 'MEDIUM');
      setStartDate(start);
      setEndDate(end);
      setStartTime(start ? formatTimeForInput(start) : `${DefaultStartHour}:00`);
      setEndTime(end ? formatTimeForInput(end) : `${DefaultEndHour}:00`);
      setAllDay(!task.startDate && !task.dueDate);
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime(`${DefaultStartHour}:00`);
    setEndTime(`${DefaultEndHour}:00`);
    setAllDay(false);
    setError(null);
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setSelectedTask(null);
    setModalOpen(false);
    resetForm();
  };

  const handleSave = () => {
    if (isEvent && !allDay && (!startDate || !endDate)) {
      setError('Por favor, selecione as datas de início e término.');
      return;
    }

    if (isProject && !projectId) {
      setError('Projeto inválido ou não informado.');
      return;
    }

    let start: Date | undefined = startDate;
    let end: Date | undefined = endDate;

    if (start && end && !allDay) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      start.setHours(startHour, startMinute, 0, 0);
      end.setHours(endHour, endMinute, 0, 0);
    }

    const payloadCommon = {
      name: title.trim() || '(no title)',
      description,
      startDate: allDay ? undefined : start ? toLocalISOString(start) : undefined,
      dueDate: allDay ? undefined : end ? toLocalISOString(end) : undefined,
      removeDueDate: allDay,
      status,
      priority,
    };

    if (task?.id) {
      const payload: UpdateTaskPayload = {
        ...payloadCommon,
        id: task.id,
      };
      updateTask.mutate(payload, { onSuccess: handleClose });
    } else {
      const payload: TaskPayload = {
        ...payloadCommon,
        type: taskType,
        projectId: isProject ? projectId : undefined,
        studyTopicId: isStudy ? (effectiveTopicId ?? undefined) : undefined,
      };
      createTask.mutate(payload, { onSuccess: handleClose });
    }
  };

  const handleDelete = () => {
    if (task?.id) {
      deleteTask.mutate({ id: task.id, projectId }, { onSuccess: handleClose });
    }
  };

  function generateTimeOptions() {
    const options = [];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const label = new Date(2000, 0, 1, hour, minute).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        options.push({ value, label });
      }
    }
    return options;
  }

  const priorityOptions = [
    { value: 'LOW', label: 'Baixa', icon: <BsFillFlagFill className="text-green-300 mr-1" /> },
    { value: 'MEDIUM', label: 'Média', icon: <BsFillFlagFill className="text-yellow-300 mr-1" /> },
    { value: 'HIGH', label: 'Alta', icon: <TiWarning className="text-red-400 mr-1" /> },
  ] as const;

  function getPriorityLabel(priority: TaskPriority) {
    const option = priorityOptions.find((o) => o.value === priority);
    return option ? (
      <div className="flex items-center gap-2">
        {option.icon}
        <span>{option.label}</span>
      </div>
    ) : null;
  }

  function toLocalISOString(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{task?.id ? 'Editar Tarefa' : 'Adicionar Tarefa'}</DialogTitle>
        </DialogHeader>

        {error && <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm">{error}</div>}

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
              <SelectTrigger id="priority" className="w-full">
                <SelectValue placeholder="Selecione prioridade">
                  {getPriorityLabel(priority)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Selecione status" />
              </SelectTrigger>
              <SelectContent>
                {['TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === 'TODO' && 'A Fazer'}
                    {s === 'IN_PROGRESS' && 'Em Andamento'}
                    {s === 'DONE' && 'Concluído'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(isStudy || isProject) && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="no-date"
                checked={allDay}
                onCheckedChange={(checked) => setAllDay(checked === true)}
              />
              <Label htmlFor="no-date">Sem Data</Label>
            </div>
          )}

          {/* ⇨ Mostra o picker de datas apenas se allDay for false */}
          {!allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <DatePicker
                  label="Data de Início"
                  date={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <Label htmlFor="start-time">Hora de Início</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time" className="w-full">
                    <SelectValue placeholder="Hora de Início" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <DatePicker
                  label="Data de Término"
                  date={endDate}
                  onChange={(date) => setEndDate(date)}
                />
                <Label htmlFor="end-time">Hora de Término</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time" className="w-full">
                    <SelectValue placeholder="Hora de Término" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row">
          {task?.id && (
            <Button variant="outline" size="icon" onClick={handleDelete} aria-label="Delete">
              <RiDeleteBinLine size={16} />
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={createTask.isPending || updateTask.isPending}>
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
