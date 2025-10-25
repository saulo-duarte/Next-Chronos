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
import { useQuizStore } from '@/stores/useQuizStore';

interface QuizConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (config: {
    tema: string;
    dificuldade: string;
    quantidade: number;
    contextoProva?: string;
  }) => void;
}

export function QuizConfigDialog({ open, onOpenChange, onStart }: QuizConfigDialogProps) {
  const [tema, setTema] = useState('');
  const [dificuldade, setDificuldade] = useState('Médio');
  const [quantidade, setQuantidade] = useState(5);
  const [contextoProva, setContextoProva] = useState('');

  const setConfig = useQuizStore((state) => state.setConfig);

  const handleStart = () => {
    if (!tema.trim()) return;
    const validQuantidade = Math.min(Math.max(quantidade, 1), 10);
    const config = { tema, dificuldade, quantidade: validQuantidade, contextoProva };
    setConfig(config);
    onStart(config);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Quiz</DialogTitle>
          <DialogDescription>
            Personalize seu quiz escolhendo o tema, dificuldade, quantidade de questões e contexto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tema */}
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
            <Label htmlFor="contexto">Contexto da Prova (opcional)</Label>
            <textarea
              id="contexto"
              value={contextoProva}
              onChange={(e) => setContextoProva(e.target.value)}
              placeholder="Ex: Prova de Big Data, simulado de Análise de Dados..."
              className="w-full p-2 rounded-md border border-gray-700 bg-background text-white focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dificuldade">Dificuldade</Label>
            <Select value={dificuldade} onValueChange={setDificuldade}>
              <SelectTrigger id="dificuldade" className="w-full">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(q - 1, 1))}
                className="px-3 py-1 bg-gray-700 rounded-md text-white hover:bg-gray-600"
              >
                -
              </button>
              <Input
                id="quantidade"
                type="number"
                value={quantidade}
                min={1}
                max={10}
                onChange={(e) => {
                  let val = Number(e.target.value);
                  if (isNaN(val)) val = 1;
                  setQuantidade(Math.min(Math.max(val, 1), 10));
                }}
                className="text-center appearance-none w-16"
                style={{ MozAppearance: 'textfield' }}
              />
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.min(q + 1, 10))}
                className="px-3 py-1 bg-gray-700 rounded-md text-white hover:bg-gray-600"
              >
                +
              </button>
            </div>
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
