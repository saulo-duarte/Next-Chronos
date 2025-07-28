'use client';

import { useMemo } from 'react';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { differenceInMinutes, format, getMinutes, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './types';
import {
  getBorderRadiusClasses,
  getEventColorClasses,
  getPriorityBadge,
  getStatusBadge,
  getTaskTypeIcon,
} from './utils';
import { useUpdateTask } from '@/hooks/data/useTasksQuery';
import { Checkbox } from './ui/checkbox';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskStatus, TaskType } from '@/types/Task';
import { FaCircleCheck } from 'react-icons/fa6';

const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? 'ha' : 'h:mma').toLowerCase();
};

interface EventWrapperProps {
  event: CalendarEvent;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  currentTime?: Date;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  const displayEnd = currentTime
    ? new Date(
        new Date(currentTime).getTime() +
          (new Date(event.end).getTime() - new Date(event.start).getTime())
      )
    : new Date(event.end);

  const isEventInPast = isPast(displayEnd);

  return (
    <button
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex size-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] data-dragging:cursor-grabbing data-dragging:shadow-lg data-past-event:line-through sm:px-2',
        getEventColorClasses(event.color ?? 'default'),
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className
      )}
      data-dragging={isDragging || undefined}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      {children}
    </button>
  );
}

interface EventItemProps {
  event: CalendarEvent;
  view: 'month' | 'week' | 'day' | 'agenda';
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  currentTime?: Date;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  children?: React.ReactNode;
  className?: string;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

export function EventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  const displayStart = useMemo(() => {
    return currentTime || new Date(event.start);
  }, [currentTime, event.start]);

  const displayEnd = useMemo(() => {
    return currentTime
      ? new Date(
          new Date(currentTime).getTime() +
            (new Date(event.end).getTime() - new Date(event.start).getTime())
        )
      : new Date(event.end);
  }, [currentTime, event.start, event.end]);

  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart);
  }, [displayStart, displayEnd]);

  const getEventTime = () => {
    if (event.allDay) return 'All day';

    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart);
    }

    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`;
  };

  if (view === 'month') {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          'mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-xs',
          className
        )}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {children || (
          <span className="truncate">
            {!event.allDay && (
              <span className="truncate font-normal opacity-70 sm:text-[11px]">
                {formatTimeWithOptionalMinutes(displayStart)}{' '}
              </span>
            )}
            {event.title}
          </span>
        )}
      </EventWrapper>
    );
  }

  if (view === 'week' || view === 'day') {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          'py-1',
          durationMinutes < 45 ? 'items-center' : 'flex-col',
          view === 'week' ? 'text-[10px] sm:text-xs' : 'text-xs',
          className
        )}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {durationMinutes < 45 ? (
          <div className="truncate">
            {event.title}{' '}
            {showTime && (
              <span className="opacity-70">{formatTimeWithOptionalMinutes(displayStart)}</span>
            )}
          </div>
        ) : (
          <>
            <div className="truncate font-medium">{event.title}</div>
            {showTime && (
              <div className="truncate font-normal opacity-70 sm:text-[11px]">{getEventTime()}</div>
            )}
          </>
        )}
      </EventWrapper>
    );
  }

  function formatLabel(text?: string) {
    if (!text) return '';
    const lower = text.toLowerCase().replace(/_/g, ' ');
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  const updateTask = useUpdateTask();

  function getStatusBadgeByType(type: TaskType, status: TaskStatus) {
    const map = {
      PROJECT: ['bg-[#83B7F3]', 'text-[#072059]'],
      EVENT: ['bg-[#85E889]', 'text-[#07590A]'],
      STUDY: ['bg-[#D899EF]', 'text-[#440E58]'],
    } as const;

    const [bg, text] = map[type as keyof typeof map] ?? ['bg-muted', 'text-muted-foreground'];

    return {
      icon: getStatusBadge(status).icon,
      className: `${bg} ${text} rounded-lg`,
    };
  }

  const isDone = event.status === 'DONE';
  const statusBadge = getStatusBadgeByType(event.type, event.status ?? 'TODO');

  const typeBorderMap = {
    PROJECT: 'border-[#072059]',
    EVENT: 'border-[#07590A]',
    STUDY: 'border-[#440E58]',
  } as const;

  const checkboxBorderColor = isDone
    ? ''
    : (typeBorderMap[event.type as keyof typeof typeBorderMap] ?? 'border-gray-400');

  const handleStatusToggle = async () => {
    const optimisticStatus: TaskStatus = isDone ? 'TODO' : 'DONE';
    const previousStatus: TaskStatus = event.status ?? 'TODO';

    updateTask.mutate(
      { id: event.id, status: optimisticStatus },
      {
        onError: () => {
          updateTask.mutate({ id: event.id, status: previousStatus });
        },
      }
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'relative flex w-full flex-row items-stretch gap-2 rounded-md px-2 py-2 text-left transition outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] data-past-event:line-through data-past-event:opacity-90',
        getEventColorClasses(event.color),
        className
      )}
      data-past-event={isPast(new Date(event.end)) || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      <div className="flex items-center">{getTaskTypeIcon(event.type).icon}</div>

      <div className="flex flex-col flex-1 gap-1">
        <div className="text-sm font-medium">
          <span className={isDone ? 'line-through opacity-70' : ''}>{event.title}</span>
        </div>

        <div className="text-xs opacity-70 flex flex-wrap items-center gap-1">
          {event.allDay ? (
            <span>All day</span>
          ) : (
            <span className="uppercase">
              {formatTimeWithOptionalMinutes(displayStart)} -{' '}
              {formatTimeWithOptionalMinutes(displayEnd)}
            </span>
          )}

          {event.priority &&
            (() => {
              const { icon, className } = getPriorityBadge(event.priority);
              return (
                <span
                  className={cn(
                    'ml-2 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold',
                    className
                  )}
                >
                  {icon}
                  {formatLabel(event.priority)}
                </span>
              );
            })()}

          {event.status &&
            (() => {
              const { icon, className } = statusBadge;
              return (
                <span
                  className={cn(
                    'flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold',
                    className
                  )}
                >
                  {icon}
                  {formatLabel(event.status)}
                </span>
              );
            })()}
        </div>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={isDone ? 'checked' : 'unchecked'}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          >
            {isDone ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusToggle();
                }}
                className={cn(
                  'size-8 flex items-center justify-center rounded-full border-[2px] transition-colors',
                  checkboxBorderColor,
                  'bg-transparent'
                )}
              >
                <FaCircleCheck size={28} className="text-" />
              </button>
            ) : (
              <Checkbox
                id={`status-${event.id}`}
                checked={isDone}
                onCheckedChange={handleStatusToggle}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'size-8 rounded-full border-[2px] transition-colors',
                  checkboxBorderColor
                )}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
