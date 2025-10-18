import { useMemo } from 'react';
import { BsCalendarFill, BsClockFill } from 'react-icons/bs';
import { Button } from './ui/button';
import { ChevronDownIcon, Plus, Filter } from 'lucide-react';
import { useTaskStore } from '@/stores/useTaskStore';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { TaskStatus, TaskType } from '@/types/Task';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';

const statusOptions: { label: string; value: TaskStatus | 'ALL' }[] = [
  { label: 'Todos', value: 'ALL' },
  { label: 'A Fazer', value: 'TODO' },
  { label: 'Em Andamento', value: 'IN_PROGRESS' },
  { label: 'Completo', value: 'DONE' },
];

const typeOptions: { label: string; value: TaskType | 'ALL' }[] = [
  { label: 'Todos os Tipos', value: 'ALL' },
  { label: 'Projeto', value: 'PROJECT' as TaskType },
  { label: 'Evento', value: 'EVENT' as TaskType },
  { label: 'Estudo', value: 'STUDY' as TaskType },
];

export function DesktopTaskFilters() {
  const { calendarView: view, setCalendarView: setView } = useCalendarStore();
  const {
    filters,
    setStatusFilter,
    setTypeFilter,
    setOverdueFilter,
    clearFilters,
    setSelectedTask,
    setModalOpen,
  } = useTaskStore();

  const currentStatusLabel = useMemo(() => {
    const currentFilter = statusOptions.find((opt) => opt.value === filters.status);
    return currentFilter ? currentFilter.label : 'Todos';
  }, [filters.status]);

  const currentTypeLabel = useMemo(() => {
    const currentFilter = typeOptions.find((opt) => opt.value === filters.type);
    return currentFilter ? currentFilter.label : 'Todos os Tipos';
  }, [filters.type]);

  const handleStatusChange = (value: TaskStatus | 'ALL') => {
    setStatusFilter(value === 'ALL' ? undefined : value);
  };

  const handleTypeChange = (value: TaskType | 'ALL') => {
    setTypeFilter(value === 'ALL' ? undefined : value);
  };

  return (
    <div className="hidden md:flex justify-end gap-4 p-2 bg-background w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 px-4">
            <BsCalendarFill className="h-4 w-4" />
            {view.charAt(0).toUpperCase() + view.slice(1)}
            <ChevronDownIcon className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-2 py-1">
          {(['mês', 'semana', 'dia', 'agenda', 'Lista do dia'] as const).map((v) => (
            <DropdownMenuItem key={v} onClick={() => setView(v)} className="px-4 py-2">
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 px-4 min-w-[130px]">
            <BsClockFill className="h-4 w-4" />
            {currentStatusLabel}
            <ChevronDownIcon className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-2 py-1">
          {statusOptions.map(({ label, value }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleStatusChange(value)}
              className={
                value === filters.status || (value === 'ALL' && !filters.status) ? 'bg-accent' : ''
              }
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 px-4 min-w-[130px]">
            <Filter className="h-4 w-4" />
            {currentTypeLabel}
            <ChevronDownIcon className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-2 py-1">
          {typeOptions.map(({ label, value }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleTypeChange(value)}
              className={
                value === filters.type || (value === 'ALL' && !filters.type) ? 'bg-accent' : ''
              }
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant={filters.overdue ? 'default' : 'outline'}
        className="gap-2 px-4 min-w-[130px]"
        onClick={() => setOverdueFilter(!filters.overdue)}
      >
        Atrasadas
      </Button>
      <Button variant="outline" onClick={clearFilters}>
        Limpar Filtros
      </Button>

      <Button
        className="flex items-center gap-2 px-4"
        onClick={() => {
          setSelectedTask(null);
          setModalOpen(true);
        }}
      >
        <Plus className="w-4 h-4" />
        Nova Task
      </Button>
    </div>
  );
}
