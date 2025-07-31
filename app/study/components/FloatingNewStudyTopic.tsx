'use client';

import { useParams } from 'next/navigation';
import { BiSolidBookAdd } from 'react-icons/bi';
import { useStudyTopicStore } from '@/stores/useTopicStore';

export function FloatingNewStudyTopicButton() {
  const params = useParams();
  const subjectId = params.id as string;

  const { setIsTopicModalOpen, resetNewStudyTopicForm, setEditingTopicId, setParentSubjectId } =
    useStudyTopicStore();

  const handleClick = () => {
    setEditingTopicId(null);
    resetNewStudyTopicForm();
    setParentSubjectId(subjectId);
    setIsTopicModalOpen(true);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-6 z-50 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
    >
      <BiSolidBookAdd className="w-7 h-7" />
      <span className="sr-only">Criar tópico</span>
    </button>
  );
}
