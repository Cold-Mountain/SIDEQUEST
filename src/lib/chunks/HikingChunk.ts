import { BaseChunk } from './BaseChunk';
import { ChunkLocation, ChunkSearchParams, ChunkResult } from './types';

interface TrailLocation {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
  url?: string;
  directions?: string;
  phone?: string;
  type: 'trail';
}

export class HikingChunk extends BaseChunk {
  constructor() {
    super(
      'Hiking Trail Explorer',
      'hiking',
      2, // Medium weight - popular outdoor activity but common
      {
        weather: 'any', // Hiking works in various weather
        timeOfDay: 'any', // Can hike any time
        modes: ['adventure'] // Adventure mode only
      }
    );
  }

  protected isServiceAvailable(): boolean {
    // OpenStreetMap doesn't require API keys
    return true;
  }

  /**
   * Search for hiking trails using OpenStreetMap Overpass API
   */
  public async searchLocations(params: ChunkSearchParams): Promise<ChunkResult> {
    try {
      const trails = await this.searchOSMTrails(params);
      
      const locations: ChunkLocation[] = trails.map(trail => ({
        id: trail.id,
        title: trail.title,
        description: trail.description,
        lat: trail.lat,
        lng: trail.lng,
        location: trail.location,
        url: trail.url,
        directions: trail.directions,
        phone: trail.phone,
        type: 'hiking'
      }));

      return {
        success: true,
        locations,
        apiCalls: 1
      };

    } catch (error) {
      console.error('Error searching for hiking trails:', error);
      
      // Fallback to backup trails if OSM fails
      const backupTrails = this.getBackupFloridaTrails(params.latitude, params.longitude);
      const locations: ChunkLocation[] = backupTrails.map(trail => ({
        id: trail.id,
        title: trail.title,
        description: trail.description,
        lat: trail.lat,
        lng: trail.lng,
        location: trail.location,
        url: trail.url,
        directions: trail.directions,
        phone: trail.phone,
        type: 'hiking'
      }));

      return {
        success: true,
        locations,
        apiCalls: 1,
        error: 'Used backup trail data due to API issues'
      };
    }
  }

  /**
   * Search for hiking trails using OpenStreetMap Overpass API
   */
  private async searchOSMTrails(params: ChunkSearchParams): Promise<TrailLocation[]> {
    // Convert miles to meters for Overpass API (limit to 25 miles for better results)
    const radiusMiles = Math.min(params.radiusMiles || 25, 25);
    const radiusMeters = Math.round(radiusMiles * 1609.34);
    
    // Simplified Overpass API query for better results
    const overpassQuery = `
      [out:json][timeout:30];
      (
        way["highway"="footway"](around:${radiusMeters},${params.latitude},${params.longitude});
        way["highway"="path"](around:${radiusMeters},${params.latitude},${params.longitude});
        way["highway"="cycleway"](around:${radiusMeters},${params.latitude},${params.longitude});
        way["leisure"="park"](around:${radiusMeters},${params.latitude},${params.longitude});
        way["leisure"="nature_reserve"](around:${radiusMeters},${params.latitude},${params.longitude});
        relation["route"="hiking"](around:${radiusMeters},${params.latitude},${params.longitude});
      );
      out center meta;
    `;

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    console.log('Querying OpenStreetMap for hiking trails...');
    console.log('OSM Query radius (meters):', radiusMeters);
    console.log('OSM Query:', overpassQuery.trim());
    
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SIDEQUEST/1.0 (https://localhost:3000)'
      },
      body: `data=${encodeURIComponent(overpassQuery)}`
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`Overpass API returned ${data.elements?.length || 0} elements`);
    
    if (!data.elements || data.elements.length === 0) {
      return [];
    }

    // Convert OSM elements to TrailLocation format
    const trails: TrailLocation[] = [];
    const addedTrails = new Set<string>(); // Avoid duplicates
    const limit = Math.min(params.limit || 10, 10);
    
    for (const element of data.elements.slice(0, limit)) { // Limit to requested number
      if (element.type === 'way' || element.type === 'relation') {
        // Use center point from OSM response or calculate from geometry
        let centerPoint;
        if (element.center) {
          centerPoint = { lat: element.center.lat, lng: element.center.lon };
        } else {
          centerPoint = this.calculateCenterPoint(element);
        }
        if (!centerPoint) continue;
        
        const name = element.tags?.name || 
                    element.tags?.ref || 
                    this.generateTrailName(element);
                    
        const trailId = `osm-${element.type}-${element.id}`;
        
        if (addedTrails.has(trailId)) continue;
        addedTrails.add(trailId);
        
        const trail: TrailLocation = {
          id: trailId,
          title: name,
          description: this.generateTrailDescription(element),
          lat: centerPoint.lat,
          lng: centerPoint.lng,
          location: await this.getLocationName(centerPoint.lat, centerPoint.lng),
          type: 'trail'
        };
        
        trails.push(trail);
      }
    }
    
