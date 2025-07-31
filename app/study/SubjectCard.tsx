'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useStudySubjectStore } from '@/stores/useSubjectStore';
import { StudySubject } from '@/hooks/data/useStudySubjectQuery';
import { StudySubjectCardMenu } from './StudySubjectMenu';

type StudySubjectCardProps = {
  subject: StudySubject;
  onDelete: (id: string) => void;
};

export function StudySubjectCard({ subject, onDelete }: StudySubjectCardProps) {
  const router = useRouter();
  const setSelectedSubjectName = useStudySubjectStore((state) => state.setSelectedSubjectName);

  const handleClick = () => {
    setSelectedSubjectName(subject.name);
    router.push(`/study/${subject.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border text-sm sm:text-base p-3 sm:p-5 cursor-pointer flex flex-col justify-between h-full my-4 gap-0"
    >
      <CardHeader className="p-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base sm:text-lg font-semibold truncate">
            {subject.name}
          </CardTitle>

          <StudySubjectCardMenu subject={subject} onDelete={onDelete} />
        </div>
      </CardHeader>

      {subject.description && (
        <CardContent className="p-0 flex-1">
          <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {subject.description}
          </CardDescription>
        </CardContent>
      )}

      <Separator className="-mt-6 mb-1 bg-primary/20" />

      <CardContent className="p-0 flex justify-between items-end">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-foreground">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          Criado em{' '}
          {new Date(subject.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      </CardContent>
    </Card>
  );
}
