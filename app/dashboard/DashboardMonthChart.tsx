'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { useDashboardTasks } from '@/hooks/data/useTasksQuery';
import { parseISO, getWeekOfMonth, getDay } from 'date-fns';
import { Task } from '@/types/Task';

type ViewType = 'month_week' | 'day';

interface SimpleChartDataPoint {
  period: string;
  completed: number;
  fill?: string;
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const TOTAL_WEEKS = 4;

const processTasks = (tasks: Task[]) => {
  const now = new Date();

  const monthWeekData: Record<number, number> = {};
  const dayData: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  tasks.forEach((task) => {
    if (!task.dueDate || task.status !== 'DONE') return;

    const date = parseISO(task.dueDate);
    const dayIndex = getDay(date);

    const weekNumber = getWeekOfMonth(date, { weekStartsOn: 0 });
    monthWeekData[weekNumber] = (monthWeekData[weekNumber] || 0) + 1;

    dayData[dayIndex] = (dayData[dayIndex] || 0) + 1;
  });

  const processedByDay: SimpleChartDataPoint[] = Array(7)
    .fill(0)
    .map((_, index) => ({
      period: WEEK_DAYS[index],
      completed: dayData[index] || 0,
    }));

  const processedMonthWeek: SimpleChartDataPoint[] = [];

  const currentWeekOfMonth = getWeekOfMonth(now, { weekStartsOn: 0 });

  for (let i = 1; i <= TOTAL_WEEKS; i++) {
    const isFutureWeek = i > currentWeekOfMonth;

    processedMonthWeek.push({
      period: `Semana ${i}`,
      completed: monthWeekData[i] || 0,
      fill: isFutureWeek ? 'var(--color-muted-foreground)' : 'var(--color-chart-1)',
    });
  }

  return {
    month_week: processedMonthWeek,
    day: processedByDay,
  };
};

export const DashboardMonthlyChart = () => {
  const { data } = useDashboardTasks();
  const [view, setView] = useState<ViewType>('month_week');

  const { month_week, day } = useMemo(() => {
    if (!data || !data.month || data.month.length === 0) {
      const emptyDayData = WEEK_DAYS.map((day) => ({ period: day, completed: 0 }));
      return {
        month_week: Array(TOTAL_WEEKS)
          .fill(0)
          .map((_, i) => ({
            period: `Semana ${i + 1}`,
            completed: 0,
            fill: 'var(--color-muted-foreground)',
          })),
        day: emptyDayData,
      };
    }
    return processTasks(data.month as Task[]);
  }, [data]);

  let chartData: SimpleChartDataPoint[] = [];
  let title = '';
  let chartConfig: any = {};

  switch (view) {
    case 'month_week':
      chartData = month_week;
      title = 'Concluídas por Semana';
      chartConfig = {
        completed: { label: 'Concluídas', color: 'var(--color-chart-1)' },
      };
      break;
    case 'day':
      chartData = day;
      title = 'Concluídas por Dia da Semana';
      chartConfig = {
        completed: { label: 'Concluídas', color: 'var(--color-chart-1)' },
      };
      break;
  }

  if (!data || !data.month || data.month.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="space-x-2">
          <Button
            size="sm"
            variant={view === 'month_week' ? 'default' : 'outline'}
            onClick={() => setView('month_week')}
          >
            Mês (Semanas)
          </Button>
          <Button
            size="sm"
            variant={view === 'day' ? 'default' : 'outline'}
            onClick={() => setView('day')}
          >
            Mês (Dias)
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={10}>
              <XAxis dataKey="period" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill || 'var(--color-chart-1)'}
                    opacity={
                      entry.fill === 'var(--color-muted-foreground)' && entry.completed === 0
                        ? 0.4
                        : 1
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
