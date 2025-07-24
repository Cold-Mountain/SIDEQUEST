import { ChunkLocation } from './types';
import { GeneratedQuest } from '../../types/database';

/**
 * Calculate coolness score for a quest based on its components
 */
export class CoolnessCalculator {
  /**
   * Calculate coolness score for a chunk location
   */
  public static calculateLocationCoolness(location: ChunkLocation): number {
    let coolnessScore = 0;

    // Base score based on chunk type
    const typeScores: Record<string, number> = {
      // Highest coolness (5 points)
      'obscura': 5,
      
      // High coolness (4 points)
      'wind_generator': 4,
      'google_psychic': 4,
      'google_cat_cafe': 4,
      'google_japanese_inn': 4,
      
      // Medium-high coolness (3 points)
      'google_observation_deck': 3,
      'lighthouse': 3,
      'google_off_roading': 3,
      
      // Medium coolness (2 points)
      'hiking': 2,
      'beach': 2,
      'google_beach': 2,
      'google_hiking_area': 2,
      'skateboard_park': 2,
      'google_marina': 2,
      
      // Lower coolness (1 point)
      'mountain': 1,
      'national_park': 1,
      'pier': 1,
      'trail': 1
    };

    coolnessScore += typeScores[location.type] || 1;

    // Bonus for high ratings
    if (location.rating) {
      if (location.rating >= 4.5) coolnessScore += 1;
      else if (location.rating >= 4.0) coolnessScore += 0.5;
    }

    // Bonus for unique descriptions (longer descriptions often indicate more interesting places)
    if (location.description && location.description.length > 100) {
      coolnessScore += 0.5;
    }

    // Bonus for locations with URLs (indicates more information/legitimacy)
    if (location.url && location.url.includes('atlasobscura')) {
      coolnessScore += 1; // Atlas Obscura locations are inherently cooler
    } else if (location.url) {
      coolnessScore += 0.3;
    }

    return Math.round(coolnessScore * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Calculate overall quest coolness score
   */
  public static calculateQuestCoolness(quest: Partial<GeneratedQuest>): number {
    let totalCoolness = 0;
    let locationCount = 0;

    // Score Atlas Obscura location
    if (quest.atlasLocation) {
      const mockLocation: ChunkLocation = {
        id: quest.atlasLocation.id || 'atlas',
        title: quest.atlasLocation.title,
        description: quest.atlasLocation.description,
        lat: quest.atlasLocation.lat,
        lng: quest.atlasLocation.lng,
        location: quest.atlasLocation.location || '',
        type: 'obscura',
        url: quest.atlasLocation.url,
        distance: quest.atlasLocation.distance
      };
      totalCoolness += this.calculateLocationCoolness(mockLocation);
      locationCount++;
    }

    // Score trail location
    if (quest.trailLocation) {
      const mockLocation: ChunkLocation = {
        id: quest.trailLocation.id,
        title: quest.trailLocation.title,
        description: quest.trailLocation.description,
        lat: quest.trailLocation.lat,
        lng: quest.trailLocation.lng,
        location: quest.trailLocation.location || '',
        type: quest.trailLocation.type || 'trail',
        url: quest.trailLocation.url,
        directions: quest.trailLocation.directions,
        phone: quest.trailLocation.phone
      };
      totalCoolness += this.calculateLocationCoolness(mockLocation);
      locationCount++;
    }

    // Score chunk locations
    if (quest.chunkLocations && quest.chunkLocations.length > 0) {
      for (const location of quest.chunkLocations) {
        totalCoolness += this.calculateLocationCoolness(location);
        locationCount++;
      }
    }

    // Calculate average coolness
    const averageCoolness = locationCount > 0 ? totalCoolness / locationCount : 0;

    // Bonus for multiple interesting locations
    if (locationCount > 1 && averageCoolness >= 3) {
      totalCoolness += 0.5;
    }

    return Math.round(totalCoolness * 10) / 10;
  }

  /**
   * Get coolness category label
   */
  public static getCoolnessCategory(score: number): string {
    if (score >= 5) return 'Legendary';
    if (score >= 4) return 'Epic';
    if (score >= 3) return 'Cool';
    if (score >= 2) return 'Interesting';
    if (score >= 1) return 'Standard';
    return 'Basic';
  }

  /**
   * Check if quest meets minimum coolness threshold
   */
  public static meetsMinimumCoolness(quest: Partial<GeneratedQuest>, minScore: number = 2.5): boolean {
    const score = this.calculateQuestCoolness(quest);
    return score >= minScore;
  }

  /**
   * Sort quests by coolness score (descending)
   */
  public static sortQuestsByCoolness(quests: Partial<GeneratedQuest>[]): Partial<GeneratedQuest>[] {
    return quests.sort((a, b) => {
      const scoreA = this.calculateQuestCoolness(a);
      const scoreB = this.calculateQuestCoolness(b);
      return scoreB - scoreA;
    });
  }
}