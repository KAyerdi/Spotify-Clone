import { useState } from 'react';
import { uploadMusic, validateAudioFile } from '@/services/UploadService';

export function MusicUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = [...e.dataTransfer.files];
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? [...e.target.files] : [];
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (!validateAudioFile(file)) {
        setUploadStatus('Formato de archivo no válido. Por favor, sube archivos de audio (MP3, MP4, WAV, etc.)');
        continue;
      }

      setIsUploading(true);
      setUploadStatus('Subiendo archivo...');

      try {
        const response = await uploadMusic(file);
        if (response.success) {
          setUploadStatus('¡Archivo subido exitosamente!');
        } else {
          setUploadStatus('Error al subir el archivo: ' + response.message);
        }
      } catch (error) {
        setUploadStatus('Error al subir el archivo');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-green-500 bg-green-50/10' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer text-green-500 hover:text-green-400"
        >
          <div className="flex flex-col items-center">
            <svg 
              className="w-12 h-12 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            <span className="text-lg mb-2">
              Arrastra y suelta archivos de música aquí
            </span>
            <span className="text-sm text-gray-400">
              o haz clic para seleccionar archivos
            </span>
          </div>
        </label>
      </div>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded ${
          uploadStatus.includes('Error') 
            ? 'bg-red-500/10 text-red-500' 
            : 'bg-green-500/10 text-green-500'
        }`}>
          {uploadStatus}
        </div>
      )}

      {isUploading && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-500 h-2.5 rounded-full w-1/2 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}