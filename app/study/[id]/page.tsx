'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FloatingNewStudyTopicButton } from '../components/FloatingNewStudyTopic';
import { useStudyTopics } from '@/hooks/data/useStudyTopicQuery';
import { TopicWithTasks } from './TopicWithTasks';
import { StudyTopicModal } from '../components/CreateTopicModal';
import { EventDialog } from '@/components/event-dialog';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import Image from 'next/image';
import { TaskEditDialog } from '@/components/task/TaskEditDialog';
import { FaBook } from 'react-icons/fa6';
import { AppHeader } from '@/components/AppHeader';
import { Quiz } from './Quiz';

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.id as string;
  const [focusMode, setFocusMode] = useState(false);

  const {
    data: topics,
    isLoading: isTopicsLoading,
    isError: isTopicsError,
  } = useStudyTopics(subjectId);

  const showEmptyState = !isTopicsLoading && !isTopicsError && topics?.length === 0;

  const breadcrumbs = [
    {
      label: 'Estudos',
      href: '/study',
      icon: <FaBook size={16} className="mr-2" />,
      isCurrent: false,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-y-auto">
      {!focusMode && <AppHeader breadcrumbs={breadcrumbs} />}

      <div className={`flex-1 px-2 md:px-6 ${focusMode ? 'p-0' : ''}`}>
        <Tabs defaultValue="tasks" className="flex flex-col flex-1">
          {!focusMode && (
            <div className="sticky top-[64px] z-40 bg-background px-1 pt-8 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/study">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <TabsList className="w-full bg-background">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
                <TabsTrigger value="flashcards">Flash Cards</TabsTrigger>
                <TabsTrigger value="files">Arquivos</TabsTrigger>
              </TabsList>
            </div>
          )}

          <div className={`flex-1 overflow-y-auto ${focusMode ? 'p-0' : 'px-4 pt-4 mb-20'}`}>
            {!focusMode && (
              <TabsContent value="tasks">
                {isTopicsLoading && <div className="text-slate-400">Carregando tópicos...</div>}
                {isTopicsError && <div className="text-red-400">Erro ao carregar os tópicos.</div>}

                {showEmptyState ? (
                  <div className="flex flex-col items-center text-center mt-16 px-4">
                    <Image src="/svg/Empty-Study.svg" width={350} height={350} alt="Sem tópicos" />
                    <h2 className="text-xl font-semibold mb-2 mt-6">
                      Crie seu plano de estudo por tópicos
                    </h2>
                    <p className="text-sm text-slate-300">
                      Organize seus estudos com tarefas e tópicos personalizados
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {topics?.map((topic) => (
                      <TopicWithTasks
                        key={topic.id}
                        topicId={topic.id}
                        name={topic.name}
                        description={topic.description}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            <TabsContent value="quiz" forceMount className={focusMode ? 'block' : ''}>
              <Quiz focusMode={focusMode} setFocusMode={setFocusMode} />
            </TabsContent>

            {!focusMode && (
              <>
                <TabsContent value="flashcards">
                  <div className="text-center text-slate-400 py-8">
                    Flash Cards em desenvolvimento
                  </div>
                </TabsContent>

                <TabsContent value="files">
                  <div className="text-center text-slate-400 py-8">Arquivos em desenvolvimento</div>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>

        {!focusMode && (
          <>
            <FloatingNewStudyTopicButton />
            <StudyTopicModal topicCount={topics?.length || 0} />
            <EventDialog taskType="STUDY" />
            <MobileBottomNav />
            <TaskEditDialog />
          </>
        )}
      </div>
    </div>
  );
}
