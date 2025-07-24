import { BaseChunk } from './BaseChunk';
import { ChunkLocation, ChunkSearchParams, ChunkResult } from './types';

interface GooglePlacesResult {
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  types: string[];
  rating?: number;
  vicinity?: string;
  opening_hours?: {
    open_now: boolean;
  };
}

interface GooglePlacesResponse {
  results: GooglePlacesResult[];
  status: string;
  error_message?: string;
}

export class GoogleHikingAreaChunk extends BaseChunk {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  constructor(apiKey: string) {
    super(
      'Google Hiking Area Explorer',
      'google_hiking_area',
      1, // Equal weight with other chunks
      {
        weather: 'any',
        timeOfDay: 'any',
        season: 'any',
        modes: ['adventure'] // Adventure mode only
      }
    );
    this.apiKey = apiKey;
  }

  protected isServiceAvailable(): boolean {
    return !!this.apiKey;
  }

  public async searchLocations(params: ChunkSearchParams): Promise<ChunkResult> {
    if (!this.apiKey) {
      return {
        success: false,
        locations: [],
        error: 'Google Places API key not configured'
      };
    }

    try {
      const radiusMeters = Math.min((params.radiusMiles || 25) * 1609.34, 50000);

      const url = new URL(this.baseUrl);
      url.searchParams.set('location', `${params.latitude},${params.longitude}`);
      url.searchParams.set('radius', radiusMeters.toString());
      url.searchParams.set('keyword', 'hiking trail');
      url.searchParams.set('key', this.apiKey);

      console.log(`Searching for hiking areas near ${params.latitude}, ${params.longitude}`);

      const response = await fetch(url.toString());
      const data: GooglePlacesResponse = await response.json();
      
      console.log(`Google Places returned ${data.results?.length || 0} hiking area locations`);

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`);
      }

      if (!data.results || data.results.length === 0) {
        return { success: true, locations: [], apiCalls: 1 };
      }

      const limit = Math.min(params.limit || 10, data.results.length);
      const locations: ChunkLocation[] = data.results.slice(0, limit).map((result, index) => ({
        id: `google-hiking-${result.place_id || index}`,
        title: result.name || 'Hiking Area',
        description: this.generateHikingDescription(result),
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        location: result.vicinity || `Hiking Area (${result.geometry.location.lat.toFixed(4)}, ${result.geometry.location.lng.toFixed(4)})`,
        type: 'google_hiking_area',
        rating: result.rating,
        url: `https://www.google.com/maps/place/?q=place_id:${result.place_id}`
      }));

      return { success: true, locations, apiCalls: 1 };

    } catch (error) {
      console.error('Error searching for hiking areas:', error);
      return {
        success: false,
        locations: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        apiCalls: 1
      };
    }
  }

  private generateHikingDescription(result: GooglePlacesResult): string {
    const descriptions = [];
    descriptions.push('A scenic hiking area with trails perfect for outdoor adventures and nature exploration.');
    
    if (result.rating) {
      descriptions.push(`Rated ${result.rating}/5 by visitors.`);
    }

    return descriptions.join(' ');
  }
}