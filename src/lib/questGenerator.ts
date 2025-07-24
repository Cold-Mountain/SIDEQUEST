import { QuestBlock, QuestInput, GeneratedQuest, QuestGenerationResponse, AtlasObscuraLocation, TrailLocation } from '@/types/database';
import { database } from './googleSheets';
import { chunkManager, initializeChunks, ChunkLocation } from './chunks';
import { CoolnessCalculator } from './chunks/CoolnessCalculator';

// Difficulty mapping for calculations
const DIFFICULTY_VALUES = {
  easy: 1,
  medium: 2,
  hard: 3,
  extreme: 4
} as const;

const VALUE_TO_DIFFICULTY = {
  1: 'easy',
  2: 'medium', 
  3: 'hard',
  4: 'extreme'
} as const;

// Time constraints for each timeframe (in minutes)
const TIMEFRAME_LIMITS = {
  quick: 60,      // < 1 hour
  afternoon: 240, // few hours (4 hours max)
  day: 480,       // full day (8 hours max)
  epic: 1440      // multi-day (24 hours max for single day)
} as const;

export class QuestGenerator {
  private static instance: QuestGenerator;
  private chunksInitialized = false;

  public static getInstance(): QuestGenerator {
    if (!QuestGenerator.instance) {
      QuestGenerator.instance = new QuestGenerator();
    }
    return QuestGenerator.instance;
  }

  /**
   * Initialize the chunk system if not already done
   */
  private initializeChunksIfNeeded(): void {
    if (!this.chunksInitialized) {
      console.log('=== DEBUGGING CHUNK INITIALIZATION ===');
      console.log('GOOGLE_MAPS_API_KEY available:', !!process.env.GOOGLE_MAPS_API_KEY);
      console.log('GEOAPIFY_API_KEY available:', !!process.env.GEOAPIFY_API_KEY);
      
      initializeChunks();
      this.chunksInitialized = true;
      console.log('Chunk system initialized in QuestGenerator');
      
      // Debug chunk stats
      const stats = chunkManager.getStats();
      console.log('=== CHUNK STATS ===');
      console.log(`Total chunks: ${stats.totalChunks}`);
      console.log(`Enabled chunks: ${stats.enabledChunks}`);
      console.log('Chunk types:', stats.chunkTypes);
      console.log('========================');
    }
  }

