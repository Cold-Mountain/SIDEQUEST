import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/googleSheets';

// Force refresh database cache
export async function POST(request: NextRequest) {
  try {
    // Clear the cache to force fresh data on next request
    database.clearCache();
    
    // Optionally pre-load fresh data
    const questBlocks = await database.getQuestBlocks(true);
    const locationSeeds = await database.getLocationSeeds(true);
    
    return NextResponse.json({
      success: true,
      message: 'Database cache refreshed successfully',
      counts: {
        questBlocks: questBlocks.length,
        locationSeeds: locationSeeds.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error refreshing database cache:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to refresh database cache',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get cache status
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Database cache status',
      timestamp: new Date().toISOString(),
      note: 'Cache will auto-refresh every 5 minutes or can be manually refreshed via POST'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get cache status' 
      },
      { status: 500 }
    );
  }
}