'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FloatingNewSubjectButton } from './FloatingNewSubjectButton';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useDeleteStudySubject, useStudySubjects } from '@/hooks/data/useStudySubjectQuery';
import { useStudySubjectStore } from '@/stores/useSubjectStore';
import { StudySubjectCard } from './SubjectCard';
import { StudySubjectFormDialog } from '../projetos/components/StudySubjectFormDialog';

export default function StudySubjectsPage() {
  const { data: subjects, isLoading } = useStudySubjects();
  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const deleteSubject = useDeleteStudySubject();
  const { setIsAddModalOpen } = useStudySubjectStore();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = safeSubjects.filter((subject) => {
    return (
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteSubject = (id: string) => {
    deleteSubject.mutate(id);
  };

  return (
    <div className="min-h-screen flex flex-col gap-2 mb-20">
      <div className="sm:hidden">
        <h1 className="text-2xl font-semibold py-4 px-2">Meus Estudos</h1>

        {isLoading ? (
          <p className="text-center text-muted-foreground mt-6">Carregando assuntos...</p>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'Nenhum assunto encontrado com a busca aplicada.'
                : 'Nenhum assunto encontrado. Crie seu primeiro!'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Assunto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredSubjects.map((subject) => (
              <StudySubjectCard key={subject.id} subject={subject} onDelete={handleDeleteSubject} />
            ))}
          </div>
        )}
      </div>

      <div className="hidden sm:flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Estudos</h1>
            <p className="text-muted-foreground">Organize seus assuntos de estudo por tópicos</p>
          </div>
          <StudySubjectFormDialog />
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar assuntos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground mt-6">Carregando assuntos...</p>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'Nenhum assunto encontrado com a busca aplicada.'
                : 'Nenhum assunto encontrado. Crie seu primeiro!'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Assunto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredSubjects.map((subject) => (
              <StudySubjectCard key={subject.id} subject={subject} onDelete={handleDeleteSubject} />
            ))}
          </div>
        )}
      </div>

      <FloatingNewSubjectButton />
      <MobileBottomNav />
    </div>
  );
}
