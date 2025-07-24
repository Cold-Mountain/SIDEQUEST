import { NextRequest, NextResponse } from 'next/server';
import { chunkManager, initializeChunks } from '@/lib/chunks';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chunkType: string }> }
) {
  try {
    const { chunkType } = await params;
    const { searchParams } = new URL(request.url);
    
    // Get location parameters
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radiusMiles = searchParams.get('radius') || '25';
    const limit = searchParams.get('limit') || '20';
    
    // Validate required parameters
    if (!lat || !lng) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters: lat and lng are required' 
        },
        { status: 400 }
      );
    }

    // Parse coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid coordinates: lat and lng must be valid numbers' 
        },
        { status: 400 }
      );
    }

    console.log(`Fetching locations for chunk: ${chunkType} at ${latitude}, ${longitude}`);

    // Initialize chunks if not already done
    initializeChunks();
    
    // Get locations from the specific chunk
    const result = await chunkManager.getLocationsFromChunk(
      chunkType,
      {
        latitude,
        longitude,
        radiusMiles: parseFloat(radiusMiles),
        limit: parseInt(limit, 10)
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to fetch locations from chunk',
          chunkType
        },
        { status: 500 }
      );
    }

    // Add distance calculation for each location
    const locationsWithDistance = result.locations.map(location => {
      const distance = calculateDistance(latitude, longitude, location.lat, location.lng);
      return {
        ...location,
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
      };
    });

    // Sort by distance
    locationsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return NextResponse.json({
      success: true,
      chunkType,
      locations: locationsWithDistance,
      count: locationsWithDistance.length,
      searchParams: {
        latitude,
        longitude,
        radiusMiles: parseFloat(radiusMiles),
        limit: parseInt(limit, 10)
      }
    });

  } catch (error) {
    const resolvedParams = await params;
    console.error(`Error in chunk API for ${resolvedParams.chunkType}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error occurred while fetching locations',
        message: error instanceof Error ? error.message : 'Unknown error',
        chunkType: resolvedParams.chunkType
      },
      { status: 500 }
    );
  }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Health check endpoint
export async function OPTIONS() {
  return NextResponse.json({
    success: true,
    message: 'Chunk API endpoint is available',
    methods: ['GET'],
    parameters: {
      required: ['lat', 'lng'],
      optional: ['radius', 'limit']
    }
  });
}