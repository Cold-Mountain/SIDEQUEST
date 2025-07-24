import { BaseChunk } from './BaseChunk';
import { ChunkLocation, ChunkSearchParams, ChunkResult } from './types';
import { atlasobscura } from 'atlas-obscura-api';

export class ObscuraChunk extends BaseChunk {
  constructor() {
    super(
      'Atlas Obscura Explorer',
      'obscura',
1, // Equal weight with other chunks
      {
        timeOfDay: 'any',
        weather: 'any', // Most obscura locations work in any weather
        modes: ['adventure'] // Adventure mode only
      }
    );
  }

  protected isServiceAvailable(): boolean {
    // Atlas Obscura API doesn't require API keys
    return true;
  }

  /**
   * Search for Atlas Obscura locations
   */
  public async searchLocations(params: ChunkSearchParams): Promise<ChunkResult> {
    try {
      console.log(`Searching Atlas Obscura near coordinates: ${params.latitude}, ${params.longitude}`);
      
      // Search for locations near the coordinates
      const searchResults = await atlasobscura.search({ 
        lat: params.latitude, 
        lng: params.longitude 
      });
      
      console.log('Atlas Obscura search results:', searchResults);
      console.log('Type of searchResults:', typeof searchResults);
      console.log('Is array:', Array.isArray(searchResults));
      
      // Handle different possible return formats
      let resultsArray: unknown[] = [];
      
      if (Array.isArray(searchResults)) {
        resultsArray = searchResults;
      } else if (searchResults && typeof searchResults === 'object') {
        // Maybe it's wrapped in an object
        if ((searchResults as any).results && Array.isArray((searchResults as any).results)) {
          resultsArray = (searchResults as any).results;
        } else if ((searchResults as any).data && Array.isArray((searchResults as any).data)) {
          resultsArray = (searchResults as any).data;
        } else {
          console.log('Unexpected searchResults format:', searchResults);
          return {
            success: true,
            locations: [],
            apiCalls: 1
          };
        }
      } else {
        console.log('No valid search results returned');
        return {
          success: true,
          locations: [],
          apiCalls: 1
        };
      }
      
      if (resultsArray.length === 0) {
        console.log('No Atlas Obscura locations found');
        return {
          success: true,
          locations: [],
          apiCalls: 1
        };
      }
      
      // Shuffle results and take requested count
      const limit = Math.min(params.limit || 10, resultsArray.length);
      const shuffled = (resultsArray as any[]).sort(() => 0.5 - Math.random());
      const selectedResults = shuffled.slice(0, limit);
      
      console.log(`Found ${selectedResults.length} Atlas Obscura locations`);
      
      // Transform all results to ChunkLocation format
      const locations: ChunkLocation[] = selectedResults.map((result: any, index: number) => {
        // Extract coordinates from nested coordinates object
        const lat = result.coordinates?.lat || result.lat;
        const lng = result.coordinates?.lng || result.lng;
        
        console.log(`Atlas location: ${result.title}, coords: ${lat}, ${lng}`);
        
        return {
          id: `atlas-${result.id || index}`,
          title: result.title || 'Unknown Location',
          description: this.generateObscuraDescription(result),
          lat: lat,
          lng: lng,
          location: result.location || 'Unknown Location',
          url: result.id ? `https://www.atlasobscura.com/places/${result.id}` : result.url,
          type: 'obscura',
          distance: result.distance_from_query || result.distance
        };
      });
      
      return {
        success: true,
        locations,
        apiCalls: 1
      };
      
    } catch (error) {
      console.error('Error getting Atlas Obscura locations:', error);
      return {
        success: false,
        locations: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        apiCalls: 1
      };
    }
  }

  /**
   * Generate rich description for Atlas Obscura location
   */
  private generateObscuraDescription(result: any): string {
    const descriptions = [];
    
    // Use subtitle as primary description
    if (result.subtitle) {
      descriptions.push(result.subtitle);
    } else if (result.description) {
      descriptions.push(result.description);
    } else {
      descriptions.push('A unique and fascinating location featured on Atlas Obscura.');
    }

    // Add location context
    if (result.location && !descriptions[0]?.includes(result.location)) {
      descriptions.push(`Located in ${result.location}.`);
    }

    // Add distance info if available
    if (result.distance_from_query || result.distance) {
      const distance = result.distance_from_query || result.distance;
      descriptions.push(`Approximately ${distance} miles away.`);
    }

    return descriptions.join(' ');
  }

  /**
   * Get a single random Atlas Obscura location
   */
  public async getRandomObscuraLocation(
    latitude: number, 
    longitude: number
  ): Promise<ChunkLocation | null> {
    const result = await this.searchLocations({
      latitude,
      longitude,
      limit: 1
    });
    
    if (result.success && result.locations.length > 0) {
      return result.locations[0];
    }
    
    return null;
  }

  /**
   * Get multiple Atlas Obscura locations with enhanced variety
   */
  public async getMultipleObscuraLocations(
    params: ChunkSearchParams
  ): Promise<ChunkLocation[]> {
    const result = await this.searchLocations({
      ...params,
      limit: Math.min(params.limit || 10, 15) // Get more for better variety
    });
    
    return result.success ? result.locations : [];
  }
}