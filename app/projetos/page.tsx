'use client';

import { useState } from 'react';
import {
  useProjects,
  useDeleteProject,
  useUpdateProject,
  ProjectStatus,
} from '@/hooks/data/useProjectQuery';

import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectFormDialog } from './components/ProjectDialog';
import { useProjectStore } from '@/stores/useProjectStore';
import { ProjectCard } from './components/ProjectCard';
import { FloatingNewProjectButton } from './components/FloatingNewProjectButton';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const safeProjects = Array.isArray(projects) ? projects : [];
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();
  const { setIsAddModalOpen } = useProjectStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');

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

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="sm:hidden">
        <h1 className="text-2xl font-semibold py-4 px-2">Meus Projetos</h1>
        <ProjectFormDialog />

        <Tabs defaultValue={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <TabsList className="w-full grid grid-cols-4 gap-2 bg-background">
            <TabsTrigger value="all" className="sm:text-base text-xs">
              Todos
            </TabsTrigger>
            <TabsTrigger value="NOT_INITIALIZED" className="sm:text-base text-xs">
              Não iniciado
            </TabsTrigger>
            <TabsTrigger value="IN_PROGRESS" className="sm:text-base text-xs">
              Andamento
            </TabsTrigger>
            <TabsTrigger value="completed" className="sm:text-base text-xs">
              Finalizado
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <p className="text-center text-muted-foreground mt-6">Carregando projetos...</p>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhum projeto encontrado com os filtros aplicados.'
                : 'Nenhum projeto encontrado. Crie seu primeiro projeto!'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
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

      <div className="hidden sm:flex flex-col gap-6 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
            <p className="text-muted-foreground">Gerencie todos os seus projetos em um só lugar</p>
          </div>

          <Button onClick={() => setIsAddModalOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Novo Projeto
          </Button>
        </div>

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
            <SelectTrigger className="w-full sm:w-[200px]">
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

        {/* Grid de projetos */}
        {isLoading ? (
          <p className="text-center text-muted-foreground mt-6">Carregando projetos...</p>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhum projeto encontrado com os filtros aplicados.'
                : 'Nenhum projeto encontrado. Crie seu primeiro projeto!'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
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
