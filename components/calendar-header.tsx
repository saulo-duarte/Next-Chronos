import { BsCalendarFill, BsClockFill } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';

interface Props {
  view: string;
  viewTitle: React.ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  setView: (view: string) => void;
  onNewEvent: () => void;
  onStatusFilterChange?: (status: string) => void;
  className?: string;
}

export function CalendarHeader({
  view,
  viewTitle,
  onPrevious,
  onNext,
  setView,
  onNewEvent,
  onStatusFilterChange,
  className,
}: Props) {
  return (
    <div className={`space-y-2 ${className ?? ''} mb-4`}>
      {view === 'mês' && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onPrevious}>
              <ChevronLeftIcon size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext}>
              <ChevronRightIcon size={20} />
            </Button>
          </div>
          <h2 className="text-xl md:text-2xl font-bold">{viewTitle}</h2>
        </div>
      )}

      <div className="flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1 text-base md:text-lg">
              <BsCalendarFill size={16} className="mr-2" />
              <span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
              <ChevronDownIcon size={16} className="-me-1 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-32">
            {(['mês', 'semana', 'dia', 'agenda'] as const).map((v) => (
              <DropdownMenuItem key={v} onClick={() => setView(v)}>
                {v[0].toUpperCase() + v.slice(1)}
                <DropdownMenuShortcut>{v[0].toUpperCase()}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 text-base md:text-lg">
                <BsClockFill size={16} className="mr-2" />
                <span>Todos</span>
                <ChevronDownIcon size={16} className="-me-1 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-32">
              <DropdownMenuItem onClick={() => onStatusFilterChange?.('all')}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusFilterChange?.('todo')}>
                Todo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusFilterChange?.('in_progress')}>
                Em Andamento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusFilterChange?.('complete')}>
                Completo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="max-[479px]:hidden">
            <Button size="sm" onClick={onNewEvent}>
              <PlusIcon size={16} />
              <span className="max-sm:sr-only">Novo Evento</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
