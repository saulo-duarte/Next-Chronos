'use client';

import { useProjectStore } from '@/stores/useProjectStore';
import { useCreateProject, useUpdateProject, ProjectStatus } from '@/hooks/data/useProjectQuery';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

export function ProjectFormDialog() {
  const {
    isAddModalOpen,
    editingProjectId,
    setIsAddModalOpen,
    newProjectForm,
    setNewProjectForm,
    resetNewProjectForm,
  } = useProjectStore();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const handleSubmit = () => {
    if (!newProjectForm.title.trim()) return;

    if (editingProjectId) {
      updateProject.mutate(
        {
          id: editingProjectId,
          ...newProjectForm,
        },
        {
          onSuccess: () => {
            resetNewProjectForm();
            setIsAddModalOpen(false);
          },
        }
      );
    } else {
      createProject.mutate(
        {
          title: newProjectForm.title,
          description: newProjectForm.description,
          status: newProjectForm.status,
          created_at: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            resetNewProjectForm();
            setIsAddModalOpen(false);
          },
        }
      );
    }
  };

  const isSubmitting = createProject.isPending || updateProject.isPending;

  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        {' '}
        <DialogHeader>
          <DialogTitle>{editingProjectId ? 'Editar Projeto' : 'Criar Novo Projeto'}</DialogTitle>
          <DialogDescription>
            {editingProjectId
              ? 'Atualize as informações do projeto selecionado.'
              : 'Adicione um novo projeto à sua lista. Preencha as informações abaixo.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={newProjectForm.title}
              onChange={(e) => setNewProjectForm({ title: e.target.value })}
              placeholder="Nome do projeto"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newProjectForm.description}
              onChange={(e) => setNewProjectForm({ description: e.target.value })}
              placeholder="Descrição opcional do projeto"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newProjectForm.status}
              onValueChange={(value: ProjectStatus) => setNewProjectForm({ status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_INITIALIZED">Não iniciado</SelectItem>
                <SelectItem value="IN_PROGRESS">Em progresso</SelectItem>
                <SelectItem value="COMPLETED">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!newProjectForm.title.trim() || isSubmitting}>
            {isSubmitting
              ? editingProjectId
                ? 'Atualizando...'
                : 'Criando...'
              : editingProjectId
                ? 'Salvar'
                : 'Criar Projeto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
