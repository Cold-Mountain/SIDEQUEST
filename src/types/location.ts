export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  accuracy?: number;
}

export interface LocationResult {
  location: Location | null;
  error?: string;
  source: 'ip' | 'gps' | 'manual';
}

export interface LocationPermission {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

export interface IPLocationResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string; // "lat,lng" format
  org: string;
  postal: string;
  timezone: string;
}