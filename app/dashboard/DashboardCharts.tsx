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
    { name: 'Projetos', value: data.type.project, fill: '#2e6cc9' },
    { name: 'Estudos', value: data.type.study, fill: '#7b39bd' },
    { name: 'Eventos', value: data.type.event, fill: '#42b854' },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Tipo</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            project: { label: 'Projetos', color: '#2e6cc9' },
            study: { label: 'Estudos', color: '#7b39bd' },
            event: { label: 'Eventos', color: '#42b854' },
          }}
          className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
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
                wrapperStyle={{ paddingTop: 12, flexWrap: 'wrap' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
