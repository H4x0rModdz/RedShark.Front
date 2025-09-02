import { IISpotifyTrack, IISpotifyArtist, IISpotifyPlaylist } from '@/types/ISpotify';

class SpotifyService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Client-side authentication will be handled through backend API
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Ensure we're running in the browser
    if (typeof window === 'undefined') {
      throw new Error('SpotifyService can only run in browser environment');
    }

    try {
      console.log('Fetching Spotify token from /api/spotify/token...');
      // Get token through our backend API to keep credentials secure
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const tokenUrl = `${baseUrl}/api/spotify/token`;
      console.log('Full token URL:', tokenUrl);
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Spotify token response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Spotify token error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  }

  private async makeSpotifyRequest(endpoint: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Spotify API error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Spotify API request failed:', error);
      throw error;
    }
  }

  async getTrack(trackId: string): Promise<ISpotifyTrack | null> {
    try {
      return await this.makeSpotifyRequest(`/tracks/${trackId}`);
    } catch (error) {
      console.error('Error getting track:', error);
      return null;
    }
  }

  async searchTracks(query: string, limit: number = 10): Promise<ISpotifyTrack[]> {
    try {
      const data = await this.makeSpotifyRequest(
        `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`
      );
      return data.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  async searchArtists(query: string, limit: number = 10): Promise<ISpotifyArtist[]> {
    try {
      const data = await this.makeSpotifyRequest(
        `/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`
      );
      return data.artists.items;
    } catch (error) {
      console.error('Error searching artists:', error);
      return [];
    }
  }

  async getArtist(artistId: string): Promise<ISpotifyArtist | null> {
    try {
      return await this.makeSpotifyRequest(`/artists/${artistId}`);
    } catch (error) {
      console.error('Error getting artist:', error);
      return null;
    }
  }

  async getArtistTopTracks(artistId: string, market: string = 'US'): Promise<ISpotifyTrack[]> {
    try {
      const data = await this.makeSpotifyRequest(`/artists/${artistId}/top-tracks?market=${market}`);
      return data.tracks;
    } catch (error) {
      console.error('Error getting artist top tracks:', error);
      return [];
    }
  }

  async getTrack(trackId: string): Promise<ISpotifyTrack | null> {
    try {
      return await this.makeSpotifyRequest(`/tracks/${trackId}`);
    } catch (error) {
      console.error('Error getting track:', error);
      return null;
    }
  }

  async getPlaylist(playlistId: string): Promise<ISpotifyPlaylist | null> {
    try {
      return await this.makeSpotifyRequest(`/playlists/${playlistId}`);
    } catch (error) {
      console.error('Error getting playlist:', error);
      return null;
    }
  }

  async getFeaturedPlaylists(limit: number = 20): Promise<ISpotifyPlaylist[]> {
    try {
      const data = await this.makeSpotifyRequest(`/browse/featured-playlists?limit=${limit}`);
      return data.playlists.items;
    } catch (error) {
      console.error('Error getting featured playlists:', error);
      return [];
    }
  }

  async getNewReleases(limit: number = 20): Promise<any[]> {
    try {
      const data = await this.makeSpotifyRequest(`/browse/new-releases?limit=${limit}`);
      return data.albums.items;
    } catch (error) {
      console.error('Error getting new releases:', error);
      return [];
    }
  }

  // Helper method to extract Spotify ID from URL
  extractSpotifyId(url: string, type: 'track' | 'artist' | 'playlist' | 'album'): string | null {
    const regex = new RegExp(`https://open\\.spotify\\.com/${type}/([a-zA-Z0-9]+)`);
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}

export default new SpotifyService();
export type { ISpotifyTrack, ISpotifyArtist, ISpotifyPlaylist };