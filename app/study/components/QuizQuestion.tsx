'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { Question } from '@/hooks/data/useAIQuiz';
import { useQuizStore } from '@/stores/useQuizStore';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  isLastQuestion: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
  canGoBack,
  isLastQuestion,
}: QuizQuestionProps) {
  const progress = (questionNumber / totalQuestions) * 100;
  const { selectedQuestions, addSelectedQuestion, removeSelectedQuestion } = useQuizStore();

  const isSelected = selectedQuestions.some(
    (q) => q.pergunta === question.pergunta && q.resposta_correta === question.resposta_correta
  );

  const handleToggleSelect = () => {
    if (isSelected) {
      const index = selectedQuestions.findIndex(
        (q) => q.pergunta === question.pergunta && q.resposta_correta === question.resposta_correta
      );
      if (index !== -1) removeSelectedQuestion(index);
    } else {
      addSelectedQuestion(question);
    }
  };

  return (
    <Card className="shadow-lg w-full border rounded-xl overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleSelect}
            className="gap-2 text-xs sm:text-sm whitespace-nowrap"
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                Adicionado
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Adicionar
              </>
            )}
          </Button>
        </div>

        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
            <span>
              Questão {questionNumber} de {totalQuestions}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Enunciado */}
        <h2 className="text-base sm:text-lg font-semibold leading-relaxed break-words text-pretty">
          {question.pergunta}
        </h2>
      </CardHeader>

      <CardContent className="space-y-3">
        {question.alternativas.map((alternativa, index) => (
          <button
            key={index}
            onClick={() => onAnswer(alternativa)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm sm:text-base hover:border-primary/50 ${
              selectedAnswer === alternativa
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-medium ${
                  selectedAnswer === alternativa
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 leading-relaxed break-words text-pretty">{alternativa}</span>
            </div>
          </button>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoBack}
          className="flex-1 min-w-[120px] text-xs sm:text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedAnswer}
          className="flex-1 min-w-[120px] text-xs sm:text-sm"
        >
          {isLastQuestion ? 'Ver Resultados' : 'Próxima'}
          {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
