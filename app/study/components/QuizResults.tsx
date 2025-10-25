'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/hooks/data/useAIQuiz';
import { useQuizStore } from '@/stores/useQuizStore';
import { Save, RotateCcw, CheckCircle2, XCircle, Info } from 'lucide-react';
import { useCreateQuiz } from '@/hooks/data/useQuiz';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return 'Excelente! 🎉';
    if (percentage >= 80) return 'Muito bom! 👏';
    if (percentage >= 60) return 'Bom trabalho! 👍';
    if (percentage >= 40) return 'Continue estudando! 📚';
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
          explanation: q.explicacao || '',
          order_index: idx,
        })),
      };

      await createQuiz.mutateAsync(payload);
      toast.success(`${selectedQuestions.length} questões salvas na sua coleção`);
      resetStore();
      onRestart();
    } catch {
      toast.error('Falha ao salvar quiz');
    }
  };

  return (
    <div className="w-full space-y-8 px-4 pb-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-3xl font-bold tracking-tight">Seu Desempenho</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <div className={`text-7xl font-extrabold ${getPerformanceColor()}`}>{percentage}%</div>
            <p className="text-lg font-medium text-muted-foreground">
              {correctCount} de {questions.length} corretas
            </p>
            <p className={`text-base font-semibold ${getPerformanceColor()}`}>
              {getPerformanceMessage()}
            </p>
          </motion.div>

          <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                percentage >= 80
                  ? 'bg-emerald-500'
                  : percentage >= 60
                    ? 'bg-blue-500'
                    : percentage >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
              <p className="text-3xl font-bold">{correctCount}</p>
              <p className="text-sm font-medium">Corretas</p>
            </div>
            <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800 text-rose-700 dark:text-rose-300">
              <p className="text-3xl font-bold">{questions.length - correctCount}</p>
              <p className="text-sm font-medium">Erradas</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border text-foreground">
              <p className="text-3xl font-bold">{questions.length}</p>
              <p className="text-sm font-medium">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Revisão das Questões</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto space-y-4 pr-2">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.resposta_correta;

            let isCorrect = false;
            let correctAlternative = correctAnswer;
            if (correctAnswer.match(/^[A-D]$/i)) {
              const correctIndex = correctAnswer.toUpperCase().charCodeAt(0) - 65;
              correctAlternative = question.alternativas[correctIndex];
              isCorrect = userAnswer === correctAlternative;
            } else {
              isCorrect = userAnswer === correctAnswer;
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-5 rounded-xl border-2 ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
                    : 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 mt-1 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 mt-1 text-rose-600" />
                  )}

                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-foreground text-sm leading-relaxed">
                      {index + 1}. {question.pergunta}
                    </p>

                    <div
                      className={`text-sm px-3 py-2 rounded-lg font-medium ${
                        isCorrect
                          ? 'bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100'
                          : 'bg-rose-100/60 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100'
                      }`}
                    >
                      Sua resposta: {userAnswer}
                    </div>

                    {!isCorrect && (
                      <div className="text-sm px-3 py-2 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100">
                        Resposta correta: {correctAnswer}) {correctAlternative}
                      </div>
                    )}

                    {question.explicacao && (
                      <div className="flex items-start gap-2 mt-2 bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground border border-border/40">
                        <Info className="w-4 h-4 mt-0.5 text-primary" />
                        <p>{question.explicacao}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 justify-center pt-4">
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
