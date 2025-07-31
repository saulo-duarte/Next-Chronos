'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMobile } from '@/hooks/useMobile';
import { useCreateStudyTopic } from '@/hooks/data/useStudyTopicQuery';
import { useStudyTopicStore } from '@/stores/useTopicStore';

export function StudyTopicModal({ topicCount }: { topicCount: number }) {
  const isMobile = useMobile();
  const {
    isTopicModalOpen,
    setIsTopicModalOpen,
    newStudyTopicForm,
    setNewStudyTopicForm,
    resetNewStudyTopicForm,
    parentSubjectId,
    editingTopicId,
    setEditingTopicId,
  } = useStudyTopicStore();

  const createTopic = useCreateStudyTopic();

  const isLoading = createTopic.isPending;

  const handleClose = () => {
    setIsTopicModalOpen(false);
    resetNewStudyTopicForm();
    setEditingTopicId(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    console.log('Creating topic with data:', {
      name: newStudyTopicForm.name.trim(),
      description: newStudyTopicForm.description.trim(),
      subjectId: parentSubjectId,
    });

    if (!newStudyTopicForm.name.trim() || !parentSubjectId) return;

    await createTopic.mutateAsync({
      name: newStudyTopicForm.name.trim(),
      description: newStudyTopicForm.description.trim(),
      position: topicCount + 1,
      subjectId: parentSubjectId,
    });

    handleClose();
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic-name">Nome do Tópico</Label>
        <Input
          id="topic-name"
          value={newStudyTopicForm.name}
          onChange={(e) => setNewStudyTopicForm({ name: e.target.value })}
          placeholder="Ex: Daemon, CLI, Conceitos básicos..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic-description">Descrição</Label>
        <Textarea
          id="topic-description"
          value={newStudyTopicForm.description}
          onChange={(e) => setNewStudyTopicForm({ description: e.target.value })}
          placeholder="Descreva brevemente o que será estudado neste tópico..."
          rows={3}
        />
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isTopicModalOpen} onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editingTopicId ? 'Editar Tópico' : 'Novo Tópico'}</DrawerTitle>
            <DrawerDescription>
              {editingTopicId ? 'Atualize o tópico de estudo' : 'Criar um novo tópico de estudo'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter>
            <Button onClick={handleSubmit} disabled={!newStudyTopicForm.name.trim() || isLoading}>
              {isLoading ? 'Salvando...' : editingTopicId ? 'Salvar' : 'Criar Tópico'}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isTopicModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTopicId ? 'Editar Tópico' : 'Novo Tópico'}</DialogTitle>
          <DialogDescription>
            {editingTopicId ? 'Atualize o tópico de estudo' : 'Criar um novo tópico de estudo'}
          </DialogDescription>
        </DialogHeader>
        {formContent}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!newStudyTopicForm.name.trim() || isLoading}>
            {isLoading ? 'Salvando...' : editingTopicId ? 'Salvar' : 'Criar Tópico'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
