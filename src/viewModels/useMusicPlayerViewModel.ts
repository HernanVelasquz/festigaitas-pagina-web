import { useEffect, useRef, useState, useCallback } from 'react';

export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

export interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementOrId: string | HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: YTPlayerEvent) => void;
            onStateChange?: (event: YTPlayerEvent) => void;
            onError?: () => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface Song {
  id: string;
  title: string;
  artist: string;
}

const SONG_1_ID = (import.meta.env.VITE_YOUTUBE_SONG_1 as string) || '220EraJYJtM';
const SONG_2_ID = (import.meta.env.VITE_YOUTUBE_SONG_2 as string) || 'D7POKdeQuvM';

export const PLAYLIST: Song[] = [
  { id: SONG_1_ID, title: 'Llirene en la Gloria', artist: 'Los Gaiteros de Ovejas' },
  { id: SONG_2_ID, title: 'Olor a Tierra Mojá', artist: 'Los Gaiteros de Ovejas' },
];

export type PlayerState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused';

export function useMusicPlayerViewModel() {
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PlayerState>('idle');
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSong = PLAYLIST[currentIndex];
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const playSong = useCallback((index: number) => {
    setCurrentIndex(index);
    if (playerRef.current) {
      setState('loading');
      playerRef.current.loadVideoById(PLAYLIST[index].id);
    }
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndexRef.current + 1) % PLAYLIST.length;
    playSong(nextIndex);
  }, [playSong]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndexRef.current - 1 + PLAYLIST.length) % PLAYLIST.length;
    playSong(prevIndex);
  }, [playSong]);

  const initPlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player || !containerRef.current) return;
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: PLAYLIST[currentIndexRef.current].id,
      playerVars: {
        autoplay: 1,
        loop: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (e: YTPlayerEvent) => {
          e.target.setVolume(60);
          e.target.playVideo();
          setState('playing');
        },
        onStateChange: (e: YTPlayerEvent) => {
          if (e.data === 1) {
            setState('playing');
          } else if (e.data === 2) {
            setState('paused');
          } else if (e.data === 3) {
            setState('loading');
          } else if (e.data === 0) {
            handleNext();
          }
        },
        onError: () => setState('idle'),
      },
    });
  }, [handleNext]);

  const loadAPI = useCallback(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      initPlayer();
    };
    if (!document.getElementById('yt-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, [initPlayer]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    setState('loading');
    setExpanded(true);
    loadAPI();
    return () => clearTimeout(t);
  }, [loadAPI]);

  const handleMainButton = () => {
    if (!firstClick) {
      setFirstClick(true);
      setState('loading');
      setExpanded(true);
      loadAPI();
      return;
    }
    if (state === 'playing') {
      playerRef.current?.pauseVideo();
    } else if (state === 'paused') {
      playerRef.current?.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(60);
    } else {
      playerRef.current.mute();
    }
    setMuted((m) => !m);
  };

  const isPlaying = state === 'playing';
  const isLoading = state === 'loading';

  return {
    state,
    muted,
    visible,
    expanded,
    firstClick,
    currentSong,
    isPlaying,
    isLoading,
    containerRef,
    handleMainButton,
    toggleMute,
    handleNext,
    handlePrev,
  };
}
