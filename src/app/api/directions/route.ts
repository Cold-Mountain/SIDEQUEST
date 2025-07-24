import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface TravelInfo {
  duration: string; // e.g., "25 mins"
  durationValue: number; // in seconds
  distance: string; // e.g., "15.2 km"
  distanceValue: number; // in meters
}

interface DirectionsInfo {
  origin: string;
  destination: string;
  travelInfo: TravelInfo;
  directionsUrl: string;
  embedMapUrl: string;
}

/**
 * Calculate travel time and distance between two coordinates using Google Maps Distance Matrix API
 */
async function calculateTravelInfo(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<TravelInfo | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not available');
    return null;
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', `${originLat},${originLng}`);
    url.searchParams.set('destinations', `${destLat},${destLng}`);
    url.searchParams.set('units', 'metric');
    url.searchParams.set('mode', 'driving');
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Distance Matrix API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Distance Matrix API status: ${data.status}`);
    }

    const element = data.rows?.[0]?.elements?.[0];
    
    if (!element || element.status !== 'OK') {
      throw new Error(`No route found or invalid coordinates`);
    }

    return {
      duration: element.duration.text,
      durationValue: element.duration.value,
      distance: element.distance.text,
      distanceValue: element.distance.value
    };

  } catch (error) {
    console.error('Error calculating travel info:', error);
    return null;
  }
}

/**
 * Generate Google Maps directions URL
 */
function getDirectionsUrl(
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
 * Generate Google Maps embed URL for displaying the route
 */
function getEmbedMapUrl(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  destinationName?: string
): string {
  if (!GOOGLE_MAPS_API_KEY) {
    return '';
  }

  const destination = destinationName 
    ? encodeURIComponent(destinationName)
    : `${destLat},${destLng}`;

  const url = new URL('https://www.google.com/maps/embed/v1/directions');
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
  url.searchParams.set('origin', `${originLat},${originLng}`);
  url.searchParams.set('destination', destination);
  url.searchParams.set('mode', 'driving');

  return url.toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userLat, userLng, questLat, questLng, questLocationName } = body;
    
    // Validate request body
    if (!userLat || !userLng || !questLat || !questLng) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required coordinates' 
        },
        { status: 400 }
      );
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Google Maps API not configured' 
        },
        { status: 503 }
      );
    }

    console.log('Calculating directions from', `${userLat},${userLng}`, 'to', questLocationName || `${questLat},${questLng}`);

    const travelInfo = await calculateTravelInfo(userLat, userLng, questLat, questLng);
    
    if (!travelInfo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Could not calculate travel information' 
        },
        { status: 500 }
      );
    }

    const directionsInfo: DirectionsInfo = {
      origin: `${userLat},${userLng}`,
      destination: questLocationName || `${questLat},${questLng}`,
      travelInfo,
      directionsUrl: getDirectionsUrl(userLat, userLng, questLat, questLng, questLocationName),
      embedMapUrl: getEmbedMapUrl(userLat, userLng, questLat, questLng, questLocationName)
    };

    return NextResponse.json({
      success: true,
      directions: directionsInfo
    });

  } catch (error) {
    console.error('Error in directions API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error occurred'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Directions API is running',
    mapsAvailable: !!GOOGLE_MAPS_API_KEY,
    timestamp: new Date().toISOString()
  });
}