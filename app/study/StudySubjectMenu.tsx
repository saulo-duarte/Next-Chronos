'use client';

import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StudySubject } from '@/hooks/data/useStudySubjectQuery';
import { useStudySubjectStore } from '@/stores/useSubjectStore';

type Props = {
  subject: StudySubject;
  onDelete: (id: string) => void;
};

export function StudySubjectCardMenu({ subject, onDelete }: Props) {
  const setEditingStudySubjectId = useStudySubjectStore((s) => s.setEditingStudySubjectId);
  const setIsAddModalOpen = useStudySubjectStore((s) => s.setIsAddModalOpen);
  const setNewStudySubjectForm = useStudySubjectStore((s) => s.setNewStudySubjectForm);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudySubjectId(subject.id);
    setNewStudySubjectForm({
      name: subject.name,
      description: subject.description,
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(subject.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash className="w-4 h-4 mr-2" />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
