'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTaskStore } from '@/stores/useTaskStore';
import { TaskStatus, TaskPriority } from '@/types/Task';

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterSheet({ open, onOpenChange }: FilterSheetProps) {
  const { filters, setFilters, clearFilters } = useTaskStore();
  const [localFilters, setLocalFilters] = useState(filters);

  const toggleArrayFilter = <T,>(key: keyof typeof localFilters, value: T) => {
    setLocalFilters((prev) => {
      const current = Array.isArray(prev[key]) ? (prev[key] as T[]) : [];
      const isActive = current.includes(value);
      const updated = isActive ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      status: [],
      priority: [],
    };
    setLocalFilters(cleared);
    clearFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="py-2 px-4"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-white">Filtros</SheetTitle>
        </SheetHeader>

        <motion.div
          className="py-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <Label className="text-lg font-semibold mb-4 block">Status</Label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'TODO', label: 'A fazer' },
                { value: 'IN_PROGRESS', label: 'Em Progresso' },
                { value: 'DONE', label: 'Finalizado' },
              ].map((status) => {
                const active = (localFilters.status ?? []).includes(status.value as TaskStatus);
                return (
                  <Button
                    key={status.value}
                    variant={active ? 'default' : 'outline'}
                    className={`text-sm ${
                      active ? 'bg-primary text-white' : 'border-slate-600 text-slate-300'
                    }`}
                    onClick={() => toggleArrayFilter('status', status.value)}
                  >
                    {status.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block">Prioridade</Label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'HIGH', label: 'Alta' },
                { value: 'MEDIUM', label: 'Média' },
                { value: 'LOW', label: 'Baixa' },
              ].map((priority) => {
                const active = (localFilters.priority ?? []).includes(
                  priority.value as TaskPriority
                );
                return (
                  <Button
                    key={priority.value}
                    variant={active ? 'default' : 'outline'}
                    className={`text-sm ${
                      active ? 'bg-primary text-white' : 'border-slate-600 text-slate-300'
                    }`}
                    onClick={() => toggleArrayFilter('priority', priority.value)}
                  >
                    {priority.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Limpar
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
