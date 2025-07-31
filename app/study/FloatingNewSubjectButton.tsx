import { useStudySubjectStore } from '@/stores/useSubjectStore';
import { FaFolderPlus } from 'react-icons/fa6';

export function FloatingNewSubjectButton() {
  const { setIsAddModalOpen } = useStudySubjectStore();

  return (
    <div className="fixed right-6 z-50 sm:hidden bottom-[72px] xs:bottom-[72px]">
      {' '}
      <button
        className="fixed bottom-24 right-6 z-50 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
        onClick={() => setIsAddModalOpen(true)}
      >
        <FaFolderPlus className="w-6 h-6" />
      </button>
    </div>
  );
}