    return trails;
  }

  /**
   * Calculate center point from OSM element geometry
   */
  private calculateCenterPoint(element: any): {lat: number, lng: number} | null {
    if (!element.geometry || !element.geometry.length) return null;
    
    const coords = element.geometry;
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;
    
    for (const coord of coords) {
      if (coord.lat && coord.lon) {
        totalLat += coord.lat;
        totalLng += coord.lon;
        count++;
      }
    }
    
    if (count === 0) return null;
    
    return {
      lat: totalLat / count,
      lng: totalLng / count
    };
  }

  /**
   * Generate trail name from OSM tags
   */
  private generateTrailName(element: any): string {
    const tags = element.tags || {};
    
    if (tags.name) return tags.name;
    if (tags.ref) return `Trail ${tags.ref}`;
    
    // Generate name based on trail type
    if (tags.route === 'hiking') return 'Hiking Trail';
    if (tags.highway === 'footway') return 'Footpath Trail';
    if (tags.highway === 'path') return 'Nature Path';
    if (tags.highway === 'track') return 'Trail Track';
    if (tags.leisure === 'nature_reserve') return 'Nature Reserve Trail';
    if (tags.boundary === 'national_park') return 'National Park Trail';
    if (tags.natural === 'forest') return 'Forest Trail';
    
    return 'Walking Trail';
  }

  /**
   * Generate trail description from OSM tags
   */
  private generateTrailDescription(element: any): string {
    const tags = element.tags || {};
    
    if (tags.description) return tags.description;
    
    const descriptions = [];
    
    if (tags.surface) descriptions.push(`${tags.surface} surface`);
    if (tags.difficulty) descriptions.push(`${tags.difficulty} difficulty`);
    if (tags.length) descriptions.push(`${tags.length} long`);
    if (tags.natural) descriptions.push(`through ${tags.natural} area`);
    if (tags.leisure) descriptions.push(`in ${tags.leisure.replace('_', ' ')}`);
    
    const baseDesc = this.getBaseDescription(tags);
    const details = descriptions.length > 0 ? ` Features ${descriptions.join(', ')}.` : '';
    
    return baseDesc + details;
  }

  /**
   * Get base description based on trail type
   */
  private getBaseDescription(tags: any): string {
    if (tags.route === 'hiking') return 'A dedicated hiking trail perfect for outdoor enthusiasts.';
    if (tags.highway === 'footway') return 'A pedestrian walkway ideal for leisurely strolls.';
    if (tags.highway === 'path') return 'A natural path through scenic areas.';
    if (tags.highway === 'track') return 'A trail track suitable for walking and light hiking.';
    if (tags.leisure === 'nature_reserve') return 'A trail through a protected nature reserve.';
    if (tags.boundary === 'national_park') return 'A trail within a national park area.';
    if (tags.natural === 'forest') return 'A forest trail through natural woodland.';
    
    return 'A walking trail offering outdoor recreation opportunities.';
  }

  /**
   * Get location name using reverse geocoding
   */
  private async getLocationName(lat: number, lng: number): Promise<string> {
    try {
      // Use Nominatim (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        
        const city = address.city || address.town || address.village || address.hamlet;
        const state = address.state;
        
        if (city && state) return `${city}, ${state}`;
        if (city) return city;
        if (state) return state;
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
    }
    
    return `Trail Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }

  /**
   * Backup Florida trails for when OSM fails
   */
  private getBackupFloridaTrails(latitude: number, longitude: number): TrailLocation[] {
    // Static list of popular Florida trails as backup
    const floridaTrails: TrailLocation[] = [
      {
        id: 'backup-1',
        title: 'Wekiwa Springs State Park Trail',
        description: 'A beautiful hiking trail through Florida springs and wildlife.',
        lat: 28.7169,
        lng: -81.4424,
        location: 'Apopka, Florida',
        type: 'trail',
        directions: 'Take SR-434 west to Wekiwa Springs Road, follow signs to state park.'
      },
      {
        id: 'backup-2', 
        title: 'West Orange Trail',
        description: 'Popular 22-mile rail-trail through Central Florida.',
        lat: 28.6869,
        lng: -81.5061,
        location: 'Winter Garden, Florida',
        type: 'trail'
      },
      {
        id: 'backup-3',
        title: 'Cady Way Trail',
        description: 'Urban trail connecting multiple parks and neighborhoods.',
        lat: 28.5995,
        lng: -81.3414,
        location: 'Winter Park, Florida',
        type: 'trail'
      },
      {
        id: 'backup-4',
        title: 'Little Big Econ State Forest',
        description: 'Wilderness hiking trails through pristine Florida ecosystem.',
        lat: 28.7508,
        lng: -81.1772,
        location: 'Geneva, Florida', 
        type: 'trail'
      },
      {
        id: 'backup-5',
        title: 'Bok Tower Gardens Nature Trail',
        description: 'Scenic walking trails through historic gardens and natural areas.',
        lat: 27.9281,
        lng: -81.5881,
        location: 'Lake Wales, Florida',
        type: 'trail'
      }
    ];

    // Return 3 random trails
    const shuffled = floridaTrails.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  /**
   * Get trails with difficulty filtering
   */
  public async getTrailsByDifficulty(
    params: ChunkSearchParams,
    difficulty: 'easy' | 'medium' | 'hard'
  ): Promise<ChunkLocation[]> {
    const result = await this.searchLocations(params);
    
    if (!result.success) return [];
    
    // For now, return all trails (we could add difficulty filtering later)
    // In the future, we could parse OSM difficulty tags or use elevation data
    return result.locations;
  }
}