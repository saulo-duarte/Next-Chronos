'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Question } from '@/hooks/data/useAIQuiz';

interface QuizResultsProps {
  questions: Question[];
  userAnswers: string[];
  onRestart: () => void;
}

export function QuizResults({ questions, userAnswers, onRestart }: QuizResultsProps) {
  const correctAnswers = questions.filter((q, index) => {
    const correctLetter = q.resposta_correta.toUpperCase();
    const selectedAlternative = userAnswers[index];
    if (!selectedAlternative) return false;
    const selectedIndex = q.alternativas.indexOf(selectedAlternative);
    const selectedLetter = selectedIndex !== -1 ? String.fromCharCode(65 + selectedIndex) : '';
    return correctLetter === selectedLetter;
  }).length;

  const score = Math.round((correctAnswers / questions.length) * 100);

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = () => {
    if (score >= 80) return 'Excelente! 🎉';
    if (score >= 60) return 'Bom trabalho! 👍';
    return 'Continue praticando! 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl">Quiz Finalizado!</CardTitle>
            <div className="space-y-2">
              <div className={`text-6xl font-bold ${getScoreColor()}`}>{score}%</div>
              <p className="text-xl text-muted-foreground">
                {correctAnswers} de {questions.length} questões corretas
              </p>
              <p className="text-lg font-medium">{getScoreMessage()}</p>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={onRestart} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Fazer Novo Quiz
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Revisão das Questões</h2>
          {questions.map((question, index) => {
            const correctLetter = question.resposta_correta.toUpperCase();
            const userAnswer = userAnswers[index];
            const selectedIndex = userAnswer ? question.alternativas.indexOf(userAnswer) : -1;
            const userLetter = selectedIndex !== -1 ? String.fromCharCode(65 + selectedIndex) : '';
            const correctIndex = correctLetter.charCodeAt(0) - 65;
            const isCorrect = correctLetter === userLetter;

            return (
              <Card key={index} className="shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Questão {index + 1}</Badge>
                        <Badge variant="outline">{question.dificuldade}</Badge>
                        {isCorrect ? (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Correta
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Incorreta
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold leading-relaxed">{question.pergunta}</h3>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {question.alternativas.map((alternativa, altIndex) => {
                    const letter = String.fromCharCode(65 + altIndex);
                    const isUserAnswer = letter === userLetter;
                    const isCorrectAnswer = altIndex === correctIndex;

                    let className = 'p-3 rounded-lg border-2 ';
                    if (isCorrectAnswer) {
                      className += 'border-green-600 bg-green-50 dark:bg-green-950/30';
                    } else if (isUserAnswer && !isCorrect) {
                      className += 'border-red-600 bg-red-50 dark:bg-red-950/30';
                    } else {
                      className += 'border-border bg-muted/30';
                    }

                    return (
                      <div key={altIndex} className={className}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                            {letter}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="leading-relaxed">{alternativa}</p>
                            {isCorrectAnswer && (
                              <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Resposta correta
                              </p>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <p className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Sua resposta
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
