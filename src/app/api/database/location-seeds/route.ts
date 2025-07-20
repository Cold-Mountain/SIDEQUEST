import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    const locationSeeds = await database.getLocationSeeds(forceRefresh);
    
    return NextResponse.json({
      success: true,
      data: locationSeeds,
      count: locationSeeds.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching location seeds:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch location seeds',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}