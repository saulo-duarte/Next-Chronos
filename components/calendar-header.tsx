import { BsCalendarFill, BsClockFill } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  FilterXIcon,
} from 'lucide-react';
import { useTaskStore } from '@/stores/useTaskStore';
import { TaskStatus } from '@/types/Task';

interface Props {
  view: string;
  viewTitle: React.ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  setView: (view: string) => void;
  onNewEvent: () => void;
  className?: string;
}

const statusOptions: { label: string; value: TaskStatus | 'ALL' }[] = [
  { label: 'Todos', value: 'ALL' },
  { label: 'A Fazer', value: 'TODO' },
  { label: 'Em Andamento', value: 'IN_PROGRESS' },
  { label: 'Completo', value: 'DONE' },
];

export function CalendarHeader({
  view,
  viewTitle,
  onPrevious,
  onNext,
  setView,
  onNewEvent,
  className,
}: Props) {
  const { filters, setStatusFilter, clearFilters, hasActiveFilters } = useTaskStore();

  const currentStatusLabel = (() => {
    if (!filters.status) return 'Todos';

    if (Array.isArray(filters.status)) {
      if (filters.status.length === 0) return 'Todos';
      if (filters.status && filters.status.length === 1) {
        return (
          statusOptions.find((opt) =>
            Array.isArray(filters.status) && filters.status[0] !== undefined
              ? opt.value === filters.status[0]
              : false
          )?.label ?? 'Status'
        );
      }
      return `${filters.status.length} status`;
    }

    return statusOptions.find((opt) => opt.value === filters.status)?.label ?? 'Status';
  })();

  const handleStatusChange = (value: TaskStatus | 'ALL') => {
    if (value === 'ALL') {
      setStatusFilter(undefined);
    } else {
      setStatusFilter(value);
    }
  };

  return (
    <div className={`space-y-3 ${className ?? ''} mb-4`}>
      {view === 'mês' && (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onPrevious}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-bold truncate sm:text-xl md:text-2xl">{viewTitle}</h2>
        </div>
      )}

      <div className="flex items-center justify-between gap-1 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 px-2 sm:px-3">
              <BsCalendarFill className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </span>
              <ChevronDownIcon className="h-3 w-3 opacity-60 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32">
            {(['mês', 'semana', 'dia', 'agenda'] as const).map((v) => (
              <DropdownMenuItem
                key={v}
                onClick={() => setView(v)}
                className={view === v ? 'bg-accent' : ''}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
                <DropdownMenuShortcut className="hidden sm:inline">
                  {v.charAt(0).toUpperCase()}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 sm:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 px-2 sm:px-3">
                <BsClockFill className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base max-w-16 truncate sm:max-w-none">
                  {currentStatusLabel}
                </span>
                <ChevronDownIcon className="h-3 w-3 opacity-60 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {statusOptions.map(({ label, value }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handleStatusChange(value)}
                  className={
                    (value === 'ALL' && !filters.status) ||
                    (value !== 'ALL' && filters.status === value)
                      ? 'bg-accent'
                      : ''
                  }
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="px-2 text-muted-foreground hover:text-foreground"
              title="Limpar filtros"
            >
              <FilterXIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-1 text-xs">Limpar</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={onNewEvent}
            className="px-2 sm:px-4 sr-only sm:not-sr-only sm:ml-1"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Novo</span>
          </Button>
        </div>
      </div>

      {hasActiveFilters() && (
        <div className="flex items-center gap-2 sm:hidden">
          <span className="text-xs text-muted-foreground">Filtro:</span>
          {filters.status && (
            <Badge variant="secondary" className="text-xs">
              {currentStatusLabel}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
