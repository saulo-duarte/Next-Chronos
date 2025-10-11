'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/stores/useTaskStore';
import { TaskEditFormContent } from './TaskEditFormContent';

export function TaskEditDrawer() {
  const { isEditDrawerOpen, setEditDrawerOpen, setEditingTask } = useTaskStore();

  const handleClose = () => {
    setEditDrawerOpen(false);
    setEditingTask(null);
  };

  return (
    <Drawer open={isEditDrawerOpen} onOpenChange={setEditDrawerOpen} modal={false}>
      <DrawerContent
        className="bg-slate-900 border-slate-800 text-white"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          // Permite cliques em popovers e portais do Radix UI
          const target = e.target as HTMLElement;
          if (
            target.closest('[data-radix-popper-content-wrapper]') ||
            target.closest('[data-radix-portal]') ||
            target.closest('[role="dialog"]')
          ) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          // Permite interações com popovers
          const target = e.target as HTMLElement;
          if (
            target.closest('[data-radix-popper-content-wrapper]') ||
            target.closest('[data-radix-portal]') ||
            target.closest('[role="dialog"]')
          ) {
            e.preventDefault();
          }
        }}
      >
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="sr-only">Editar Tarefa</DrawerTitle>
          </DrawerHeader>

          <div className="px-4">
            <TaskEditFormContent
              onClose={handleClose}
              closeComponent={
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  >
                    Fechar
                  </Button>
                </DrawerClose>
              }
            />
          </div>
          <DrawerFooter className="sr-only" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
