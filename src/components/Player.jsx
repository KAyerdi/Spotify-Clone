import { PlayerControlButtonBar } from "@/components/PlayerControlButtonBar";
import { PlayerCurrentSong } from "@/components/PlayerCurrentSong";
import { PlayerSoundControl } from "@/components/PlayerSoundControl";
import { PlayerVolumeControl } from "@/components/PlayerVolumeControl";
import { useCurrentMusic } from "@/hooks/UseCurrentMusic";
import { usePlayerStore } from "@/store/playerStore";
import { useEffect, useRef, useState } from "react";

export function Player() {
  const {currentMusic, isPlaying, volume, setCurrentMusic} = usePlayerStore(state => state);
  const audioRef = useRef();
  const {getNextSong} = useCurrentMusic(currentMusic);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const { song, playlist } = currentMusic;
    if (song) {
      audioRef.current.src = `/music/${playlist?.id}/0${song.id}.mp3`;
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.error('Error playing:', e));
        }
      }
    }
  }, [currentMusic.song?.id, isMounted]);

  useEffect(() => {
    if (!isMounted || !audioRef.current.src) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.error('Error playing:', e));
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isMounted]);

  useEffect(() => {
    if (isMounted) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMounted]);

  function onNextSong() {
    const nextSong = getNextSong();
    if (nextSong) {
      setCurrentMusic({...currentMusic, song: nextSong});
    }
  }

  if (!isMounted) return null;

  return (
    <div className="flex flex-row justify-between w-full px-1 z-50">
      <div className="w-[200px]">
        {currentMusic.song && <PlayerCurrentSong {...currentMusic.song} />}
      </div>

      <div className="grid place-content-center gap-4 flex-1">
        <div className="flex justify-center flex-col items-center">
          <PlayerControlButtonBar/>
          <PlayerSoundControl audio={audioRef}/>
          <audio ref={audioRef} onEnded={onNextSong} />
        </div>
      </div>

      <div className="grid place-content-center">
        <PlayerVolumeControl/>
      </div>
    </div>
  );
}