import { BaseChunk } from './BaseChunk';
import { ChunkLocation, ChunkSearchParams, ChunkResult } from './types';

interface GooglePlacesResult {
  name: string;
  geometry: { location: { lat: number; lng: number; }; };
  place_id: string;
  types: string[];
  rating?: number;
  vicinity?: string;
}

interface GooglePlacesResponse {
  results: GooglePlacesResult[];
  status: string;
  error_message?: string;
}

export class GooglePsychicChunk extends BaseChunk {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  constructor(apiKey: string) {
    super(
      'Psychic Reading Explorer',
      'google_psychic',
      4, // High weight - unique mystical experience
      {
        weather: 'any',
        timeOfDay: 'any',
        season: 'any',
        modes: ['wildcard'] // Only available in wildcard mode
      }
    );
    this.apiKey = apiKey;
  }

  protected isServiceAvailable(): boolean {
    return !!this.apiKey;
  }

  public async searchLocations(params: ChunkSearchParams): Promise<ChunkResult> {
    if (!this.apiKey) {
      return { success: false, locations: [], error: 'Google Places API key not configured' };
    }

    try {
      const radiusMeters = Math.min((params.radiusMiles || 25) * 1609.34, 50000);

      const url = new URL(this.baseUrl);
      url.searchParams.set('location', `${params.latitude},${params.longitude}`);
      url.searchParams.set('radius', radiusMeters.toString());
      url.searchParams.set('keyword', 'psychic reading');
      url.searchParams.set('key', this.apiKey);

      const response = await fetch(url.toString());
      const data: GooglePlacesResponse = await response.json();
      
      console.log(`Google Places returned ${data.results?.length || 0} psychic reading locations`);

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      if (!data.results || data.results.length === 0) {
        return { success: true, locations: [], apiCalls: 1 };
      }

      const limit = Math.min(params.limit || 10, data.results.length);
      const locations: ChunkLocation[] = data.results.slice(0, limit).map((result, index) => ({
        id: `google-psychic-${result.place_id || index}`,
        title: result.name || 'Psychic Reader',
        description: 'A mystical location offering psychic readings, fortune telling, and spiritual guidance for curious adventurers.',
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        location: result.vicinity || `Psychic Reading (${result.geometry.location.lat.toFixed(4)}, ${result.geometry.location.lng.toFixed(4)})`,
        type: 'google_psychic',
        rating: result.rating,
        url: `https://www.google.com/maps/place/?q=place_id:${result.place_id}`
      }));

      return { success: true, locations, apiCalls: 1 };

    } catch (error) {
      return { success: false, locations: [], error: error instanceof Error ? error.message : 'Unknown error', apiCalls: 1 };
    }
  }
}