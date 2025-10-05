'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, PieChart } from 'recharts';
import { useDashboardTasks } from '@/hooks/data/useTasksQuery';
import { Task } from '@/types/Task';
import { parseISO, format, getDay, startOfMonth, getDaysInMonth } from 'date-fns';

interface CalendarDayData {
  day: number;
  total: number;
  completed: number;
  pending: number;
}

const processTasksToCalendar = (tasks: Task[]): CalendarDayData[] => {
  if (!tasks || tasks.length === 0) return [];

  const today = new Date();
  const daysInMonth = getDaysInMonth(today);

  const dayMap: Record<number, { total: number; completed: number }> = {};

  for (let i = 1; i <= daysInMonth; i++) {
    dayMap[i] = { total: 0, completed: 0 };
  }

  tasks.forEach((task) => {
    if (!task.dueDate) return;

    const taskDate = parseISO(task.dueDate);

    if (taskDate.getMonth() !== today.getMonth()) return;

    const dayOfMonth = taskDate.getDate();

    dayMap[dayOfMonth].total += 1;
    if (task.status === 'DONE') {
      dayMap[dayOfMonth].completed += 1;
    }
  });

  return Object.entries(dayMap)
    .map(([dayStr, counts]) => {
      const day = parseInt(dayStr);
      return {
        day,
        total: counts.total,
        completed: counts.completed,
        pending: counts.total - counts.completed,
      };
    })
    .sort((a, b) => a.day - b.day);
};

const MiniDonutChart = ({
  completed,
  total,
  day,
}: {
  completed: number;
  total: number;
  day: number;
}) => {
  const SIZE = 52;
  const RADIUS = SIZE / 2.5;
  const INNER_RADIUS = 14;
  const OUTER_RADIUS = 18;

  const dayLabelStyle =
    'absolute w-full h-full flex items-center justify-center text-xs font-semibold pointer-events-none';

  if (total === 0) {
    return (
      <div
        className={`w-[${SIZE}px] h-[${SIZE}px] flex items-center justify-center text-xs font-semibold text-muted-foreground border border-input rounded-full`}
      >
        {day}
      </div>
    );
  }

  const data = [
    { value: completed, fill: 'var(--color-chart-1)' },
    { value: total - completed, fill: 'var(--color-muted-foreground)' },
  ];

  return (
    <div className={`relative w-[${SIZE}px] h-[${SIZE}px] flex items-center justify-center`}>
      <PieChart width={SIZE} height={SIZE}>
        <Pie
          data={data}
          dataKey="value"
          cx={RADIUS}
          cy={RADIUS}
          innerRadius={INNER_RADIUS}
          outerRadius={OUTER_RADIUS}
          strokeWidth={0}
        />
      </PieChart>
      <span className={`${dayLabelStyle} text-foreground`}>{day}</span>
    </div>
  );
};

export const DashboardCalendar = () => {
  const { data } = useDashboardTasks();

  const calendarData = useMemo(() => {
    return processTasksToCalendar((data?.month as Task[]) || []);
  }, [data]);

  const today = new Date();
  const startOfMonthDate = startOfMonth(today);
  const firstDayOfWeek = getDay(startOfMonthDate);
  const monthTitle = format(today, 'MMMM yyyy');

  const emptyCellsBeforeStart = Array(firstDayOfWeek).fill(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário - {monthTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground pb-2">
              {day}
            </div>
          ))}

          {emptyCellsBeforeStart.map((_, i) => (
            <div key={`empty-start-${i}`} />
          ))}

          {calendarData.map((dayData) => (
            <div
              key={dayData.day}
              className="flex items-center justify-center p-1 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer min-h-[50px]"
            >
              <MiniDonutChart
                completed={dayData.completed}
                total={dayData.total}
                day={dayData.day}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
