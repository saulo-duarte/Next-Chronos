'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/hooks/data/useAIQuiz';
import { useQuizStore } from '@/stores/useQuizStore';
import { Save, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { useCreateQuiz } from '@/hooks/data/useQuiz';
import { toast } from 'sonner';

interface QuizResultsProps {
  questions: Question[];
  userAnswers: string[];
  onRestart: () => void;
  subjectId: string;
}

export function QuizResults({ questions, userAnswers, onRestart, subjectId }: QuizResultsProps) {
  const { config, selectedQuestions, reset: resetStore } = useQuizStore();
  const createQuiz = useCreateQuiz();

  const correctCount = questions.reduce((acc, question, index) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = question.resposta_correta;

    if (correctAnswer.match(/^[A-D]$/i)) {
      const correctIndex = correctAnswer.toUpperCase().charCodeAt(0) - 65;
      const correctAlternative = question.alternativas[correctIndex];
      return userAnswer === correctAlternative ? acc + 1 : acc;
    }

    return userAnswer === correctAnswer ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / questions.length) * 100);

  const getPerformanceColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return 'Excelente! 🎉';
    if (percentage >= 80) return 'Muito bom! 👏';
    if (percentage >= 60) return 'Bom trabalho! 👍';
    if (percentage >= 40) return 'Continua estudando! 📚';
    return 'Tente novamente! 💪';
  };

  const handleSaveQuiz = async () => {
    if (!config || selectedQuestions.length === 0) {
      toast.error('Selecione pelo menos uma questão para salvar');
      return;
    }

    try {
      const payload = {
        quiz: {
          user_id: 'e7b64701-1d11-4e96-852e-1afe953b2e5f',
          subject_id: subjectId ?? '',
          topic: config.tema,
          total_questions: selectedQuestions.length,
          correct_count: correctCount,
        },
        questions: selectedQuestions.map((q, idx) => ({
          content: q.pergunta,
          options: {
            a: q.alternativas[0],
            b: q.alternativas[1],
            c: q.alternativas[2],
            d: q.alternativas[3],
          },
          correct_answer: q.resposta_correta,
          explanation: '',
          order_index: idx,
        })),
      };

      console.log('Payload to save quiz:', payload);

      await createQuiz.mutateAsync(payload);

      toast.success(`${selectedQuestions.length} questões salvas na sua coleção`);

      resetStore();
      onRestart();
    } catch {
      toast.error('Falha ao salvar quiz');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl">Resultados do Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-3">
            <div className={`text-6xl font-bold ${getPerformanceColor()}`}>{percentage}%</div>
            <p className="text-lg font-medium text-foreground">
              {correctCount} de {questions.length} questões corretas
            </p>
            <p className={`text-base font-semibold ${getPerformanceColor()}`}>
              {getPerformanceMessage()}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  percentage >= 80
                    ? 'bg-green-500'
                    : percentage >= 60
                      ? 'bg-blue-500'
                      : percentage >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-green-600">{correctCount}</p>
              <p className="text-xs text-muted-foreground">Corretas</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-red-600">{questions.length - correctCount}</p>
              <p className="text-xs text-muted-foreground">Incorretas</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-primary">{questions.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Revisão das Questões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const correctAnswer = question.resposta_correta;

              let isCorrect = false;
              if (correctAnswer.match(/^[A-D]$/i)) {
                const correctIndex = correctAnswer.toUpperCase().charCodeAt(0) - 65;
                const correctAlternative = question.alternativas[correctIndex];
                isCorrect = userAnswer === correctAlternative;
              } else {
                isCorrect = userAnswer === correctAnswer;
              }

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCorrect
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
                      : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-semibold text-sm text-foreground">
                        {index + 1}. {question.pergunta}
                      </p>

                      <div
                        className={`text-sm p-2 rounded ${
                          isCorrect
                            ? 'bg-green-100/50 dark:bg-green-900/30 text-green-900 dark:text-green-100'
                            : 'bg-red-100/50 dark:bg-red-900/30 text-red-900 dark:text-red-100'
                        }`}
                      >
                        <span className="font-medium">Sua resposta: </span>
                        {userAnswer}
                      </div>

                      {!isCorrect && (
                        <div className="text-sm p-2 rounded bg-green-100/50 dark:bg-green-900/30 text-green-900 dark:text-green-100">
                          <span className="font-medium">Resposta correta: </span>
                          {correctAnswer.match(/^[A-D]$/i)
                            ? `${correctAnswer}) ${question.alternativas[correctAnswer.toUpperCase().charCodeAt(0) - 65]}`
                            : correctAnswer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" onClick={onRestart} className="gap-2" size="lg">
          <RotateCcw className="w-4 h-4" />
          Novo Quiz
        </Button>

        {selectedQuestions.length > 0 && (
          <Button
            onClick={handleSaveQuiz}
            disabled={createQuiz.isPending}
            className="gap-2"
            size="lg"
          >
            <Save className="w-4 h-4" />
            {createQuiz.isPending ? 'Salvando...' : `Salvar ${selectedQuestions.length} Questões`}
          </Button>
        )}
      </div>
    </div>
  );
}
