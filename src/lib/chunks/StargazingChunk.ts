import { BaseChunk } from './BaseChunk';
import { ChunkLocation, ChunkSearchParams, ChunkResult } from './types';
import { findNearbyDarkSkyLocations, DarkSkyLocation } from '../../data/darkSkyLocations';

interface GooglePlacesResult {
  name: string;
  geometry: { location: { lat: number; lng: number; }; };
  place_id: string;
  types: string[];
  rating?: number;
  vicinity?: string;
  business_status?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
}

interface GooglePlacesResponse {
  results: GooglePlacesResult[];
  status: string;
  error_message?: string;
}

export class StargazingChunk extends BaseChunk {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  constructor(apiKey: string) {
    super(
      'Stargazing Explorer',
      'stargazing',
      4, // High weight - stargazing is unique and atmospheric
      {
        weather: 'clear', // Clear skies needed for stargazing
        timeOfDay: 'night', // Optimal for stargazing
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
      return { success: false, locations: [], error: 'Google Places API key not configured' };
    }

    try {
      // First, search for nearby DarkSky certified locations
      const darkSkyResults = this.searchDarkSkyLocations(params);
      let totalApiCalls = 0;
      const radiusMeters = Math.min((params.radiusMiles || 75) * 1609.34, 160000); // Larger radius for stargazing (up to 100 miles)

      // Then search Google Places for additional locations
      const searches = [
        'observatory astronomy',
        'planetarium astronomy', 
        'dark sky park',
        'stargazing area',
        'astronomy park',
        'telescope viewing'
      ];

      const allResults: GooglePlacesResult[] = [];

      for (const keyword of searches) {
        const url = new URL(this.baseUrl);
        url.searchParams.set('location', `${params.latitude},${params.longitude}`);
        url.searchParams.set('radius', radiusMeters.toString());
        url.searchParams.set('keyword', keyword);
        url.searchParams.set('fields', 'place_id,name,geometry,types,rating,vicinity,business_status');
        url.searchParams.set('key', this.apiKey);

        const response = await fetch(url.toString());
        const data: GooglePlacesResponse = await response.json();
        totalApiCalls++;
        
        if (data.status === 'OK' && data.results) {
          allResults.push(...data.results);
        }
      }

      console.log(`Google Places returned ${allResults.length} stargazing-related locations`);

      // Remove duplicates based on place_id
      const uniqueResults = allResults.filter((result, index, self) => 
        index === self.findIndex(r => r.place_id === result.place_id)
      );

      // Filter out commercial establishments and false positives
      const filteredResults = uniqueResults.filter(result => this.isValidStargazingLocation(result));

      if (filteredResults.length === 0) {
        return { success: true, locations: [], apiCalls: totalApiCalls };
      }

      // Convert Google Places results to ChunkLocation format
      const googlePlacesLocations: ChunkLocation[] = filteredResults.map((result, index) => ({
        id: `stargazing-${result.place_id || index}`,
        title: result.name || 'Stargazing Location',
        description: this.generateDescription(result),
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        location: result.vicinity || `Stargazing Site (${result.geometry.location.lat.toFixed(4)}, ${result.geometry.location.lng.toFixed(4)})`,
        type: 'stargazing',
        rating: result.rating,
        url: `https://www.google.com/maps/place/?q=place_id:${result.place_id}`
      }));

      // Combine DarkSky and Google Places results, prioritizing DarkSky
      const combinedLocations = [...darkSkyResults, ...googlePlacesLocations];
      
      // Sort by priority: DarkSky locations first, then by distance
      combinedLocations.sort((a, b) => {
        // DarkSky locations (type includes 'darksky-') get highest priority
        const aIsDarkSky = a.id.startsWith('darksky-');
        const bIsDarkSky = b.id.startsWith('darksky-');
        
        if (aIsDarkSky && !bIsDarkSky) return -1;
        if (!aIsDarkSky && bIsDarkSky) return 1;
        
        // If both same type, sort by distance if available
        if (a.distance && b.distance) return a.distance - b.distance;
        
        // Fall back to rating and name
        if (a.rating && b.rating) return b.rating - a.rating;
        return (a.title || '').localeCompare(b.title || '');
      });
      
      const limit = Math.min(params.limit || 10, combinedLocations.length);
      const finalLocations = combinedLocations.slice(0, limit);

      return { success: true, locations: finalLocations, apiCalls: totalApiCalls };

    } catch (error) {
      return { success: false, locations: [], error: error instanceof Error ? error.message : 'Unknown error', apiCalls: 1 };
    }
  }

