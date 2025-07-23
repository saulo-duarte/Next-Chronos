'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useProjects,
  useDeleteProject,
  useUpdateProject,
  ProjectStatus,
} from '@/hooks/data/useProjectQuery';
import { NewProjectDialog } from './components/NewProjectDialog';
import { useProjectStore } from '@/stores/useProjectStore';
import { ProjectCard } from './components/ProjectCard';
import { FloatingNewProjectButton } from './components/FloatingNewProjectButton';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const safeProjects = Array.isArray(projects) ? projects : [];
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const filteredProjects = safeProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const handleDeleteProject = (id: string) => {
    deleteProject.mutate(id);
  };

  const handleStatusChange = (id: string, newStatus: ProjectStatus) => {
    updateProject.mutate({ id, status: newStatus });
  };
  const { setIsAddModalOpen } = useProjectStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
              <p className="text-muted-foreground">
                Gerencie todos os seus projetos em um só lugar
              </p>
            </div>
            <NewProjectDialog />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: ProjectStatus | 'all') => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="NOT_INITIALIZED">Não iniciado</SelectItem>
                <SelectItem value="IN_PROGRESS">Em progresso</SelectItem>
                <SelectItem value="completed">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Carregando projetos...</p>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhum projeto encontrado com os filtros aplicados.'
                : 'Nenhum projeto encontrado. Crie seu primeiro projeto!'}
            </div>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
      <FloatingNewProjectButton />
      <MobileBottomNav />
    </div>
  );
}
