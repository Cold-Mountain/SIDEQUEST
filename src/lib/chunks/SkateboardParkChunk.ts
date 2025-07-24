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
  photos?: Array<{
    photo_reference: string;
  }>;
}

interface GooglePlacesResponse {
  results: GooglePlacesResult[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

export class SkateboardParkChunk extends BaseChunk {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  constructor(apiKey: string) {
    super(
      'Skateboard Park Explorer',
      'skateboard_park',
      2, // Medium weight - fun but common recreational activity
      {
        weather: 'any', // Skateboarding works in various weather
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

  /**
   * Search for skateboard parks using Google Places API
   */
  public async searchLocations(params: ChunkSearchParams): Promise<ChunkResult> {
    if (!this.apiKey) {
      return {
        success: false,
        locations: [],
        error: 'Google Places API key not configured'
      };
    }

    try {
      // Convert miles to meters for radius (Google Places max is 50,000m)
      const radiusMeters = Math.min((params.radiusMiles || 25) * 1609.34, 50000);

      const url = new URL(this.baseUrl);
      url.searchParams.set('location', `${params.latitude},${params.longitude}`);
      url.searchParams.set('radius', radiusMeters.toString());
      url.searchParams.set('keyword', 'skateboard park');
      url.searchParams.set('key', this.apiKey);

      console.log(`Searching for skateboard parks near ${params.latitude}, ${params.longitude}`);
      console.log('Google Places Skateboard Park URL:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'SIDEQUEST/1.0'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Places API error details:', errorText);
        throw new Error(`Google Places API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: GooglePlacesResponse = await response.json();
      
      console.log(`Google Places returned status: ${data.status}`);
      console.log(`Google Places returned ${data.results?.length || 0} skateboard park locations`);

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`);
      }

      if (!data.results || data.results.length === 0) {
        return {
          success: true,
          locations: [],
          apiCalls: 1
        };
      }

      // Transform Google Places results to ChunkLocation format
      const limit = Math.min(params.limit || 10, data.results.length);
      const locations: ChunkLocation[] = data.results.slice(0, limit).map((result, index) => {
        
        // Generate description based on available data
        const description = this.generateSkateDescription(result);
        
        // Format location string
        const locationStr = result.vicinity || `Skateboard Park (${result.geometry.location.lat.toFixed(4)}, ${result.geometry.location.lng.toFixed(4)})`;

        return {
          id: `google-skate-${result.place_id || index}`,
          title: result.name || 'Skateboard Park',
          description,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          location: locationStr,
          type: 'skateboard_park',
          rating: result.rating,
          // Google Places doesn't provide direct URLs, but we could construct Google Maps URLs
          url: `https://www.google.com/maps/place/?q=place_id:${result.place_id}`
        };
      });

      console.log(`Found ${locations.length} skateboard park locations`);
      
      return {
        success: true,
        locations,
        apiCalls: 1
      };

    } catch (error) {
      console.error('Error searching for skateboard parks:', error);
      return {
        success: false,
        locations: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        apiCalls: 1
      };
    }
  }

  /**
   * Generate description for skateboard park location
   */
  private generateSkateDescription(result: GooglePlacesResult): string {
    const descriptions = [];
    
    // Base description
    descriptions.push('A skate park with ramps, rails, and obstacles perfect for skateboarding, BMX, and roller sports.');

    // Add type info if available
    if (result.types && result.types.length > 0) {
      const relevantTypes = result.types.filter(type => 
        !['establishment', 'point_of_interest'].includes(type)
      );
      if (relevantTypes.length > 0) {
        descriptions.push(`Facility type: ${relevantTypes.join(', ').replace(/_/g, ' ')}.`);
      }
    }

    // Add rating info
    if (result.rating) {
      descriptions.push(`Rated ${result.rating}/5 by visitors.`);
    }

    // Add open status if available
    if (result.opening_hours?.open_now !== undefined) {
      descriptions.push(`Currently ${result.opening_hours.open_now ? 'open' : 'closed'}.`);
    }

    return descriptions.join(' ');
  }
}