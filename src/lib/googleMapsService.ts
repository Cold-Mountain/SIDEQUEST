// Client-side Google Maps service - calls server API endpoints

export interface TravelInfo {
  duration: string; // e.g., "25 mins"
  durationValue: number; // in seconds
  distance: string; // e.g., "15.2 km"
  distanceValue: number; // in meters
}

export interface DirectionsInfo {
  origin: string;
  destination: string;
  travelInfo: TravelInfo;
  directionsUrl: string;
  embedMapUrl: string;
}

/**
 * Calculate travel time and distance between two coordinates using server API
 */
export async function calculateTravelInfo(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<TravelInfo | null> {
  try {
    const response = await fetch('/api/directions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userLat: originLat,
        userLng: originLng,
        questLat: destLat,
        questLng: destLng,
      }),
    });

    if (!response.ok) {
      throw new Error(`Directions API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get directions');
    }

    return result.directions.travelInfo;

  } catch (error) {
    console.error('Error calculating travel info:', error);
    return null;
  }
}

/**
 * Generate Google Maps directions URL
 */
export function getDirectionsUrl(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  destinationName?: string
): string {
  const destination = destinationName 
    ? encodeURIComponent(destinationName)
    : `${destLat},${destLng}`;
  
  return `https://www.google.com/maps/dir/${originLat},${originLng}/${destination}`;
}

/**
 * Generate Google Maps embed URL for displaying the route (client-side safe)
 */
export function getEmbedMapUrl(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  destinationName?: string
): string {
  // This will be handled by the server API
  return '';
}

/**
 * Get complete directions information for a quest location via server API
 */
export async function getQuestDirections(
  userLat: number,
  userLng: number,
  questLat: number,
  questLng: number,
  questLocationName?: string
): Promise<DirectionsInfo | null> {
  try {
    const response = await fetch('/api/directions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userLat,
        userLng,
        questLat,
        questLng,
        questLocationName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Directions API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get quest directions');
    }

    return result.directions;

  } catch (error) {
    console.error('Error getting quest directions:', error);
    return null;
  }
}

/**
 * Check if Google Maps API is available by calling server endpoint
 */
export async function isGoogleMapsAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/api/directions');
    const result = await response.json();
    return result.success && result.mapsAvailable;
  } catch (error) {
    console.error('Error checking Maps availability:', error);
    return false;
  }
}