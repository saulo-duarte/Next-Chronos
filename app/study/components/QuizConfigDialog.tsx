'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QuizConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (payload: { topic: string; quantidade: number; dificuldade: string }) => void;
}

export function QuizConfigDialog({ open, onOpenChange, onStart }: QuizConfigDialogProps) {
  const [topic, setTopic] = useState('');
  const [quantidade, setQuantidade] = useState(5);
  const [dificuldade, setDificuldade] = useState('medio');

  const handleStart = () => {
    if (!topic) return;
    onStart({ topic, quantidade, dificuldade });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurar Quiz</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tema</label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium">Quantidade de perguntas</label>
            <Input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Dificuldade</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
            >
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <Button className="w-full" onClick={handleStart}>
            Gerar Perguntas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
