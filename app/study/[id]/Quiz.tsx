'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Question, useAIQuiz, AIQuizPayload } from '@/hooks/data/useAIQuiz';
import { QuizConfigDialog } from '../components/QuizDialogConfig';
import { QuizResults } from '../components/QuizResults';
import { QuizQuestion } from '../components/QuizQuestion';
import { Maximize2, ArrowLeft } from 'lucide-react';

export function Quiz({
  subjectId,
  focusMode = false,
  setFocusMode,
}: {
  subjectId: string;
  focusMode?: boolean;
  setFocusMode?: (v: boolean) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const quizMutation = useAIQuiz();
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResults && setFocusMode) {
      setFocusMode(false);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    }
  }, [showResults, setFocusMode]);

  const handleStartQuiz = (payload: AIQuizPayload) => {
    quizMutation.mutate(payload, {
      onSuccess(data) {
        setQuestions(data);
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setIsDialogOpen(false);
      },
    });
  };

  const handleToggleFocus = () => {
    setFocusMode?.(!focusMode);
  };

  const handleFullscreen = async () => {
    if (quizRef.current && !document.fullscreenElement) {
      await quizRef.current.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={quizRef}
      className={`relative min-h-screen w-full bg-background ${
        focusMode ? 'fixed inset-0 z-50 flex flex-col' : ''
      }`}
    >
      <div className="flex gap-2 justify-end sticky top-0 bg-background z-10">
        {focusMode ? (
          <Button variant="ghost" onClick={handleToggleFocus}>
            <ArrowLeft className="w-4 h-4" />
            Sair do modo foco
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={handleToggleFocus}>
              <Maximize2 className="w-4 h-4" />
              Modo foco
            </Button>
            <div className="hidden sm:block">
              <Button variant="outline" onClick={handleFullscreen}>
                <Maximize2 className="w-4 h-4" />
                Tela cheia
              </Button>
            </div>
          </>
        )}
      </div>

      {questions.length === 0 && !quizMutation.isPending && (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-6 p-2 sm:p-8">
            <h1 className="text-4xl font-bold">Quiz Interativo</h1>
            <p className="text-muted-foreground text-lg">
              Teste seus conhecimentos com questões personalizadas
            </p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)}>
              Começar Quiz
            </Button>
          </div>

          <QuizConfigDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onStart={handleStartQuiz}
          />
        </div>
      )}

      {quizMutation.isPending && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted-foreground">Gerando perguntas...</p>
        </div>
      )}

      {showResults && !quizMutation.isPending && (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <QuizResults
            subjectId={subjectId}
            questions={questions}
            userAnswers={userAnswers}
            onRestart={() => {
              setQuestions([]);
              setShowResults(false);
            }}
          />
        </div>
      )}

      {!showResults && questions.length > 0 && !quizMutation.isPending && (
        <div className="min-h-screen flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-full">
            <QuizQuestion
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={userAnswers[currentQuestionIndex]}
              onAnswer={(a) => {
                const newAnswers = [...userAnswers];
                newAnswers[currentQuestionIndex] = a;
                setUserAnswers(newAnswers);
              }}
              onNext={() => {
                if (currentQuestionIndex < questions.length - 1)
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                else setShowResults(true);
              }}
              onPrevious={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
              canGoBack={currentQuestionIndex > 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
            />
          </div>
        </div>
      )}
    </div>
  );
}
