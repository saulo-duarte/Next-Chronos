import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';
import { useTaskStore } from '@/stores/useTaskStore';
import { TaskPriority, TaskStatus } from '@/types/Task';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { CalendarView } from '@/components';

interface CalendarFiltersProps {
  onViewChange: (newView: string) => void;
}

const VIEW_OPTIONS = [
  { value: 'mês', label: 'Mês' },
  { value: 'semana', label: 'Semana' },
  { value: 'dia', label: 'Dia' },
  { value: 'agenda', label: 'Agenda' },
  { value: 'Lista do dia', label: 'Lista do Dia' },
];

export function CalendarFilters({ onViewChange }: CalendarFiltersProps) {
  const { filters, setStatusFilter, setPriorityFilter, setDateRangeFilter, clearFilters } =
    useTaskStore();

  const { setCalendarView } = useCalendarStore();

  const handleClear = () => {
    clearFilters();
  };

  const handleSelectView = (value: CalendarView) => {
    setCalendarView(value);
    onViewChange(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as TaskStatus);
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value as TaskPriority);
  };

  const handleDateChange = (date: Date | undefined, type: 'start' | 'end') => {
    const isoDate = date ? date.toISOString() : undefined;

    let newDateRange = { ...filters.dateRange };

    if (type === 'start') {
      newDateRange = { start: isoDate, end: newDateRange.end };
    } else {
      newDateRange = { start: newDateRange.start, end: isoDate };
    }

    if (!newDateRange.start && !newDateRange.end) {
      setDateRangeFilter(undefined);
    } else {
      setDateRangeFilter(newDateRange);
    }
  };

  const defaultView =
    VIEW_OPTIONS.find((opt) => opt.value === 'mês')?.value || VIEW_OPTIONS[0].value;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-background w-full">
      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue={defaultView} onValueChange={handleSelectView}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Visualização" />
          </SelectTrigger>
          <SelectContent>
            {VIEW_OPTIONS.map((v) => (
              <SelectItem key={v.value} value={v.value}>
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleStatusChange} value={filters.status as string}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODO">A Fazer</SelectItem>
            <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
            <SelectItem value="DONE">Concluído</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handlePriorityChange} value={filters.priority as string}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HIGH">Alta</SelectItem>
            <SelectItem value="MEDIUM">Média</SelectItem>
            <SelectItem value="LOW">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <DatePicker
          label=""
          date={filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined}
          onChange={(date) => handleDateChange(date, 'start')}
        />
        <DatePicker
          label=""
          date={filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined}
          onChange={(date) => handleDateChange(date, 'end')}
        />

        <Button variant="outline" onClick={handleClear} className="w-[100px]">
          Limpar
        </Button>
      </div>

      <Button className="flex items-center gap-1">
        <Plus className="h-4 w-4" />
        Novo Evento
      </Button>
    </div>
  );
}