  /**
   * Filter quest blocks based on user input criteria
   */
  private filterQuestBlocks(blocks: QuestBlock[], input: QuestInput): QuestBlock[] {
    console.log(`Filtering ${blocks.length} blocks with input:`, input);
    
    const filtered = blocks.filter(block => {
      // Debug each filter step
      
      // 0. Filter out location blocks when Adventure theme is selected (Atlas Obscura will provide locations)
      if (input.theme === 'adventure' && block.Block_Type === 'location') {
        console.log(`Block ${block.Block_ID}: filtered out (location block in adventure mode)`);
        return false;
      }

      // 1. Difficulty filter (±1 level)
      const userDifficultyValue = DIFFICULTY_VALUES[input.difficulty];
      const blockDifficultyValue = DIFFICULTY_VALUES[block.Difficulty_Tag];
      const difficultyRange = [userDifficultyValue - 1, userDifficultyValue, userDifficultyValue + 1];
      
      if (!difficultyRange.includes(blockDifficultyValue)) {
        console.log(`Block ${block.Block_ID}: filtered out (difficulty ${block.Difficulty_Tag} not in range for ${input.difficulty})`);
        return false;
      }

      // 2. Transportation filter
      if (input.transportation === 'no_car' && block.Transportation_Required === 'car_required') {
        console.log(`Block ${block.Block_ID}: filtered out (car required but user has no car)`);
        return false;
      }

      // 3. Theme filter - simplified and consistent
      if (input.theme) {
        const blockThemes = block.Theme_Tags?.toLowerCase().split(',').map(t => t.trim()) || [];
        const hasNoTheme = !block.Theme_Tags || block.Theme_Tags.trim() === '';
        
        let hasMatchingTheme = false;
        
        if (input.theme === 'adventure') {
          // Adventure mode: location-based themes (journey, general exploration)
          hasMatchingTheme = blockThemes.includes('journey') || 
                           blockThemes.includes('general') ||
                           hasNoTheme; // Include untagged blocks for flexibility
        } else if (input.theme === 'wildcard') {
          // Wildcard mode: diverse experiences (all themes except pure journey)
          hasMatchingTheme = blockThemes.includes('general') || 
                           blockThemes.includes('life_changing') || 
                           blockThemes.includes('virtuous') || 
                           blockThemes.includes('romantic') ||
                           hasNoTheme; // Include untagged blocks
        }
        
        if (!hasMatchingTheme) {
          console.log(`Block ${block.Block_ID}: filtered out (theme mismatch: block has '${block.Theme_Tags}', looking for '${input.theme}')`);
          return false;
        }
      }

      // 4. Time constraint filter
      const timeLimit = TIMEFRAME_LIMITS[input.timeframe];
      if (block.Time_Required > timeLimit) {
        console.log(`Block ${block.Block_ID}: filtered out (time ${block.Time_Required}min > limit ${timeLimit}min)`);
        return false;
      }

      console.log(`Block ${block.Block_ID}: PASSED all filters (theme: '${block.Theme_Tags}', difficulty: ${block.Difficulty_Tag}, time: ${block.Time_Required}min)`);
      return true;
    });
    
    console.log(`After filtering: ${filtered.length} blocks remaining`);
    if (filtered.length === 0 && blocks.length > 0) {
      console.log('Sample block themes:', blocks.slice(0, 3).map(b => ({ id: b.Block_ID, themes: b.Theme_Tags })));
    }
    
    return filtered;
  }

  /**
   * Calculate average difficulty from selected blocks
   */
  private calculateAverageDifficulty(blocks: QuestBlock[]): 'easy' | 'medium' | 'hard' | 'extreme' {
    const values = blocks.map(block => DIFFICULTY_VALUES[block.Difficulty_Tag]);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const rounded = Math.round(average);
    
    // Ensure we stay within valid range
    const clampedValue = Math.max(1, Math.min(4, rounded)) as 1 | 2 | 3 | 4;
    return VALUE_TO_DIFFICULTY[clampedValue];
  }

  /**
   * Extract unique tags from selected blocks
   */
  private extractTags(blocks: QuestBlock[]): string[] {
    const allTags = blocks
      .map(block => block.Theme_Tags || '')
      .filter(tags => tags.trim() !== '')
      .flatMap(tags => tags.split(',').map(tag => tag.trim().toLowerCase()))
      .filter(tag => tag !== '');

    return [...new Set(allTags)];
  }

  /**
   * Generate a pure chunk-based quest for adventure mode (no blocks/seeds)
   */
  private generateChunkQuest(
    questId: string,
    chunkLocation: ChunkLocation,
    input: QuestInput
  ): GeneratedQuest | null {
    if (!chunkLocation) {
      return null;
    }

    // Create quest description based purely on the chunk location
    const description = `Explore ${chunkLocation.title}`;
    
    // Use default values for adventure mode
    const totalTime = 120; // 2 hours default for adventure mode
    const difficulty = input.difficulty;
    const tags = ['adventure', 'exploration'];

    // Convert ChunkLocation to appropriate format
    let atlasLocation: AtlasObscuraLocation | undefined;
    let trailLocation: TrailLocation | undefined;

    if (chunkLocation.type === 'obscura') {
      atlasLocation = {
        title: chunkLocation.title,
        description: chunkLocation.description,
        lat: chunkLocation.lat,
        lng: chunkLocation.lng,
        location: chunkLocation.location,
        url: chunkLocation.url,
        id: chunkLocation.id.replace('atlas-', ''),
        distance: chunkLocation.distance
      };
    } else {
      trailLocation = {
        id: chunkLocation.id,
        title: chunkLocation.title,
        description: chunkLocation.description,
        lat: chunkLocation.lat,
        lng: chunkLocation.lng,
        location: chunkLocation.location,
        url: chunkLocation.url,
        directions: chunkLocation.directions,
        phone: chunkLocation.phone,
        type: 'trail'
      };
    }

    return {
      id: questId,
      description,
      totalTime,
      difficulty,
      blocks: [], // No blocks for adventure mode
      tags,
      atlasLocation,
      trailLocation,
      chunkLocations: [chunkLocation]
    };
  }

