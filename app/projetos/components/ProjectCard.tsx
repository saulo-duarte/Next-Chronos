'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/hooks/data/useProjectQuery';
import { ProjectCardMenu } from './ProjectCardMenu';
import { Calendar, CheckCircle, Clock, Play } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const statusConfig = {
  NOT_INITIALIZED: {
    label: 'Não iniciado',
    icon: Clock,
    variant: 'secondary' as const,
    color: 'text-muted-foreground',
  },
  IN_PROGRESS: {
    label: 'Em progresso',
    icon: Play,
    variant: 'default' as const,
    color: 'text-blue-500',
  },
  COMPLETED: {
    label: 'Finalizado',
    icon: CheckCircle,
    variant: 'default' as const,
    color: 'text-green-500',
  },
};

type ProjectCardProps = {
  project: Project;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Project['status']) => void;
};

export function ProjectCard({ project, onDelete, onStatusChange }: ProjectCardProps) {
  const router = useRouter();
  const statusInfo = statusConfig[project.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card
      onClick={() => router.push(`/projetos/${project.id}`)}
      className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border text-sm sm:text-base p-3 sm:p-5 cursor-pointer flex flex-col justify-between h-full my-4 gap-0"
    >
      <CardHeader className="p-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base sm:text-lg font-semibold truncate">
            {project.title}
          </CardTitle>

          <ProjectCardMenu
            projectId={project.id}
            currentStatus={project.status}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </div>
      </CardHeader>

      {project.description && (
        <CardContent className="p-0 flex-1">
          <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </CardDescription>
        </CardContent>
      )}

      <Separator className="-mt-6 mb-1 bg-primary/20" />

      <CardContent className="p-0 flex justify-between items-end">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-foreground">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          Criado em{' '}
          {new Date(project.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>

        <div className="flex items-center gap-2 text-foreground text-xs font-medium">
          Status
          <Badge variant={statusInfo.variant} className="text-[10px] sm:text-xs">
            <StatusIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${statusInfo.color}`} />
            {statusInfo.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
