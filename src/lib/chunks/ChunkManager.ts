import { BaseChunk } from './BaseChunk';
import { ChunkLocation, ChunkSearchParams, ChunkResult } from './types';

export class ChunkManager {
  private chunks: Map<string, BaseChunk> = new Map();
  private lastUsedChunk: string | null = null;

  /**
   * Register a chunk with the manager
   */
  public registerChunk(chunk: BaseChunk): void {
    this.chunks.set(chunk.type, chunk);
    console.log(`Registered chunk: ${chunk.name} (${chunk.type})`);
  }

  /**
   * Get all registered chunks
   */
  public getChunks(): BaseChunk[] {
    return Array.from(this.chunks.values());
  }

  /**
   * Get a specific chunk by type
   */
  public getChunk(type: string): BaseChunk | undefined {
    return this.chunks.get(type);
  }

  /**
   * Get all available chunks for current conditions
   */
  public getAvailableChunks(
    params: ChunkSearchParams,
    currentConditions?: {
      season?: string;
      weather?: string;
      timeOfDay?: string;
      state?: string;
      mode?: string;
    }
  ): BaseChunk[] {
    const allChunks = Array.from(this.chunks.values());
    console.log(`Checking ${allChunks.length} chunks for availability with conditions:`, currentConditions);
    
    const availableChunks = allChunks.filter(chunk => {
      const isAvailable = chunk.isAvailable();
      const canActivate = chunk.canActivate(params, currentConditions);
      
      console.log(`🔍 Chunk ${chunk.name}:`);
      console.log(`   - Available: ${isAvailable}`);
      console.log(`   - Can Activate: ${canActivate}`);
      console.log(`   - Modes: ${chunk.conditions?.modes?.join(', ') || 'any'}`);
      console.log(`   - Current Mode: ${currentConditions?.mode || 'none'}`);
      
      if (!isAvailable) {
        console.log(`   ❌ Chunk ${chunk.name} not available (service unavailable)`);
      } else if (!canActivate) {
        console.log(`   ❌ Chunk ${chunk.name} cannot activate (conditions not met)`);
      } else {
        console.log(`   ✅ Chunk ${chunk.name} is ready to use`);
      }
      
      return isAvailable && canActivate;
    });
    
    console.log(`Found ${availableChunks.length} available chunks`);
    return availableChunks;
  }

  /**
   * Randomly select a chunk based on weights and availability
   */
  public selectRandomChunk(
    params: ChunkSearchParams,
    currentConditions?: {
      season?: string;
      weather?: string;
      timeOfDay?: string;
      state?: string;
      mode?: string;
    }
  ): BaseChunk | null {
    const availableChunks = this.getAvailableChunks(params, currentConditions);
    
    if (availableChunks.length === 0) {
      console.warn('No available chunks for current conditions');
      return null;
    }

    // Calculate total weight
    const totalWeight = availableChunks.reduce((sum, chunk) => sum + chunk.weight, 0);
    
    // Random selection based on weights
    let random = Math.random() * totalWeight;
    
    for (const chunk of availableChunks) {
      random -= chunk.weight;
      if (random <= 0) {
        this.lastUsedChunk = chunk.type;
        console.log(`Selected chunk: ${chunk.name} (${chunk.type})`);
        return chunk;
      }
    }

    // Fallback to first available chunk
    const selectedChunk = availableChunks[0];
    this.lastUsedChunk = selectedChunk.type;
    console.log(`Fallback selected chunk: ${selectedChunk.name} (${selectedChunk.type})`);
    return selectedChunk;
  }

  /**
   * Get multiple random locations from different chunks
   */
  public async getRandomLocations(
    params: ChunkSearchParams,
    count: number = 5,
    currentConditions?: {
      season?: string;
      weather?: string;
      timeOfDay?: string;
      state?: string;
      mode?: string;
    }
  ): Promise<ChunkLocation[]> {
    const locations: ChunkLocation[] = [];
    const availableChunks = this.getAvailableChunks(params, currentConditions);
    
    if (availableChunks.length === 0) {
      console.warn('No available chunks');
      return [];
    }

    // Try to get locations from different chunks
    const chunkSelections: BaseChunk[] = [];
    
    for (let i = 0; i < count; i++) {
      const selectedChunk = this.selectRandomChunk(params, currentConditions);
      if (selectedChunk) {
        chunkSelections.push(selectedChunk);
      }
    }

    // Get locations from selected chunks with timeout
    for (const chunk of chunkSelections) {
      try {
        console.log(`Attempting to get location from chunk: ${chunk.name}`);
        
        // Add timeout to prevent slow APIs from blocking the system
        const locationPromise = chunk.getRandomLocation(params);
        const timeoutPromise = new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000) // 10 second timeout
        );
        
        const location = await Promise.race([locationPromise, timeoutPromise]);
        
        if (location) {
          console.log(`✅ Successfully got location from ${chunk.name}: ${location.title}`);
          locations.push(location);
        } else {
          console.log(`❌ No location returned from ${chunk.name}`);
        }
      } catch (error) {
        console.error(`❌ Error getting location from chunk ${chunk.name}:`, error);
        // Continue to next chunk instead of failing completely
      }
    }

    console.log(`Retrieved ${locations.length} locations from ${chunkSelections.length} chunk selections`);
    return locations;
  }

  /**
   * Get locations from a specific chunk
   */
  public async getLocationsFromChunk(
    chunkType: string,
    params: ChunkSearchParams
  ): Promise<ChunkResult> {
    const chunk = this.chunks.get(chunkType);
    
    if (!chunk) {
      return {
        success: false,
        locations: [],
        error: `Chunk type '${chunkType}' not found`
      };
    }

    if (!chunk.isAvailable()) {
      return {
        success: false,
        locations: [],
        error: `Chunk '${chunkType}' is not available`
      };
    }

    return await chunk.searchLocations(params);
  }

  /**
   * Get chunk statistics
   */
  public getStats(): {
    totalChunks: number;
    enabledChunks: number;
    chunkTypes: string[];
    lastUsedChunk: string | null;
  } {
    const enabledChunks = Array.from(this.chunks.values()).filter(chunk => chunk.isAvailable());
    
    return {
      totalChunks: this.chunks.size,
      enabledChunks: enabledChunks.length,
      chunkTypes: Array.from(this.chunks.keys()),
      lastUsedChunk: this.lastUsedChunk
    };
  }
}

// Export singleton instance
export const chunkManager = new ChunkManager();