  /**
   * Generate a single quest from 1 block (+ optional Atlas Obscura location or trail) for wildcard mode
   */
  private generateSingleQuest(
    filteredBlocks: QuestBlock[], 
    questId: string, 
    atlasLocation?: AtlasObscuraLocation,
    trailLocation?: TrailLocation,
    chunkLocations?: ChunkLocation[]
  ): GeneratedQuest | null {
    if (filteredBlocks.length < 1) {
      return null;
    }

    // Randomly select 1 block
    const randomIndex = Math.floor(Math.random() * filteredBlocks.length);
    const selectedBlock = filteredBlocks[randomIndex];

    // Create quest description
    let description = selectedBlock.Idea;
    
    // If we have an Atlas Obscura location, incorporate it
    if (atlasLocation) {
      description = `${selectedBlock.Idea} at ${atlasLocation.title}`;
    }
    // If we have a trail location, incorporate it
    else if (trailLocation) {
      description = `${selectedBlock.Idea} at ${trailLocation.title}`;
    }

    // Calculate total time (just the single block's time)
    const totalTime = selectedBlock.Time_Required;

    // Difficulty is just the block's difficulty
    const difficulty = selectedBlock.Difficulty_Tag;

    // Extract tags from the single block
    const tags = selectedBlock.Theme_Tags ? 
      selectedBlock.Theme_Tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '') : 
      [];

