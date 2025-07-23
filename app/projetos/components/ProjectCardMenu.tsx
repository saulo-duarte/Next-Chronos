'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ExternalLink, Edit, Clock, Play, CheckCircle, Trash2 } from 'lucide-react';
import { ProjectStatus } from '@/hooks/data/useProjectQuery';

type ProjectCardMenuProps = {
  projectId: string;
  currentStatus: ProjectStatus;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ProjectStatus) => void;
};

export function ProjectCardMenu({
  projectId,
  currentStatus,
  onDelete,
  onStatusChange,
}: ProjectCardMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onStatusChange(projectId, 'NOT_INITIALIZED')}
          disabled={currentStatus === 'NOT_INITIALIZED'}
        >
          <Clock className="w-4 h-4 mr-2" />
          Marcar como não iniciado
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(projectId, 'IN_PROGRESS')}
          disabled={currentStatus === 'IN_PROGRESS'}
        >
          <Play className="w-4 h-4 mr-2" />
          Marcar como em progresso
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(projectId, 'COMPLETED')}
          disabled={currentStatus === 'COMPLETED'}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Marcar como finalizado
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(projectId)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
