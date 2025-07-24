'use client';

import { useEffect, useState } from 'react';
import { isBefore } from 'date-fns';
import { RiDeleteBinLine } from '@remixicon/react';

import { useTaskStore } from '@/stores/useTaskStore';
import {
  TaskPriority,
  useCreateTask,
  useDeleteTask,
  useTask,
  useUpdateTask,
} from '@/hooks/data/useTasksQuery';

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

export function EventDialog() {
  const { selectedTaskId, isModalOpen, setModalOpen, setSelectedTask } = useTaskStore();
  const { data: task } = useTask(selectedTaskId ?? '');
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`);
  const [endTime, setEndTime] = useState(`${DefaultEndHour}:00`);
  const [allDay, setAllDay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');

  useEffect(() => {
    if (task) {
      setTitle(task.name ?? '');
      setDescription(task.description ?? '');
      const start = task.startDate ? new Date(task.startDate) : new Date();
      const end = task.dueDate ? new Date(task.dueDate) : new Date();
      setPriority(task.priority ?? 'MEDIUM');
      setStartDate(start);
      setEndDate(end);
      setStartTime(formatTimeForInput(start));
      setEndTime(formatTimeForInput(end));
      setAllDay(false);
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date());
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
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!allDay) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);

      if (
        startHours < StartHour ||
        startHours > EndHour ||
        endHours < StartHour ||
        endHours > EndHour
      ) {
        setError(`Time must be between ${StartHour}:00 and ${EndHour}:00`);
        return;
      }

      start.setHours(startHours, startMinutes, 0, 0);
      end.setHours(endHours, endMinutes, 0, 0);

      if (isBefore(end, start)) {
        setError('End date must be after start date');
        return;
      }
    } else {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    const payload = {
      name: title.trim() || '(no title)',
      description,
      startDate: toLocalISOString(start),
      dueDate: allDay ? undefined : toLocalISOString(end),
      status: 'TODO' as const,
      type: 'EVENT' as const,
      priority,
    };

    if (task?.id) {
      updateTask.mutate({ id: task.id, ...payload }, { onSuccess: handleClose });
    } else {
      createTask.mutate(payload, { onSuccess: handleClose });
    }
  };

  const handleDelete = () => {
    if (task?.id) {
      deleteTask.mutate(task.id, { onSuccess: handleClose });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task?.id ? 'Edit Task' : 'Adicionar Evento'}</DialogTitle>
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

          {!allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Hora de Início</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time" className="w-full">
                    <SelectValue placeholder="Select time" />
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
              <div>
                <Label htmlFor="end-time">Hora do Fim</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time" className="w-full">
                    <SelectValue placeholder="Select time" />
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

          <div className="flex items-center gap-2">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked === true)}
            />
            <Label htmlFor="all-day">All Day</Label>
          </div>
        </div>

        <DialogFooter className="flex-row">
          {task?.id && (
            <Button variant="outline" size="icon" onClick={handleDelete} aria-label="Delete">
              <RiDeleteBinLine size={16} />
            </Button>
          )}
          <div className="flex gap-2 ">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={createTask.isPending || updateTask.isPending}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
