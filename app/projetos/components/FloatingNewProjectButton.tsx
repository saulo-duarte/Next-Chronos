import { useProjectStore } from '@/stores/useProjectStore';
import { FaFolderPlus } from 'react-icons/fa6';

export function FloatingNewProjectButton() {
  const { setIsAddModalOpen } = useProjectStore();

  return (
    <div className="fixed right-6 z-50 sm:hidden bottom-[72px] xs:bottom-[72px]">
      {' '}
      <button
        className="flex items-center gap-2 rounded-full p-3 bg-blue-900/50 hover:bg-blue-600"
        onClick={() => setIsAddModalOpen(true)}
      >
        <FaFolderPlus className="w-8 h-8" />
      </button>
    </div>
  );
}
