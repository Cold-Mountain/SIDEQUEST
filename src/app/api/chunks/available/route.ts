import { NextRequest, NextResponse } from 'next/server';
import { chunkManager, initializeChunks } from '@/lib/chunks';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching available chunks...');
    
    // Initialize chunks on server-side where env vars are available
    initializeChunks();
    
    // Get all chunks
    const allChunks = chunkManager.getChunks();
    console.log('API: Found total chunks:', allChunks.length);
    
    // Map chunks to client-friendly format with availability info
    const chunkInfos = allChunks.map(chunk => {
      const isAvailable = chunk.isAvailable();
      console.log(`API: Chunk ${chunk.name} (${chunk.type}) - Available: ${isAvailable}`);
      
      return {
        name: chunk.name,
        type: chunk.type,
        weight: chunk.weight,
        description: getChunkDescription(chunk.type),
        enabled: isAvailable
      };
    });
    
    const enabledCount = chunkInfos.filter(chunk => chunk.enabled).length;
    console.log(`API: Returning ${enabledCount}/${chunkInfos.length} enabled chunks`);
    
    return NextResponse.json({
      success: true,
      chunks: chunkInfos,
      totalChunks: chunkInfos.length,
      enabledChunks: enabledCount,
      stats: chunkManager.getStats()
    });
    
  } catch (error) {
    console.error('Error fetching available chunks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch available chunks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getChunkDescription(type: string): string {
  const descriptions: Record<string, string> = {
    obscura: 'Discover unusual and fascinating places from Atlas Obscura',
    hiking: 'Find beautiful hiking trails and nature spots',
    beach: 'Explore coastal areas and waterfront locations',
    google_beach: 'Discover beaches and coastal attractions via Google Places',
    google_hiking_area: 'Find hiking areas and outdoor activities',
    google_marina: 'Locate marinas, harbors, and waterfront facilities',
    google_observation_deck: 'Find scenic viewpoints and observation decks',
    google_psychic: 'Discover metaphysical and spiritual locations',
    google_japanese_inn: 'Find Japanese-style accommodations and cultural sites',
    google_cat_cafe: 'Locate cat cafes and animal-themed venues',
    google_off_roading: 'Discover off-road and adventure vehicle locations',
    skateboard_park: 'Find skateboard parks and skating venues',
    national_park: 'Explore national parks and protected areas',
    wind_generator: 'Discover renewable energy and wind farm locations',
    mountain: 'Find mountain peaks and elevated terrain',
    lighthouse: 'Locate historic lighthouses and maritime landmarks',
    pier: 'Discover piers, docks, and waterfront structures'
  };
  
  return descriptions[type] || 'Explore interesting locations in this category';
}