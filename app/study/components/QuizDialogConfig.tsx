'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuizConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (config: { tema: string; dificuldade: string; quantidade: number }) => void;
}

export function QuizConfigDialog({ open, onOpenChange, onStart }: QuizConfigDialogProps) {
  const [tema, setTema] = useState('JavaScript');
  const [dificuldade, setDificuldade] = useState('Médio');
  const [quantidade, setQuantidade] = useState(5);

  const handleStart = () => {
    onStart({ tema, dificuldade, quantidade });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Quiz</DialogTitle>
          <DialogDescription>
            Personalize seu quiz escolhendo o tema, dificuldade e quantidade de questões.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tema">Tema</Label>
            <Input
              id="tema"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: JavaScript, React, CSS..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dificuldade">Dificuldade</Label>
            <Select value={dificuldade} onValueChange={setDificuldade}>
              <SelectTrigger id="dificuldade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade de Questões</Label>
            <Input
              id="quantidade"
              type="number"
              min={1}
              max={20}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleStart} className="w-full">
            Iniciar Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
