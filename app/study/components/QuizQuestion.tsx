'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from '@/hooks/data/useAIQuiz';

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

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{question.tema}</Badge>
          <Badge variant="outline">{question.dificuldade}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Questão {questionNumber} de {totalQuestions}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h2 className="text-xl font-semibold leading-relaxed text-balance">{question.pergunta}</h2>
      </CardHeader>

      <CardContent className="space-y-3">
        {question.alternativas.map((alternativa, index) => (
          <button
            key={index}
            onClick={() => onAnswer(alternativa)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
              selectedAnswer === alternativa
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  selectedAnswer === alternativa
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 leading-relaxed">{alternativa}</span>
            </div>
          </button>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" onClick={onPrevious} disabled={!canGoBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        <Button onClick={onNext} disabled={!selectedAnswer}>
          {isLastQuestion ? 'Ver Resultados' : 'Próxima'}
          {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
