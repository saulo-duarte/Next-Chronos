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
  // Always use the currentTime (if provided) to determine if the event is in the past
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
        getEventColorClasses(event.color),
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
  const eventColor = event.color;

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

  return (
    <button
      className={cn(
        'relative flex w-full flex-row items-stretch gap-2 rounded-md px-4 py-2 text-left transition outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] data-past-event:line-through data-past-event:opacity-90',
        getEventColorClasses(eventColor),
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
        <div className="text-sm font-medium">{event.title}</div>

        <div className="text-xs opacity-70">
          {event.allDay ? (
            <span>All day</span>
          ) : (
            <span className="uppercase">
              {formatTimeWithOptionalMinutes(displayStart)} -{' '}
              {formatTimeWithOptionalMinutes(displayEnd)}
            </span>
          )}
        </div>
      </div>

      {(event.status || event.priority) && (
        <div className="absolute bottom-1 right-1 flex items-center gap-1">
          {event.status &&
            (() => {
              const { icon, className } = getStatusBadge(event.status);
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

          {event.priority &&
            (() => {
              const { icon, className } = getPriorityBadge(event.priority);
              return (
                <span
                  className={cn(
                    'flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold',
                    className
                  )}
                >
                  {icon}
                  {formatLabel(event.priority)}
                </span>
              );
            })()}
        </div>
      )}
    </button>
  );
}
