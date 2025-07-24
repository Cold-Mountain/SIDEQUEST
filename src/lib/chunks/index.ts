// Chunk system exports
export * from './types';
export * from './BaseChunk';
export * from './ChunkManager';

// Individual chunk implementations
export * from './ObscuraChunk';
export * from './HikingChunk';
export * from './BeachChunk';
export * from './NationalParkChunk';
export * from './WindGeneratorChunk';
export * from './MountainChunk';
export * from './LighthouseChunk';
export * from './PierChunk';

// Google Places chunks
export * from './SkateboardParkChunk';
export * from './GoogleHikingAreaChunk';
export * from './GoogleBeachChunk';
export * from './GoogleMarinaChunk';
export * from './GoogleObservationDeckChunk';
export * from './GooglePsychicChunk';
export * from './GoogleJapaneseInnChunk';
export * from './GoogleCatCafeChunk';
export * from './GoogleOffRoadingChunk';

// Chunk initialization
import { chunkManager } from './ChunkManager';
import { ObscuraChunk } from './ObscuraChunk';
import { HikingChunk } from './HikingChunk';
import { BeachChunk } from './BeachChunk';
import { NationalParkChunk } from './NationalParkChunk';
import { WindGeneratorChunk } from './WindGeneratorChunk';
import { MountainChunk } from './MountainChunk';
import { LighthouseChunk } from './LighthouseChunk';
import { PierChunk } from './PierChunk';

// Google Places chunks
import { SkateboardParkChunk } from './SkateboardParkChunk';
import { GoogleHikingAreaChunk } from './GoogleHikingAreaChunk';
import { GoogleBeachChunk } from './GoogleBeachChunk';
import { GoogleMarinaChunk } from './GoogleMarinaChunk';
import { GoogleObservationDeckChunk } from './GoogleObservationDeckChunk';
import { GooglePsychicChunk } from './GooglePsychicChunk';
import { GoogleJapaneseInnChunk } from './GoogleJapaneseInnChunk';
import { GoogleCatCafeChunk } from './GoogleCatCafeChunk';
import { GoogleOffRoadingChunk } from './GoogleOffRoadingChunk';

// Initialize chunks
export const initializeChunks = () => {
  console.log('Initializing chunk system...');
  
  // Register Atlas Obscura chunk (always available)
  const obscuraChunk = new ObscuraChunk();
  chunkManager.registerChunk(obscuraChunk);
  
  // Register Hiking chunk (always available)
  const hikingChunk = new HikingChunk();
  chunkManager.registerChunk(hikingChunk);
  
  // Register GeoApify-based chunks (all require API key)
  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
  console.log('GEOAPIFY_API_KEY found:', !!geoapifyApiKey);
  if (geoapifyApiKey) {
    // Beach chunk (currently enabled for testing)
    const beachChunk = new BeachChunk(geoapifyApiKey);
    chunkManager.registerChunk(beachChunk);
    console.log('Beach chunk registered successfully');
    
    // National Park chunk
    const nationalParkChunk = new NationalParkChunk(geoapifyApiKey);
    chunkManager.registerChunk(nationalParkChunk);
    console.log('National Park chunk registered successfully');
    
    // Wind Generator chunk
    const windGeneratorChunk = new WindGeneratorChunk(geoapifyApiKey);
    chunkManager.registerChunk(windGeneratorChunk);
    console.log('Wind Generator chunk registered successfully');
    
    // Mountain chunk
    const mountainChunk = new MountainChunk(geoapifyApiKey);
    chunkManager.registerChunk(mountainChunk);
    console.log('Mountain chunk registered successfully');
    
    // Lighthouse chunk
    const lighthouseChunk = new LighthouseChunk(geoapifyApiKey);
    chunkManager.registerChunk(lighthouseChunk);
    console.log('Lighthouse chunk registered successfully');
    
    // Pier chunk
    const pierChunk = new PierChunk(geoapifyApiKey);
    chunkManager.registerChunk(pierChunk);
    console.log('Pier chunk registered successfully');
  } else {
    console.warn('GEOAPIFY_API_KEY not found, GeoApify chunks disabled');
  }
  
  // Register Google Places chunks (require Google Maps API key)
  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
  console.log('GOOGLE_MAPS_API_KEY found:', !!googleApiKey);
  if (googleApiKey) {
    // Skateboard Park chunk
    const skateboardParkChunk = new SkateboardParkChunk(googleApiKey);
    chunkManager.registerChunk(skateboardParkChunk);
    console.log('Skateboard Park chunk registered successfully');
    
    // Google Hiking Area chunk
    const googleHikingAreaChunk = new GoogleHikingAreaChunk(googleApiKey);
    chunkManager.registerChunk(googleHikingAreaChunk);
    console.log('Google Hiking Area chunk registered successfully');
    
    // Google Beach chunk
    const googleBeachChunk = new GoogleBeachChunk(googleApiKey);
    chunkManager.registerChunk(googleBeachChunk);
    console.log('Google Beach chunk registered successfully');
    
    // Google Marina chunk
    const googleMarinaChunk = new GoogleMarinaChunk(googleApiKey);
    chunkManager.registerChunk(googleMarinaChunk);
    console.log('Google Marina chunk registered successfully');
    
    // Google Observation Deck chunk
    const googleObservationDeckChunk = new GoogleObservationDeckChunk(googleApiKey);
    chunkManager.registerChunk(googleObservationDeckChunk);
    console.log('Google Observation Deck chunk registered successfully');
    
    // Google Psychic chunk
    const googlePsychicChunk = new GooglePsychicChunk(googleApiKey);
    chunkManager.registerChunk(googlePsychicChunk);
    console.log('Google Psychic chunk registered successfully');
    
    // Google Japanese Inn chunk
    const googleJapaneseInnChunk = new GoogleJapaneseInnChunk(googleApiKey);
    chunkManager.registerChunk(googleJapaneseInnChunk);
    console.log('Google Japanese Inn chunk registered successfully');
    
    // Google Cat Cafe chunk
    const googleCatCafeChunk = new GoogleCatCafeChunk(googleApiKey);
    chunkManager.registerChunk(googleCatCafeChunk);
    console.log('Google Cat Cafe chunk registered successfully');
    
    // Google Off-Roading chunk
    const googleOffRoadingChunk = new GoogleOffRoadingChunk(googleApiKey);
    chunkManager.registerChunk(googleOffRoadingChunk);
    console.log('Google Off-Roading chunk registered successfully');
  } else {
    console.warn('GOOGLE_MAPS_API_KEY not found, Google Places chunks disabled');
  }
  
  const stats = chunkManager.getStats();
  console.log(`Chunk system initialized: ${stats.enabledChunks}/${stats.totalChunks} chunks enabled`);
  console.log('Available chunk types:', stats.chunkTypes);
  
  return chunkManager;
};

// Export the manager instance
export { chunkManager };