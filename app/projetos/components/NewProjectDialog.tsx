import { useProjectStore } from '@/stores/useProjectStore';
import { useCreateProject, ProjectStatus } from '@/hooks/data/useProjectQuery';
import {
  Dialog,
  DialogTrigger,
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
import { Plus } from 'lucide-react';
import { FloatingNewProjectButton } from './FloatingNewProjectButton';

export function NewProjectDialog() {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    newProjectForm,
    setNewProjectForm,
    resetNewProjectForm,
  } = useProjectStore();

  const createProject = useCreateProject();

  const handleAddProject = () => {
    if (!newProjectForm.title.trim()) return;

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
  };

  return (
    <>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full flex flex-col items-center w-auto flex-row">
            <Plus className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
            Novo Projeto
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
            <DialogDescription>
              Adicione um novo projeto à sua lista. Preencha as informações básicas abaixo.
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
                  <SelectValue />
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
            <Button
              onClick={handleAddProject}
              disabled={!newProjectForm.title.trim() || createProject.isPending}
            >
              {createProject.isPending ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FloatingNewProjectButton />
    </>
  );
}
