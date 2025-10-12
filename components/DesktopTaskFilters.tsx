import { useMemo } from 'react';
import { BsCalendarFill, BsClockFill } from 'react-icons/bs';
import { Button } from './ui/button';
import { ChevronDownIcon, Plus } from 'lucide-react';
import { useTaskStore } from '@/stores/useTaskStore';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { TaskStatus } from '@/types/Task';
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

export function DesktopTaskFilters() {
  const { calendarView: view, setCalendarView: setView } = useCalendarStore();
  const {
    filters,
    setStatusFilter,
    clearFilters,
    setOverdueFilter,
    setSelectedTask,
    setModalOpen,
  } = useTaskStore();

  const currentStatusLabel = useMemo(() => {
    if (!filters.status) return 'Todos';
    if (Array.isArray(filters.status) && filters.status.length === 1) {
      const val = filters.status[0];
      if (val === 'DONE') return 'Completo';
      if (val === 'IN_PROGRESS') return 'Em Andamento';
      if (val === 'TODO') return 'A Fazer';
    }
    return Array.isArray(filters.status) ? `${filters.status.length} status` : filters.status;
  }, [filters.status]);

  const handleStatusChange = (value: TaskStatus | 'ALL') => {
    if (value === 'ALL') clearFilters();
    else setStatusFilter(value);
  };

  return (
    <div className="flex items-center justify-start gap-6 p-4 bg-background">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 px-4">
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
          <Button variant="outline" size="sm" className="gap-2 px-4">
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
                (value === 'ALL' && !filters.status) || filters.status === value ? 'bg-accent' : ''
              }
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant={filters.overdue ? 'default' : 'outline'}
        size="sm"
        className="gap-2 px-4"
        onClick={() => setOverdueFilter(!filters.overdue)}
      >
        Atrasadas
      </Button>

      <Button
        size="sm"
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
