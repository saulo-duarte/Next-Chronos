'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/stores/useTaskStore';
import { TaskEditFormContent } from './TaskEditFormContent';

export function TaskEditDialog() {
  const { isEditDrawerOpen, setEditDrawerOpen, setEditingTask } = useTaskStore();

  const handleClose = () => {
    setEditDrawerOpen(false);
    setEditingTask(null);
  };

  return (
    <Dialog open={isEditDrawerOpen} onOpenChange={setEditDrawerOpen}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader className="pb-0">
          <DialogTitle className="sr-only">Editar Tarefa</DialogTitle>
        </DialogHeader>

        <TaskEditFormContent
          onClose={handleClose}
          closeComponent={
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                Fechar
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
