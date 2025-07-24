import { ChunkLocation, ChunkConditions, ChunkSearchParams, ChunkResult } from './types';

export abstract class BaseChunk {
  public readonly name: string;
  public readonly type: string;
  public readonly weight: number;
  public readonly conditions?: ChunkConditions;
  protected enabled: boolean;

  constructor(
    name: string,
    type: string,
    weight: number = 1,
    conditions?: ChunkConditions
  ) {
    this.name = name;
    this.type = type;
    this.weight = weight;
    this.conditions = conditions;
    this.enabled = true;
  }

  /**
   * Check if this chunk can be used given current conditions
   */
  public canActivate(
    params: ChunkSearchParams,
    currentConditions?: {
      season?: string;
      weather?: string;
      timeOfDay?: string;
      state?: string;
      mode?: string;
    }
  ): boolean {
    if (!this.enabled) return false;

    // Check geographic restrictions
    if (this.conditions?.geographic && currentConditions?.state) {
      if (!this.conditions.geographic.includes(currentConditions.state)) {
        return false;
      }
    }

    // Check seasonal restrictions
    if (this.conditions?.season && currentConditions?.season) {
      if (this.conditions.season !== 'any' && this.conditions.season !== currentConditions.season) {
        return false;
      }
    }

    // Check weather restrictions
    if (this.conditions?.weather && currentConditions?.weather) {
      if (this.conditions.weather !== 'any' && 
          this.conditions.weather !== currentConditions.weather) {
        return false;
      }
    }

    // Check time of day restrictions
    if (this.conditions?.timeOfDay && currentConditions?.timeOfDay) {
      if (this.conditions.timeOfDay !== 'any' && 
          this.conditions.timeOfDay !== currentConditions.timeOfDay) {
        return false;
      }
    }

    // Check mode restrictions
    if (this.conditions?.modes && currentConditions?.mode) {
      if (!this.conditions.modes.includes(currentConditions.mode)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Search for locations using this chunk
   */
  public abstract searchLocations(params: ChunkSearchParams): Promise<ChunkResult>;

  /**
   * Get a random location from this chunk
   */
  public async getRandomLocation(params: ChunkSearchParams): Promise<ChunkLocation | null> {
    const result = await this.searchLocations(params);
    
    if (!result.success || result.locations.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * result.locations.length);
    return result.locations[randomIndex];
  }

  /**
   * Enable or disable this chunk
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if chunk is available
   */
  public isAvailable(): boolean {
    return this.enabled && this.isServiceAvailable();
  }

  /**
   * Check if the underlying service/API is available
   */
  protected abstract isServiceAvailable(): boolean;
}