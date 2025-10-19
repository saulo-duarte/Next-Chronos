'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Maximize2, ArrowLeft } from 'lucide-react';
import { QuizResults } from '../components/QuizResults';
import {
  QuizQuestion as QuizQuestionType,
  useListQuizzes,
  useQuizWithQuestions,
} from '@/hooks/data/useQuiz';
import { QuizQuestion } from '../components/QuizQuestion';
import { Question, useAIQuiz, AIQuizPayload } from '@/hooks/data/useAIQuiz';
import { QuizConfigDialog } from '../components/QuizDialogConfig';

interface QuizCardProps {
  topic: string;
  total_questions: number;
  quizId: string;
  onSelect: (quizId: string, topic: string) => void;
}

function QuizCard({ topic, total_questions, quizId, onSelect }: QuizCardProps) {
  return (
    <button
      onClick={() => onSelect(quizId, topic)}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer h-full text-left hover:bg-accent"
    >
      <div className="flex items-start gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">{topic}</h3>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{total_questions} questões</span>
      </div>
    </button>
  );
}

export function mapQuizQuestionToQuestion(q: QuizQuestionType, topic: string): Question {
  return {
    tema: topic,
    dificuldade: '',
    pergunta: q.content,
    alternativas: [q.options.a, q.options.b, q.options.c, q.options.d],
    resposta_correta: q.correct_answer,
  };
}

export function UnifiedQuiz({ subjectId }: { subjectId: string }) {
  const { data: quizzes, isLoading, error } = useListQuizzes();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const { data: quizData, isLoading: isLoadingQuiz } = useQuizWithQuestions(selectedQuizId || '');
  console.log('Loaded quiz data:', quizData);
  const quizMutation = useAIQuiz();
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResults && focusMode) {
      setFocusMode(false);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    }
  }, [showResults, focusMode]);

  const handleSelectQuiz = (quizId: string, topic: string) => {
    setSelectedQuizId(quizId);
    setSelectedTopic(topic);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setIsCreatingNew(false);
  };

  const handleCreateNewQuiz = () => {
    setIsCreatingNew(true);
    setIsDialogOpen(true);
  };

  const handleStartNewQuiz = (payload: AIQuizPayload) => {
    quizMutation.mutate(payload, {
      onSuccess(data) {
        setQuestions(data);
        setSelectedTopic('Novo Quiz');
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setIsDialogOpen(false);
      },
    });
  };

  const handleToggleFocus = () => {
    setFocusMode(!focusMode);
  };

  const handleFullscreen = async () => {
    if (quizRef.current && !document.fullscreenElement) {
      await quizRef.current.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
  };

  const handleBackToList = () => {
    setSelectedQuizId(null);
    setSelectedTopic('');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setIsCreatingNew(false);
    setQuestions([]);
  };

  if ((selectedQuizId && quizData) || (isCreatingNew && questions.length > 0)) {
    const currentQuestions = isCreatingNew
      ? questions
      : quizData
        ? quizData.questions.map((q) => mapQuizQuestionToQuestion(q, selectedTopic))
        : [];

    const isLoadingCurrent = isCreatingNew ? quizMutation.isPending : isLoadingQuiz;

    return (
      <div
        ref={quizRef}
        className={`relative min-h-screen w-full bg-background ${
          focusMode ? 'fixed inset-0 z-50 flex flex-col' : ''
        }`}
      >
        <div className="flex gap-2 justify-between items-center sticky top-0 bg-background z-10 p-4 border-b">
          <Button variant="ghost" onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="text-center flex-1">
            <h2 className="font-semibold text-lg text-foreground">{selectedTopic}</h2>
          </div>

          <div className="flex gap-2">
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
        </div>

        {isLoadingCurrent && (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-muted-foreground">
              {isCreatingNew ? 'Gerando perguntas...' : 'Carregando quiz...'}
            </p>
          </div>
        )}

        {showResults && !isLoadingCurrent && (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <QuizResults
              subjectId={subjectId}
              questions={currentQuestions}
              userAnswers={userAnswers}
              onRestart={() => {
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setShowResults(false);
              }}
            />
          </div>
        )}

        {!showResults && currentQuestions.length > 0 && !isLoadingCurrent && (
          <div className="min-h-screen flex items-center justify-center py-8 px-4">
            <div className="w-full max-w-full">
              <QuizQuestion
                question={currentQuestions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={currentQuestions.length}
                selectedAnswer={userAnswers[currentQuestionIndex]}
                onAnswer={(a) => {
                  const newAnswers = [...userAnswers];
                  newAnswers[currentQuestionIndex] = a;
                  setUserAnswers(newAnswers);
                }}
                onNext={() => {
                  if (currentQuestionIndex < currentQuestions.length - 1)
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  else setShowResults(true);
                }}
                onPrevious={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                canGoBack={currentQuestionIndex > 0}
                isLastQuestion={currentQuestionIndex === currentQuestions.length - 1}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Lista de quizzes existentes
  return (
    <div className="relative min-h-screen bg-background p-6 sm:p-8">
      <div className="fixed bottom-8 right-8 z-40">
        <Button size="lg" className="rounded-full shadow-lg" onClick={handleCreateNewQuiz}>
          <Plus className="w-5 h-5 mr-2" />
          Novo Quiz
        </Button>
      </div>

      <QuizConfigDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onStart={handleStartNewQuiz}
      />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Meus Quizzes</h1>
          <p className="text-muted-foreground">
            {quizzes?.length
              ? `Você tem ${quizzes.length} quiz${quizzes.length !== 1 ? 'zes' : ''}`
              : 'Nenhum quiz criado ainda'}
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center min-h-96">
            <p className="text-lg text-muted-foreground">Carregando quizzes...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">Erro ao carregar quizzes. Tente novamente.</p>
          </div>
        )}

        {!isLoading && !quizzes?.length && (
          <div className="flex flex-col items-center justify-center min-h-96 text-center space-y-4">
            <BookOpen className="w-16 h-16 text-muted-foreground/50" />
            <div>
              <h2 className="text-2xl font-semibold mb-2">Nenhum quiz criado</h2>
              <p className="text-muted-foreground mb-6">
                Comece criando seu primeiro quiz para testar seus conhecimentos
              </p>
              <Button onClick={handleCreateNewQuiz}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Quiz
              </Button>
            </div>
          </div>
        )}

        {!isLoading && quizzes && quizzes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quizId={quiz.id}
                topic={quiz.topic}
                total_questions={quiz.total_questions}
                onSelect={handleSelectQuiz}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