  private isValidStargazingLocation(result: GooglePlacesResult): boolean {
    // Filter out closed locations
    if (result.business_status === 'CLOSED_PERMANENTLY' || 
        result.business_status === 'CLOSED_TEMPORARILY') {
      return false;
    }
    
    // Filter out private/restricted access locations
    if (this.isPrivateLocation(result)) {
      return false;
    }
    
    const name = result.name?.toLowerCase() || '';
    const vicinity = result.vicinity?.toLowerCase() || '';
    
    // Exclude obvious commercial establishments
    const commercialExclusions = [
      'hollywood', 'restaurant', 'hotel', 'mall', 'shopping', 'store',
      'air conditioning', 'heating', 'plumbing', 'repair', 'auto',
      'casino', 'bar', 'club', 'theater', 'cinema', 'salon'
    ];
    
    // Check if name contains commercial terms
    if (commercialExclusions.some(term => name.includes(term))) {
      return false;
    }
    
    // Valid stargazing-related terms
    const validTerms = [
      'observatory', 'planetarium', 'dark sky', 'astronomy', 'stargazing',
      'telescope', 'science center', 'nature center', 'park', 'trail',
      'preserve', 'wilderness', 'national', 'state park'
    ];
    
    // Must contain at least one valid term
    const hasValidTerm = validTerms.some(term => 
      name.includes(term) || vicinity.includes(term)
    );
    
    return hasValidTerm;
  }
  
  private isPrivateLocation(result: GooglePlacesResult): boolean {
    const name = result.name?.toLowerCase() || '';
    const vicinity = result.vicinity?.toLowerCase() || '';
    
    // Private access indicators
    const privateIndicators = [
      'private', 'gated', 'members only', 'residents only',
      'homeowners', 'hoa', 'private community', 'private road',
      'private property', 'restricted access', 'residential only'
    ];
    
    // Check name and vicinity for private indicators
    const hasPrivateIndicator = privateIndicators.some(indicator => 
      name.includes(indicator) || vicinity.includes(indicator)
    );
    
    // Check for residential-only place types combined with observation structures
    const isResidentialOnly = result.types && 
      result.types.some(type => ['subpremise', 'premise', 'neighborhood'].includes(type)) &&
      !result.types.some(type => ['park', 'tourist_attraction', 'establishment', 'point_of_interest'].includes(type));
    
    return hasPrivateIndicator || (isResidentialOnly && name.includes('observation'));
  }
  
  private searchDarkSkyLocations(params: ChunkSearchParams): ChunkLocation[] {
    // DarkSky locations use extended 100-mile radius for premium certified locations
    const darkSkyLocations = findNearbyDarkSkyLocations(
      params.latitude,
      params.longitude,
      100, // Always use 100-mile radius for DarkSky certified locations
      5 // Get up to 5 DarkSky locations
    );
    
    return darkSkyLocations.map(location => ({
      id: `darksky-${location.id}`,
      title: location.name,
      description: this.generateDarkSkyDescription(location),
      lat: location.lat,
      lng: location.lng,
      location: `${location.name}, ${location.state}`,
      type: 'stargazing',
      rating: location.designation === 'Gold' ? 5 : location.designation === 'Silver' ? 4.5 : 4,
      url: location.website_url || `https://darksky.org/places/${location.id}`,
      distance: location.distance,
      tags: ['DarkSky Certified']
    }));
  }
  
  private generateDarkSkyDescription(location: DarkSkyLocation): string {
    const designationText = location.designation === 'Gold' ? 'Gold Tier' : 
                           location.designation === 'Silver' ? 'Silver Tier' : 
                           location.designation === 'Bronze' ? 'Bronze Tier' : '';
    
    const typeText = location.type === 'park' ? 'Dark Sky Park' :
                     location.type === 'reserve' ? 'Dark Sky Reserve' :
                     location.type === 'sanctuary' ? 'Dark Sky Sanctuary' : 
                     'Dark Sky Location';
    
    return `${designationText} International ${typeText} certified by DarkSky International. ${location.description}`;
  }

  private generateDescription(result: GooglePlacesResult): string {
    const name = result.name?.toLowerCase() || '';
    
    if (name.includes('observatory')) {
      return 'A professional observatory with telescopes and stellar views. Perfect for discovering celestial wonders and learning about astronomy.';
    } else if (name.includes('planetarium')) {
      return 'An immersive planetarium offering cosmic shows and astronomical experiences under a dome of stars.';
    } else if (name.includes('dark sky') || name.includes('astronomy')) {
      return 'A designated dark sky location ideal for stargazing, away from light pollution with optimal viewing conditions.';
    } else if (name.includes('park') || name.includes('trail') || name.includes('preserve')) {
      return 'A natural area with dark skies perfect for stargazing and astronomical observation. Escape city lights and enjoy the wonder of the night sky.';
    } else {
      return 'A location perfect for stargazing and astronomical observation. Experience the wonder of the night sky in this peaceful setting.';
    }
  }
}