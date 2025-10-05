'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDashboardTasks } from '@/hooks/data/useTasksQuery';
import { getStatusBadge, getTypeBadge } from './StatsUtils';

export const DashboardLatestTasks = () => {
  const { data } = useDashboardTasks();

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Tarefas ({data.last_tasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.last_tasks.slice(0, 5).map((task: any) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell className="text-muted-foreground">{getTypeBadge(task.type)}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
