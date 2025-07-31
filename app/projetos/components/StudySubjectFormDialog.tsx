'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStudySubjectStore } from '@/stores/useSubjectStore';
import { useCreateStudySubject, useUpdateStudySubject } from '@/hooks/data/useStudySubjectQuery';

export function StudySubjectFormDialog() {
  const {
    isAddModalOpen,
    editingStudySubjectId,
    setIsAddModalOpen,
    newStudySubjectForm,
    setNewStudySubjectForm,
    resetNewStudySubjectForm,
    setEditingStudySubjectId,
  } = useStudySubjectStore();

  const createSubject = useCreateStudySubject();
  const updateSubject = useUpdateStudySubject();

  const handleSubmit = () => {
    if (!newStudySubjectForm.name.trim()) return;

    const now = new Date().toISOString();
    const data = {
      name: newStudySubjectForm.name,
      description: newStudySubjectForm.description,
      created_at: now,
      updated_at: now,
    };

    if (editingStudySubjectId) {
      updateSubject.mutate(
        { id: editingStudySubjectId, ...data },
        {
          onSuccess: () => {
            resetNewStudySubjectForm();
            setEditingStudySubjectId(null);
            setIsAddModalOpen(false);
          },
        }
      );
    } else {
      createSubject.mutate(data, {
        onSuccess: () => {
          resetNewStudySubjectForm();
          setIsAddModalOpen(false);
        },
      });
    }
  };

  const isSubmitting = createSubject.isPending || updateSubject.isPending;

  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {editingStudySubjectId ? 'Editar Assunto' : 'Criar Novo Assunto'}
          </DialogTitle>
          <DialogDescription>
            {editingStudySubjectId
              ? 'Atualize as informações do assunto de estudo.'
              : 'Adicione um novo assunto de estudo para organizar seus tópicos.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={newStudySubjectForm.name}
              onChange={(e) => setNewStudySubjectForm({ name: e.target.value })}
              placeholder="Ex: Docker, Git, Kubernetes..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newStudySubjectForm.description}
              onChange={(e) => setNewStudySubjectForm({ description: e.target.value })}
              placeholder="Breve descrição do assunto (opcional)"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!newStudySubjectForm.name.trim() || isSubmitting}
          >
            {isSubmitting
              ? editingStudySubjectId
                ? 'Atualizando...'
                : 'Criando...'
              : editingStudySubjectId
                ? 'Salvar'
                : 'Criar Assunto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
