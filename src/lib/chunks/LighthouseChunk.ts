import { BaseChunk } from './BaseChunk';
import { ChunkLocation, ChunkSearchParams, ChunkResult } from './types';

interface GeoApifyPlace {
  properties: {
    place_id: string;
    name?: string;
    formatted?: string;
    address_line1?: string;
    city?: string;
    state?: string;
    categories: string[];
    lon: number;
    lat: number;
    details?: string[];
    website?: string;
    phone?: string;
    opening_hours?: string;
    rating?: number;
  };
}

interface GeoApifyResponse {
  features: GeoApifyPlace[];
  type: string;
}

export class LighthouseChunk extends BaseChunk {
  private apiKey: string;
  private baseUrl = 'https://api.geoapify.com/v2/places';

  constructor(apiKey: string) {
    super(
      'Lighthouse Explorer',
      'lighthouse',
      3, // Medium-high weight - scenic coastal landmarks with history
      {
        weather: 'any', // Lighthouses work in all weather
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

  /**
   * Search for lighthouses using GeoApify Places API
   */
  public async searchLocations(params: ChunkSearchParams): Promise<ChunkResult> {
    if (!this.apiKey) {
      return {
        success: false,
        locations: [],
        error: 'GeoApify API key not configured'
      };
    }

    try {
      // Convert miles to meters for radius
      const radiusMeters = (params.radiusMiles || 25) * 1609.34;
      const limit = Math.min(params.limit || 10, 20); // Limit API calls

      // Categories for lighthouse related places
      const categories = 'man_made.lighthouse';

      const url = new URL(this.baseUrl);
      url.searchParams.set('categories', categories);
      url.searchParams.set('filter', `circle:${params.longitude},${params.latitude},${radiusMeters}`);
      url.searchParams.set('bias', `proximity:${params.longitude},${params.latitude}`);
      url.searchParams.set('limit', limit.toString());
      url.searchParams.set('apiKey', this.apiKey);

      console.log(`Searching for lighthouses near ${params.latitude}, ${params.longitude}`);
      console.log('GeoApify Lighthouse URL:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'SIDEQUEST/1.0'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GeoApify API error details:', errorText);
        throw new Error(`GeoApify API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: GeoApifyResponse = await response.json();
      
      console.log(`GeoApify returned ${data.features?.length || 0} lighthouse locations`);

      if (!data.features || data.features.length === 0) {
        return {
          success: true,
          locations: [],
          apiCalls: 1
        };
      }

      // Transform GeoApify results to ChunkLocation format
      const locations: ChunkLocation[] = data.features.map((feature, index) => {
        const props = feature.properties;
        
        // Generate description based on available data
        const description = this.generateLighthouseDescription(props);
        
        // Format location string
        const locationStr = this.formatLocationString(props);

        return {
          id: `geoapify-lighthouse-${props.place_id || index}`,
          title: props.name || 'Historic Lighthouse',
          description,
          lat: props.lat,
          lng: props.lon,
          location: locationStr,
          type: 'lighthouse',
          url: props.website,
          phone: props.phone,
          rating: props.rating,
          hours: props.opening_hours
        };
      });

      console.log(`Found ${locations.length} lighthouse locations`);
      
      return {
        success: true,
        locations,
        apiCalls: 1
      };

    } catch (error) {
      console.error('Error searching for lighthouses:', error);
      return {
        success: false,
        locations: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        apiCalls: 1
      };
    }
  }

  /**
   * Generate description for lighthouse location
   */
  private generateLighthouseDescription(props: GeoApifyPlace['properties']): string {
    const descriptions = [];
    
    // Base description
    descriptions.push('A historic lighthouse standing as a beacon of maritime heritage with stunning coastal views.');

    // Add details if available
    if (props.details && props.details.length > 0) {
      descriptions.push(`Features: ${props.details.join(', ')}.`);
    }

    // Add rating info
    if (props.rating) {
      descriptions.push(`Rated ${props.rating}/5 by visitors.`);
    }

    return descriptions.join(' ');
  }

  /**
   * Format location string from GeoApify data
   */
  private formatLocationString(props: GeoApifyPlace['properties']): string {
    if (props.formatted) {
      return props.formatted;
    }

    const parts = [];
    if (props.city) parts.push(props.city);
    if (props.state) parts.push(props.state);
    
    return parts.length > 0 ? parts.join(', ') : `Lighthouse (${props.lat.toFixed(4)}, ${props.lon.toFixed(4)})`;
  }
}