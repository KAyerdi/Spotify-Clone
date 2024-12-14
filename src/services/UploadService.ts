import { getPlayListInfoById } from './ApiService'

interface UploadResponse {
  success: boolean;
  message: string;
  fileUrl?: string;
  metadata?: {
    title: string;
    artist: string;
    duration: number;
    format: string;
  };
}

export const uploadMusic = async (file: File, playlistId?: number): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('music', file);
    if (playlistId) formData.append('playlistId', playlistId.toString());

    const response = await fetch('/api/upload-music', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Error al subir el archivo: ' + (error as Error).message
    };
  }
}

export const validateAudioFile = (file: File): boolean => {
  const validTypes = [
    'audio/mpeg',           // MP3
    'audio/mp4',            // M4A, MP4
    'audio/wav',            // WAV
    'audio/ogg',            // OGG
    'audio/x-m4a',          // M4A
    'audio/aac',            // AAC
    'audio/flac'            // FLAC
  ];

  return validTypes.includes(file.type);
}

export const getFileMetadata = async (file: File) => {
  // Esta función simula la obtención de metadatos
  // En un entorno real, usarías music-metadata en el backend
  return {
    title: file.name.replace(/\.[^/.]+$/, ""),
    artist: "Artista Desconocido",
    duration: 0,
    format: file.type
  };
}