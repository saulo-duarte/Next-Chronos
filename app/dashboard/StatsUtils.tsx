import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  iconColor: string;
}

export const StatCard = ({ title, value, icon: Icon, iconColor }: StatCardProps) => (
  <Card>
    <CardContent className="px-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
  const statusMap: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
  > = {
    DONE: { label: 'Completa', variant: 'default' },
    IN_PROGRESS: { label: 'Em Andamento', variant: 'secondary' },
    TODO: { label: 'A Fazer', variant: 'outline' },
    OVERDUE: { label: 'Atrasada', variant: 'destructive' },
  };

  const statusInfo = statusMap[status] || { label: status, variant: 'outline' };
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};

export const getTypeBadge = (type: string) => {
  const typeMap: Record<string, string> = {
    PROJECT: 'Projeto',
    STUDY: 'Estudo',
    EVENT: 'Evento',
  };

  return typeMap[type] || type;
};
