// Base types for the chunk system

export interface ChunkLocation {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
  url?: string;
  phone?: string;
  directions?: string;
  type: string; // The chunk type (e.g., 'obscura', 'hiking', 'beach')
  distance?: number;
  rating?: number;
  priceLevel?: string;
  hours?: string;
  tags?: string[]; // Special tags for categorizing locations (e.g., 'darksky-certified', 'gold-tier')
}

export interface ChunkConditions {
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'any';
  weather?: 'clear' | 'rain' | 'snow' | 'any';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  temperature?: 'hot' | 'warm' | 'cool' | 'cold' | 'any';
  geographic?: string[]; // States/regions where this chunk is available
  modes?: string[]; // Quest modes where this chunk is available
}

export interface ChunkConfig {
  name: string;
  type: string;
  enabled: boolean;
  weight: number; // Higher weight = more likely to be selected
  conditions?: ChunkConditions;
  apiLimits?: {
    maxCallsPerHour?: number;
    maxResults?: number;
  };
}

export interface ChunkSearchParams {
  latitude: number;
  longitude: number;
  radiusMiles?: number;
  limit?: number;
  theme?: string;
  difficulty?: string;
  timeframe?: string;
}

export interface ChunkResult {
  success: boolean;
  locations: ChunkLocation[];
  error?: string;
  apiCalls?: number;
}