// Client-side database utilities for accessing Google Sheets data
import { QuestBlock, LocationSeed, QuestInput } from '@/types/database';

export class DatabaseClient {
  private baseUrl = '/api/database';

  // Fetch quest blocks with optional refresh
  async getQuestBlocks(forceRefresh = false): Promise<QuestBlock[]> {
    const url = `${this.baseUrl}/quest-blocks${forceRefresh ? '?refresh=true' : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quest blocks: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch quest blocks');
    }

    return result.data;
  }

  // Fetch filtered quest blocks based on criteria
  async getFilteredQuestBlocks(criteria: {
    difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
    timeRequired?: number;
    transportation?: 'has_car' | 'no_car';
    theme?: string;
    weather?: string;
    timeOfDay?: string;
    indoor?: boolean;
    outdoor?: boolean;
  }): Promise<QuestBlock[]> {
    const response = await fetch(`${this.baseUrl}/quest-blocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ criteria }),
    });

    if (!response.ok) {
      throw new Error(`Failed to filter quest blocks: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to filter quest blocks');
    }

    return result.data;
  }

  // Fetch location seeds
  async getLocationSeeds(forceRefresh = false): Promise<LocationSeed[]> {
    const url = `${this.baseUrl}/location-seeds${forceRefresh ? '?refresh=true' : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch location seeds: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch location seeds');
    }

    return result.data;
  }

  // Submit user suggestion
  async submitUserSuggestion(suggestion: {
    userEmail?: string;
    blockType: string;
    actionIdea: string;
    whyMeaningful: string;
  }): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/user-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(suggestion),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit suggestion: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success;
  }

  // Force refresh database cache
  async refreshDatabase(): Promise<{ questBlocks: number; locationSeeds: number }> {
    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh database: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to refresh database');
    }

    return result.counts;
  }

  // Get quest blocks suitable for quest generation based on user input
  async getQuestBlocksForGeneration(input: QuestInput): Promise<QuestBlock[]> {
    // Convert timeframe to time limits
    const timeLimits = {
      quick: 60,      // under 1 hour
      afternoon: 180, // 3 hours
      day: 480,       // 8 hours
      epic: 1440      // 24+ hours (no real limit)
    };

    const criteria = {
      difficulty: input.difficulty,
      timeRequired: timeLimits[input.timeframe],
      transportation: input.transportation,
      theme: input.theme,
      // Add more criteria based on current conditions
    };

    return this.getFilteredQuestBlocks(criteria);
  }
}

// Export singleton instance
export const databaseClient = new DatabaseClient();