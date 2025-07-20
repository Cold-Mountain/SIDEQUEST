import type { Location, LocationResult, LocationPermission, IPLocationResponse } from '@/types/location';

/**
 * Get location using IP-based detection (no permissions required)
 * Uses ipinfo.io API for geolocation
 */
export async function getLocationByIP(): Promise<LocationResult> {
  try {
    const response = await fetch('https://ipinfo.io/json?token=your_token_here');
    
    if (!response.ok) {
      // Fallback to free service without token
      const fallbackResponse = await fetch('https://ipinfo.io/json');
      if (!fallbackResponse.ok) {
        throw new Error('Failed to fetch location data');
      }
      const data: IPLocationResponse = await fallbackResponse.json();
      return parseIPLocationResponse(data);
    }
    
    const data: IPLocationResponse = await response.json();
    return parseIPLocationResponse(data);
  } catch (error) {
    return {
      location: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      source: 'ip'
    };
  }
}

/**
 * Parse IP location response into our Location format
 */
function parseIPLocationResponse(data: IPLocationResponse): LocationResult {
  try {
    const [lat, lng] = data.loc.split(',').map(Number);
    
    const location: Location = {
      latitude: lat,
      longitude: lng,
      city: data.city,
      state: data.region,
      country: data.country,
      zip: data.postal,
      accuracy: 50000 // IP-based location is approximate (50km accuracy)
    };
    
    return {
      location,
      source: 'ip'
    };
  } catch (error) {
    return {
      location: null,
      error: 'Failed to parse location data',
      source: 'ip'
    };
  }
}

/**
 * Get location using browser GPS (requires user permission)
 */
export async function getLocationByGPS(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        location: null,
        error: 'Geolocation is not supported by this browser',
        source: 'gps'
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        resolve({
          location,
          source: 'gps'
        });
      },
      (error) => {
        let errorMessage = 'Unknown geolocation error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out';
            break;
        }
        
        resolve({
          location: null,
          error: errorMessage,
          source: 'gps'
        });
      },
      options
    );
  });
}

/**
 * Reverse geocode GPS coordinates to get city/state information
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<{
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}> {
  try {
    // Use Nominatim reverse geocoding (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding service unavailable');
    }
    
    const data = await response.json();
    
    if (!data.address) {
      throw new Error('No address found for coordinates');
    }
    
    const address = data.address;
    
    return {
      city: address.city || address.town || address.village || address.hamlet,
      state: address.state || address.province || address.region,
      country: address.country,
      zip: address.postcode
    };
  } catch (error) {
    // Return empty object if reverse geocoding fails
    return {};
  }
}

/**
 * Check geolocation permission status
 */
export async function checkLocationPermission(): Promise<LocationPermission> {
  if (!navigator.permissions) {
    return { granted: false, denied: false, prompt: true };
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    
    return {
      granted: permission.state === 'granted',
      denied: permission.state === 'denied',
      prompt: permission.state === 'prompt'
    };
  } catch (error) {
    return { granted: false, denied: false, prompt: true };
  }
}

/**
 * Get location with fallback strategy:
 * 1. Try GPS if permission granted
 * 2. Fallback to IP-based location
 * 3. Return manual input option
 */
export async function getLocationWithFallback(): Promise<LocationResult> {
  const permission = await checkLocationPermission();
  
  // Try GPS first if permission is granted
  if (permission.granted) {
    const gpsResult = await getLocationByGPS();
    if (gpsResult.location) {
      return gpsResult;
    }
  }
  
  // Fallback to IP-based location
  const ipResult = await getLocationByIP();
  return ipResult;
}

/**
 * Geocode a manual location using a free geocoding service
 */
export async function geocodeLocation(
  city: string, 
  state?: string, 
  country?: string
): Promise<LocationResult> {
  try {
    // Construct the address string
    const addressParts = [city.trim()];
    if (state?.trim()) addressParts.push(state.trim());
    if (country?.trim()) addressParts.push(country.trim());
    else addressParts.push('United States');
    
    const address = addressParts.join(', ');
    
    // Use Nominatim (OpenStreetMap) geocoding service (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('Location not found');
    }
    
    const result = data[0];
    const location: Location = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      city: city.trim(),
      state: state?.trim(),
      country: country?.trim() || 'United States',
      accuracy: 5000 // Manual geocoded location has moderate accuracy
    };
    
    return {
      location,
      source: 'manual'
    };
  } catch (error) {
    return {
      location: null,
      error: error instanceof Error ? error.message : 'Failed to find location',
      source: 'manual'
    };
  }
}

/**
 * Create a manual location from user input (deprecated - use geocodeLocation instead)
 */
export function createManualLocation(
  city: string, 
  state?: string, 
  country?: string
): LocationResult {
  // Fallback for when geocoding fails
  const location: Location = {
    latitude: 0,
    longitude: 0,
    city: city.trim(),
    state: state?.trim(),
    country: country?.trim() || 'United States',
    accuracy: 10000 // Manual location has low accuracy without geocoding
  };
  
  return {
    location,
    source: 'manual'
  };
}

/**
 * Format location for display
 */
export function formatLocation(location: Location): string {
  const parts = [];
  
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  if (location.country && location.country !== 'United States') {
    parts.push(location.country);
  }
  
  return parts.join(', ') || 'Unknown location';
}

/**
 * Calculate distance between two locations (in miles)
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(loc2.latitude - loc1.latitude);
  const dLon = toRadians(loc2.longitude - loc1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(loc1.latitude)) * Math.cos(toRadians(loc2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}