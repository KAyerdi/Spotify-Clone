import { useUploadStore } from '@/store/UploadStore'
import { MusicUploader } from './MusicUploader'

export function UploadModal() {
  const { isUploadModalOpen, closeUploadModal } = useUploadStore()

  if (!isUploadModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Subir Música</h2>
          <button 
            onClick={closeUploadModal}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <MusicUploader />
      </div>
    </div>
  )
}