import { useEffect, useRef, useState, useCallback } from 'react';
import { Pause, Volume2, VolumeX, Music } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VIDEO_ID = '220EraJYJtM';

type PlayerState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused';

export default function MusicPlayer() {
  const playerRef   = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState]   = useState<PlayerState>('idle');
  const [muted, setMuted]   = useState(false);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [firstClick, setFirstClick] = useState(false);

  // Show the widget after a short delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const initPlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player || !containerRef.current) return;
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: VIDEO_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (e: any) => {
          e.target.setVolume(60);
          e.target.playVideo();
          setState('playing');
        },
        onStateChange: (e: any) => {
          if (e.data === 1) setState('playing');
          if (e.data === 2) setState('paused');
          if (e.data === 3) setState('loading');
        },
        onError: () => setState('idle'),
      },
    });
  }, []);

  const loadAPI = useCallback(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    // API already loading — just set the callback
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      initPlayer();
    };
    if (!document.getElementById('yt-api-script')) {
      const tag = document.createElement('script');
      tag.id  = 'yt-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, [initPlayer]);

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
    setMuted(m => !m);
  };

  const isPlaying = state === 'playing';
  const isLoading = state === 'loading';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Expanded label */}
      {expanded && (
        <div className={`flex items-center gap-2 px-3 py-1.5 bg-ink-800/90 backdrop-blur border border-white/8 transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Animated bars */}
          <div className="flex items-end gap-[3px] h-3">
            {[
              { cls: 'animate-bar1', key: '1' },
              { cls: 'animate-bar2', key: '2' },
              { cls: 'animate-bar3', key: '3' },
            ].map(({ cls, key }) => (
              <span
                key={key}
                className={`w-[3px] rounded-sm bg-brand-400 transition-all ${isPlaying ? cls : ''}`}
                style={{ height: isPlaying ? undefined : '3px' }}
              />
            ))}
          </div>
          <span className="text-[11px] font-display font-semibold tracking-wider uppercase text-ink-300 max-w-[140px] truncate">
            Llirene en la Gloria
          </span>
        </div>
      )}

      {/* Controls row */}
      <div className="flex items-center gap-2">
        {/* Mute toggle — only when player is active */}
        {firstClick && state !== 'idle' && (
          <button
            onClick={toggleMute}
            className="w-9 h-9 bg-ink-800/90 backdrop-blur border border-white/8 flex items-center justify-center text-ink-400 hover:text-white hover:border-brand-500/40 transition-all duration-200"
            title={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted
              ? <VolumeX className="w-4 h-4" />
              : <Volume2 className="w-4 h-4" />
            }
          </button>
        )}

        {/* Main play/pause button */}
        <button
          onClick={handleMainButton}
          title={!firstClick ? 'Reproducir música del festival' : isPlaying ? 'Pausar' : 'Reproducir'}
          className={`relative flex items-center gap-2.5 pl-3 pr-4 h-10 font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 overflow-hidden ${
            isPlaying
              ? 'bg-brand-500 border border-brand-400 text-ink-900 hover:bg-brand-400'
              : 'bg-ink-800/90 backdrop-blur border border-white/10 text-ink-300 hover:text-white hover:border-brand-500/40'
          }`}
        >
          {/* Ripple when playing */}
          {isPlaying && (
            <span className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_2s_linear_infinite]" />
          )}

          {isLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Music className="w-3.5 h-3.5 shrink-0" />
          )}

          <span className="relative">
            {isLoading ? 'Cargando…' : isPlaying ? 'Sonando' : !firstClick ? 'Escuchar' : 'Pausado'}
          </span>
        </button>
      </div>

      {/* Hidden YouTube player mount point */}
      <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
        <div ref={containerRef} />
      </div>
    </div>
  );
}