    return {
      id: questId,
      description,
      totalTime,
      difficulty,
      blocks: [selectedBlock],
      tags,
      atlasLocation,
      trailLocation,
      chunkLocations
    };
  }

  /**
   * Generate 3 quest options based on user input
   */
  public async generateQuests(input: QuestInput): Promise<QuestGenerationResponse> {
    try {
      console.log(`Generating quests for ${input.theme} mode`);
      
      // Initialize chunk system
      this.initializeChunksIfNeeded();

      // Adventure Mode: Pure chunk-based quests (no blocks/seeds)
      if (input.theme === 'adventure') {
        return await this.generateAdventureModeQuests(input);
      }
      
      // Wildcard Mode: Block/seed-based quests with optional chunk locations
      return await this.generateWildcardModeQuests(input);
      
    } catch (error) {
      console.error('Error generating quests:', error);
      return {
        success: false,
        quests: [],
        filteredBlocksCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate adventure mode quests using only chunks (no blocks/seeds)
   */
  private async generateAdventureModeQuests(input: QuestInput): Promise<QuestGenerationResponse> {
    console.log('Generating adventure mode quests using only chunks...');
    
    if (!input.location) {
      return {
        success: false,
        quests: [],
        filteredBlocksCount: 0,
        error: 'Adventure mode requires a location to find interesting places nearby.'
      };
    }

    // Get chunk locations for adventure mode
    let chunkLocations: ChunkLocation[] = [];
    
    try {
      const currentConditions = {
        season: this.getCurrentSeason(),
        weather: 'any',
        timeOfDay: this.getTimeOfDay(),
        state: input.location.state || 'unknown',
        mode: 'adventure'
      };
      
      chunkLocations = await chunkManager.getRandomLocations(
        {
          latitude: input.location.latitude,
          longitude: input.location.longitude,
          radiusMiles: 25,
          limit: 10,
          theme: input.theme,
          difficulty: input.difficulty,
          timeframe: input.timeframe
        },
        10, // Get more locations for better variety
        currentConditions
      );
      
      console.log(`Fetched ${chunkLocations.length} adventure locations`);
      
    } catch (error) {
      console.error('Error fetching adventure locations:', error);
      return {
        success: false,
        quests: [],
        filteredBlocksCount: 0,
        error: 'Failed to find adventure locations nearby.'
      };
    }

    if (chunkLocations.length === 0) {
      return {
        success: false,
        quests: [],
        filteredBlocksCount: 0,
        error: 'No adventure locations found nearby. Try a different area.'
      };
    }

    // Generate and filter quests by coolness
    const questOptions: GeneratedQuest[] = [];
    const maxAttempts = Math.min(10, chunkLocations.length * 2); // More attempts for better quality
    
    console.log('🎯 Generating adventure quests with coolness filtering...');
    
    for (let i = 0; i < maxAttempts && questOptions.length < 3; i++) {
      // Use modulo to cycle through available locations
      const locationIndex = i % chunkLocations.length;
      const chunkLocation = chunkLocations[locationIndex];
      
      console.log(`Creating adventure quest for: ${chunkLocation.title}`);
      
      const quest = this.generateChunkQuest(
        `quest_${Date.now()}_${i}`,
        chunkLocation,
        input
      );
      
      if (quest) {
        // Calculate coolness score
        const coolnessScore = CoolnessCalculator.calculateQuestCoolness(quest);
        const coolnessCategory = CoolnessCalculator.getCoolnessCategory(coolnessScore);
        
        console.log(`⭐ Quest coolness: ${coolnessScore}/5 (${coolnessCategory}) - ${quest.description}`);
        
        // Apply coolness filtering - prefer quests with score >= 2.5
        const meetsMinimum = CoolnessCalculator.meetsMinimumCoolness(quest, 2.0); // Slightly lower threshold for adventure mode
        
        if (meetsMinimum || questOptions.length < 1) { // Always accept first quest as fallback
          questOptions.push(quest);
          console.log(`✅ Quest accepted (coolness: ${coolnessScore})`);
        } else {
          console.log(`❌ Quest rejected (coolness: ${coolnessScore} below threshold)`);
        }
      }
    }

    // Sort quests by coolness score (highest first)
    const sortedQuests = CoolnessCalculator.sortQuestsByCoolness(questOptions) as GeneratedQuest[];
    
    console.log('📊 Final quest coolness rankings:');
    sortedQuests.forEach((quest, index) => {
      const score = CoolnessCalculator.calculateQuestCoolness(quest);
      const category = CoolnessCalculator.getCoolnessCategory(score);
      console.log(`  ${index + 1}. ${quest.description.slice(0, 50)}... - ${score}/5 (${category})`);
    });

    return {
      success: true,
      quests: sortedQuests,
      filteredBlocksCount: chunkLocations.length
    };
  }

  /**
   * Generate wildcard mode quests using blocks/seeds with optional chunk locations
   */
  private async generateWildcardModeQuests(input: QuestInput): Promise<QuestGenerationResponse> {
    console.log('Generating wildcard mode quests using blocks/seeds...');
    
    // Fetch all quest blocks from database
    const allBlocks = await database.getQuestBlocks();

    // Filter blocks based on criteria
    const filteredBlocks = this.filterQuestBlocks(allBlocks, input);

    // Check if we have enough blocks
    if (filteredBlocks.length < 1) {
      return {
        success: false,
        quests: [],
        filteredBlocksCount: filteredBlocks.length,
        error: `Not enough quest blocks available for wildcard mode. Found ${filteredBlocks.length}, need at least 1.`
      };
    }

    // Get chunk locations if location is provided (optional for wildcard)
    let chunkLocations: ChunkLocation[] = [];
    
    if (input.location) {
      try {
        const currentConditions = {
          season: this.getCurrentSeason(),
          weather: 'any',
          timeOfDay: this.getTimeOfDay(),
          state: input.location.state || 'unknown',
          mode: 'wildcard'
        };
        
        chunkLocations = await chunkManager.getRandomLocations(
          {
            latitude: input.location.latitude,
            longitude: input.location.longitude,
            radiusMiles: 25,
            limit: 5,
            theme: input.theme,
            difficulty: input.difficulty,
            timeframe: input.timeframe
          },
          5,
          currentConditions
        );
        
        console.log(`Fetched ${chunkLocations.length} wildcard locations`);
        
      } catch (error) {
        console.warn('Chunk system error for wildcard mode:', error);
        // Continue without locations - wildcard can work with just blocks
      }
    }

    // Generate quest options with coolness filtering
    const questOptions: GeneratedQuest[] = [];
    const maxAttempts = 8; // More attempts for better quality
    
    console.log('🎲 Generating wildcard quests with coolness filtering...');
    
    for (let i = 0; i < maxAttempts && questOptions.length < 3; i++) {
      let atlasLocation: AtlasObscuraLocation | undefined;
      let trailLocation: TrailLocation | undefined;

      // Optionally use chunk locations for wildcard mode
      if (chunkLocations.length > 0) {
        const locationIndex = Math.floor(Math.random() * chunkLocations.length);
        const selectedLocation = chunkLocations[locationIndex];
        
        console.log(`Using ${selectedLocation.type} chunk for wildcard - ${selectedLocation.title}`);
        
        if (selectedLocation.type === 'obscura') {
          atlasLocation = {
            title: selectedLocation.title,
            description: selectedLocation.description,
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            location: selectedLocation.location,
            url: selectedLocation.url,
            id: selectedLocation.id.replace('atlas-', ''),
            distance: selectedLocation.distance
          };
        } else {
          trailLocation = {
            id: selectedLocation.id,
            title: selectedLocation.title,
            description: selectedLocation.description,
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            location: selectedLocation.location,
            url: selectedLocation.url,
            directions: selectedLocation.directions,
            phone: selectedLocation.phone,
            type: 'trail'
          };
        }
      }
      
      // Generate a block-based quest for wildcard mode
      const quest = this.generateSingleQuest(
        filteredBlocks, 
        `quest_${Date.now()}_${i}`, 
        atlasLocation,
        trailLocation,
        chunkLocations
      );
      
      if (quest) {
        // Calculate coolness score
        const coolnessScore = CoolnessCalculator.calculateQuestCoolness(quest);
        const coolnessCategory = CoolnessCalculator.getCoolnessCategory(coolnessScore);
        
        console.log(`⭐ Wildcard quest coolness: ${coolnessScore}/5 (${coolnessCategory}) - ${quest.description}`);
        
        // Apply coolness filtering - slightly higher threshold for wildcard
        const meetsMinimum = CoolnessCalculator.meetsMinimumCoolness(quest, 2.2);
        
        if (meetsMinimum || questOptions.length < 1) { // Always accept first quest as fallback
          questOptions.push(quest);
          console.log(`✅ Wildcard quest accepted (coolness: ${coolnessScore})`);
        } else {
          console.log(`❌ Wildcard quest rejected (coolness: ${coolnessScore} below threshold)`);
        }
      }
    }

    // Sort quests by coolness score (highest first)
    const sortedQuests = CoolnessCalculator.sortQuestsByCoolness(questOptions) as GeneratedQuest[];
    
    console.log('🎲 Final wildcard quest coolness rankings:');
    sortedQuests.forEach((quest, index) => {
      const score = CoolnessCalculator.calculateQuestCoolness(quest);
      const category = CoolnessCalculator.getCoolnessCategory(score);
      console.log(`  ${index + 1}. ${quest.description.slice(0, 50)}... - ${score}/5 (${category})`);
    });

    return {
      success: sortedQuests.length > 0,
      quests: sortedQuests,
      filteredBlocksCount: filteredBlocks.length,
      error: sortedQuests.length === 0 ? 'Failed to generate any wildcard quests after multiple attempts' : undefined
    };
  }

  /**
   * Get current season for chunk conditions
   */
  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  /**
   * Get current time of day for chunk conditions
   */
  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
}

// Export singleton instance
export const questGenerator = QuestGenerator.getInstance();