import { isSameDay } from 'date-fns';
import { CalendarEvent, EventColor } from './types';
import { JSX } from 'react';
import { FaBookBookmark } from 'react-icons/fa6';
import { FaBriefcase } from 'react-icons/fa6';
import { BsCalendar2WeekFill } from 'react-icons/bs';
import { RiLoader2Line, RiTimeFill } from '@remixicon/react';
import { FaCheckCircle } from 'react-icons/fa';
import { Circle, Flag, Minus, TriangleAlert } from 'lucide-react';
import clsx from 'clsx';
import { TaskType, TaskStatus, TaskPriority } from '@/types/Task';

/**
 * Get CSS classes for event colors
 */
export function getEventColorClasses(color?: EventColor | string): string {
  const eventColor = color || 'skyblue';

  switch (eventColor) {
    case 'lavender':
      return 'bg-[#D899EF] hover:bg-[#D899EF]/40 text-[#5D2E70] dark:text-[#440E58] shadow-[#D899EF]/10';
    case 'skyblue':
      return 'bg-[#83B7F3] hover:bg-[#83B7F3]/40 text-[#1E3A8A] dark:text-[#072059] shadow-[#83B7F3]/10';
    case 'mint':
      return 'bg-[#85E889] hover:bg-[#85E889]/40 text-[#1B5E20] dark:text-[#07590A] shadow-[#85E889]/10';
    default:
      return 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100';
  }
}

/**
 * Get CSS classes for border radius based on event position in multi-day events
 */
export function getBorderRadiusClasses(isFirstDay: boolean, isLastDay: boolean): string {
  if (isFirstDay && isLastDay) {
    return 'rounded'; // Both ends rounded
  } else if (isFirstDay) {
    return 'rounded-l rounded-r-none'; // Only left end rounded
  } else if (isLastDay) {
    return 'rounded-r rounded-l-none'; // Only right end rounded
  } else {
    return 'rounded-none'; // No rounded corners
  }
}

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: CalendarEvent): boolean {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return event.allDay || eventStart.getDate() !== eventEnd.getDate();
}

/**
 * Filter events for a specific day
 */
export function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start);
      return isSameDay(day, eventStart);
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

/**
 * Sort events with multi-day events first, then by start time
 */
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a);
    const bIsMultiDay = isMultiDayEvent(b);

    if (aIsMultiDay && !bIsMultiDay) return -1;
    if (!aIsMultiDay && bIsMultiDay) return 1;

    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });
}

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
export function getSpanningEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false;

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Only include if it's not the start day but is either the end day or a middle day
    return (
      !isSameDay(day, eventStart) &&
      (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
    );
  });
}

/**
 * Get all events visible on a specific day (starting, ending, or spanning)
 */
export function getAllEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return (
      isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd)
    );
  });
}

/**
 * Get all events for a day (for agenda view)
 */
export function getAgendaEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        isSameDay(day, eventStart) ||
        isSameDay(day, eventEnd) ||
        (day > eventStart && day < eventEnd)
      );
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

/**
 * Add hours to a date
 */
export function addHoursToDate(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function getTaskTypeIcon(
  type?: TaskType,
  className?: string
): { icon: JSX.Element | null; className: string } {
  const defaultIconClass = 'w-5 h-5';
  const wrapperBaseClass = 'rounded-full flex items-center justify-center p-2';

  let icon: JSX.Element | null = null;
  let bgClass = '';
  let textClass = '';

  switch (type) {
    case 'PROJECT':
      icon = <FaBriefcase className={className ?? defaultIconClass} />;
      bgClass = 'bg-[#072059]';
      textClass = 'text-[#83B7F3]';
      break;
    case 'STUDY':
      icon = <FaBookBookmark className={className ?? defaultIconClass} />;
      bgClass = 'bg-[#440E58]';
      textClass = 'text-[#D899EF]';
      break;
    case 'EVENT':
      icon = <BsCalendar2WeekFill className={className ?? defaultIconClass} />;
      bgClass = 'bg-[#07590A]';
      textClass = 'text-[#85E889]';
      break;
    default:
      return { icon: null, className: '' };
  }

  return {
    icon: <div className={clsx(wrapperBaseClass, bgClass, textClass)}>{icon}</div>,
    className: clsx(wrapperBaseClass, bgClass, textClass),
  };
}

export function getStatusBadge(status?: TaskStatus): {
  icon: JSX.Element;
  className: string;
} {
  switch (status) {
    case 'TODO':
      return {
        icon: <RiTimeFill className="w-3 h-3" />,
        className:
          'bg-blue-950 text-blue-200 border border-black/20 text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-1.5 rounded-lg',
      };
    case 'IN_PROGRESS':
      return {
        icon: <RiLoader2Line className="w-3 h-3 animate-spin-slow" />,
        className:
          'bg-blue-200 text-blue-800 border border-blue-400 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600 text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-1.5 rounded-lg',
      };
    case 'DONE':
      return {
        icon: <FaCheckCircle className="w-3 h-3" />,
        className:
          'bg-emerald-200 text-green-800 border border-emerald-400 dark:bg-green-900 dark:text-green-300 dark:border-green-600 text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-1.5 rounded-lg',
      };
    default:
      return {
        icon: <Circle className="w-3 h-3" />,
        className:
          'bg-muted text-muted-foreground border border-muted-foreground/30 text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-1.5 rounded-lg',
      };
  }
}

export function getPriorityBadge(priority?: TaskPriority): {
  icon: JSX.Element;
  className: string;
} {
  switch (priority) {
    case 'LOW':
      return {
        icon: <Flag className="w-3 h-3" />,
        className:
          'bg-emerald-200 text-green-800 border border-emerald-600 text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-1.5 rounded-lg',
      };
    case 'MEDIUM':
      return {
        icon: <Flag className="w-3 h-3" />,
        className:
          'bg-yellow-200 text-yellow-800 border border-yellow-600 text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-1.5 rounded-lg',
      };
    case 'HIGH':
      return {
        icon: <TriangleAlert className="w-3 h-3" />,
        className:
          'bg-red-300 text-red-800 border border-red-400 text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-1.5 rounded-lg',
      };
    default:
      return {
        icon: <Minus className="w-3 h-3" />,
        className:
          'bg-muted text-muted-foreground text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-1.5 rounded-lg',
      };
  }
}
