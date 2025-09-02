"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SpotifyService, { ISpotifyTrack, ISpotifyArtist } from '@/services/SpotifyService';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading';

interface SpotifyMusicProps {
  userId?: string;
  userName?: string;
  isOwnProfile?: boolean;
}

const SpotifyMusic: React.FC<SpotifyMusicProps> = ({ 
  userId, 
  userName, 
  isOwnProfile = false 
}) => {
  const [tracks, setTracks] = useState<ISpotifyTrack[]>([]);
  const [artists, setArtists] = useState<ISpotifyArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tracks' | 'artists'>('tracks');

  const searchSpotify = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'tracks') {
        const searchResults = await SpotifyService.searchTracks(searchQuery, 12);
        setTracks(searchResults);
      } else {
        const searchResults = await SpotifyService.searchArtists(searchQuery, 12);
        setArtists(searchResults);
      }
    } catch (error) {
      setError('Erro ao buscar música no Spotify');
      console.error('Spotify search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeaturedContent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load some popular content by default
      const [topTracks, topArtists] = await Promise.all([
        SpotifyService.searchTracks('top hits 2024', 6),
        SpotifyService.searchArtists('popular artists', 6)
      ]);
      
      setTracks(topTracks);
      setArtists(topArtists);
    } catch (error) {
      setError('Erro ao carregar conteúdo do Spotify');
      console.error('Error loading Spotify content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchSpotify();
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700/60 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify Music
          </h3>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pesquisar músicas ou artistas..."
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <Button 
              onClick={searchSpotify}
              disabled={!searchQuery.trim() || isLoading}
              className="bg-green-600 hover:bg-green-700 px-6"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Buscar'}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tracks'
                  ? 'bg-green-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Músicas
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'artists'
                  ? 'bg-green-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Artistas
            </button>
          </div>
        </div>

        <LoadingOverlay isLoading={isLoading}>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={loadFeaturedContent}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'tracks' ? (
                tracks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tracks.map((track) => (
                      <div 
                        key={track.id} 
                        className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
                      >
                        <img
                          src={track.album.images[0]?.url || '/placeholder-music.png'}
                          alt={track.album.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">
                            {track.name}
                          </h4>
                          <p className="text-slate-400 text-xs truncate">
                            {track.artists.map((artist: any) => artist.name).join(', ')}
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            {track.album.name}
                          </p>
                        </div>
                        <a
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-green-500 hover:text-green-400"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Nenhuma música encontrada</p>
                  </div>
                )
              ) : (
                artists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {artists.map((artist) => (
                      <div 
                        key={artist.id} 
                        className="text-center p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
                      >
                        <img
                          src={artist.images[0]?.url || '/placeholder-artist.png'}
                          alt={artist.name}
                          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                        />
                        <h4 className="text-white font-medium mb-1 truncate">
                          {artist.name}
                        </h4>
                        <p className="text-slate-400 text-sm mb-2">
                          {formatFollowers(artist.followers.total)} seguidores
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center mb-3">
                          {artist.genres.slice(0, 2).map((genre: string) => (
                            <span 
                              key={genre}
                              className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                        <a
                          href={artist.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-500 hover:text-green-400 text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                          Ver no Spotify
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Nenhum artista encontrado</p>
                  </div>
                )
              )}
            </div>
          )}
        </LoadingOverlay>
      </CardContent>
    </Card>
  );
};

export default SpotifyMusic;