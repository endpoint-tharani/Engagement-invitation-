import { useCallback, useEffect, useRef, useState } from "react";
import { invitation } from "../data/invitation";
import { createMusicPlayer, type MusicPlayer } from "../lib/music";

export interface MusicControls {
  playing: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export function useMusic(): MusicControls {
  const playerRef = useRef<MusicPlayer | null>(null);
  const wantsPlay = useRef(false);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    wantsPlay.current = true;
    setPlaying(true);
    playerRef.current ??= createMusicPlayer(invitation.music.file, invitation.music.volume);
    playerRef.current.play().catch(() => {
      // Browser refused playback (autoplay policy) — leave the button off.
      wantsPlay.current = false;
      setPlaying(false);
    });
  }, []);

  const pause = useCallback(() => {
    wantsPlay.current = false;
    setPlaying(false);
    playerRef.current?.pause();
  }, []);

  const toggle = useCallback(() => (wantsPlay.current ? pause() : play()), [pause, play]);

  // Go quiet while the invitation is in a background tab.
  useEffect(() => {
    const onVisibility = () => {
      const player = playerRef.current;
      if (!player || !wantsPlay.current) return;
      if (document.hidden) player.pause(true);
      else player.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return { playing, play, pause, toggle };
}
