'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useDashboardTasks } from '@/hooks/data/useTasksQuery';

export const DashboardTypeDistributionChart = () => {
  const { data } = useDashboardTasks();

  if (!data) return null;

  const totalTasks = data.type.project + data.type.study + data.type.event;

  if (totalTasks === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Nenhuma tarefa encontrada para a distribuição.
        </CardContent>
      </Card>
    );

  const typeDistribution = [
    { name: 'Projetos', value: data.type.project, fill: 'var(--color-chart-1)' },
    { name: 'Estudos', value: data.type.study, fill: 'var(--color-chart-2)' },
    { name: 'Eventos', value: data.type.event, fill: 'var(--color-chart-3)' },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            project: { label: 'Projetos', color: 'var(--color-chart-1)' },
            study: { label: 'Estudos', color: 'var(--color-chart-2)' },
            event: { label: 'Eventos', color: 'var(--color-chart-3)' },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
