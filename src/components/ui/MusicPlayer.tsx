import { Pause, Play, Volume2, VolumeX, Music, SkipBack, SkipForward } from 'lucide-react';
import { useMusicPlayerViewModel } from '../../viewModels/useMusicPlayerViewModel';

export default function MusicPlayer() {
  const {
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
  } = useMusicPlayerViewModel();

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Expanded label */}
      {expanded && (
        <div className="flex flex-col gap-1 px-4 py-2 bg-ink-800/90 backdrop-blur border border-white/8 transition-all duration-300">
          <div className="flex items-center gap-2">
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
              {currentSong.title}
            </span>
          </div>
          <span className="text-[9px] font-body text-ink-500 max-w-[140px] truncate pl-5">
            {currentSong.artist}
          </span>
        </div>
      )}

      {/* Controls row */}
      <div className="flex items-center gap-2">
        {/* Playlist navigation */}
        {firstClick && state !== 'idle' && (
          <div className="flex items-center gap-1 bg-ink-800/90 backdrop-blur border border-white/8 p-0.5">
            <button
              onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center text-ink-400 hover:text-white transition-all duration-200"
              title="Canción anterior"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center text-ink-400 hover:text-white transition-all duration-200"
              title="Siguiente canción"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mute toggle */}
        {firstClick && state !== 'idle' && (
          <button
            onClick={toggleMute}
            className="w-10 h-10 bg-ink-800/90 backdrop-blur border border-white/8 flex items-center justify-center text-ink-400 hover:text-white hover:border-brand-500/40 transition-all duration-200"
            title={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
          ) : !firstClick ? (
            <Music className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Play className="w-3.5 h-3.5 shrink-0" />
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
