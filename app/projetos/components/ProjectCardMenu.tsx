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
import { Project, ProjectStatus } from '@/hooks/data/useProjectQuery';
import { useProjectStore } from '@/stores/useProjectStore';

type ProjectCardMenuProps = {
  project: Project;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ProjectStatus) => void;
};

export function ProjectCardMenu({ project, onDelete, onStatusChange }: ProjectCardMenuProps) {
  const setEditingProjectId = useProjectStore((state) => state.setEditingProjectId);
  const setIsAddModalOpen = useProjectStore((state) => state.setIsAddModalOpen);
  const setNewProjectForm = useProjectStore((state) => state.setNewProjectForm);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setNewProjectForm({
      title: project.title,
      description: project.description ?? '',
      status: project.status,
    });
    setIsAddModalOpen(true);
  };

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
        <DropdownMenuItem onClick={handleEditClick}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onStatusChange(project.id, 'NOT_INITIALIZED')}
          disabled={project.status === 'NOT_INITIALIZED'}
        >
          <Clock className="w-4 h-4 mr-2" />
          Marcar como não iniciado
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(project.id, 'IN_PROGRESS')}
          disabled={project.status === 'IN_PROGRESS'}
        >
          <Play className="w-4 h-4 mr-2" />
          Marcar como em progresso
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(project.id, 'COMPLETED')}
          disabled={project.status === 'COMPLETED'}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Marcar como finalizado
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(project.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
