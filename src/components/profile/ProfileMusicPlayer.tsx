import React from 'react';
import { ISpotifyTrack } from '@/types/ISpotify';

interface ProfileMusicPlayerProps {
  spotifyTrack: ISpotifyTrack | null;
  musicLoading: boolean;
  currentTrack: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const ProfileMusicPlayer: React.FC<ProfileMusicPlayerProps> = ({
  spotifyTrack,
  musicLoading,
  currentTrack,
  isPlaying,
  onPlayPause
}) => {
  if (!spotifyTrack && !musicLoading) {
    return null;
  }

  const truncateText = (text: string, maxLength: number = 27): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 min-w-0 max-w-full">
      {musicLoading ? (
        <div className="flex items-center justify-center h-16">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 ml-2">Carregando musica...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          {/* Album Cover */}
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-black rounded-lg flex-shrink-0 overflow-hidden">
            <img 
              src={spotifyTrack?.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop"} 
              alt="Album Cover"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base leading-tight mb-1">
              {truncateText(spotifyTrack?.name || "Rock and Roll All Nite")}
            </h4>
            <p className="text-slate-400 text-sm mb-2 truncate">
              {spotifyTrack?.artists?.[0]?.name || "Kiss"}
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>0:00</span>
                <span>
                  {spotifyTrack?.duration_ms 
                    ? `${Math.floor(spotifyTrack.duration_ms / 60000)}:${Math.floor((spotifyTrack.duration_ms % 60000) / 1000).toString().padStart(2, '0')}`
                    : "4:32"
                  }
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-200 ${
                    currentTrack === spotifyTrack?.id && isPlaying
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }`} 
                  style={{width: '30%'}}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Play Button */}
          <button 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg flex-shrink-0 ${
              !spotifyTrack?.preview_url
                ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                : currentTrack === spotifyTrack?.id && isPlaying
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
            }`}
            onClick={spotifyTrack?.preview_url ? onPlayPause : undefined}
            disabled={!spotifyTrack?.preview_url}
            title={
              !spotifyTrack?.preview_url 
                ? 'Preview indisponivel para esta musica' 
                : currentTrack === spotifyTrack?.id && isPlaying
                  ? 'Pausar preview'
                  : 'Reproduzir preview (30s)'
            }
          >
            {!spotifyTrack?.preview_url ? (
              // Disabled/blocked icon
              <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 16V8l8 5-8 3z" opacity="0.5"/>
                <path d="M18.36 5.64L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : currentTrack === spotifyTrack?.id && isPlaying ? (
              // Pause icon
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              // Play icon
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMusicPlayer;