import { Pause, Play } from "@/icons/PlayerIcons";
import { getPlayListInfoById } from "@/services/ApiService";
import { usePlayerStore } from '@/store/playerStore';



type CardPlayButtonProps = {
  id: number; // Cambia esto al tipo correcto si no es un string
  size?: 'small' | 'large'; // Puedes ajustar los valores aceptados según tu diseño
};

export function CardPlayButton({ id, size = 'small' }: CardPlayButtonProps) {
  const {
    currentMusic,
    isPlaying,
    setIsPlaying,
    setCurrentMusic,
  } = usePlayerStore((state) => state);

  const isPlayingPlaylist = isPlaying && currentMusic?.playlist?.id === id;
  const isThisPlaylistInStore = currentMusic?.playlist?.id === id;

  const handleClick = () => {
    if (isThisPlaylistInStore) {
      setIsPlaying(!isPlaying);
      return;
    }

    getPlayListInfoById(id).then((data) => {
      const { songs, playlist } = data;
      setCurrentMusic({ songs: songs, playlist: playlist, song: songs[0] });
    }).then(() => {
      setIsPlaying(true);
    });
  };

  const iconClassName = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      onClick={handleClick}
      className="card-play-button rounded-full text-black bg-green-500 p-4 hover:scale-105 transition hover:bg-green-400"
    >
      {isPlayingPlaylist ? <Pause className={iconClassName} /> : <Play className={iconClassName} />}
    </button>
  );
}
