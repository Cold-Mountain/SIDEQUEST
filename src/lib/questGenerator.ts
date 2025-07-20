import { QuestBlock, QuestInput, GeneratedQuest, QuestGenerationResponse } from '@/types/database';
import { database } from './googleSheets';

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

  public static getInstance(): QuestGenerator {
    if (!QuestGenerator.instance) {
      QuestGenerator.instance = new QuestGenerator();
    }
    return QuestGenerator.instance;
  }

  /**
   * Filter quest blocks based on user input criteria
   */
  private filterQuestBlocks(blocks: QuestBlock[], input: QuestInput): QuestBlock[] {
    return blocks.filter(block => {
      // 1. Difficulty filter (±1 level)
      const userDifficultyValue = DIFFICULTY_VALUES[input.difficulty];
      const blockDifficultyValue = DIFFICULTY_VALUES[block.Difficulty_Tag];
      const difficultyRange = [userDifficultyValue - 1, userDifficultyValue, userDifficultyValue + 1];
      
      if (!difficultyRange.includes(blockDifficultyValue)) {
        return false;
      }

      // 2. Transportation filter
      if (input.transportation === 'no_car' && block.Transportation_Required === 'car_required') {
        return false;
      }

      // 3. Theme filter (include if theme matches OR block has no theme tags)
      if (input.theme) {
        const blockThemes = block.Theme_Tags?.toLowerCase().split(',').map(t => t.trim()) || [];
        const hasMatchingTheme = blockThemes.includes(input.theme.toLowerCase());
        const hasNoTheme = !block.Theme_Tags || block.Theme_Tags.trim() === '';
        
        if (!hasMatchingTheme && !hasNoTheme) {
          return false;
        }
      }

      // 4. Time constraint filter
      const timeLimit = TIMEFRAME_LIMITS[input.timeframe];
      if (block.Time_Required > timeLimit) {
        return false;
      }

      return true;
    });
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
   * Generate a single quest from 3 random blocks
   */
  private generateSingleQuest(filteredBlocks: QuestBlock[], questId: string): GeneratedQuest | null {
    if (filteredBlocks.length < 3) {
      return null;
    }

    // Randomly select 3 blocks
    const selectedBlocks: QuestBlock[] = [];
    const availableBlocks = [...filteredBlocks];

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableBlocks.length);
      selectedBlocks.push(availableBlocks[randomIndex]);
      availableBlocks.splice(randomIndex, 1); // Remove to avoid duplicates
    }

    // Create quest description
    const description = selectedBlocks
      .map(block => block.Idea)
      .join(' + ');

    // Calculate total time
    const totalTime = selectedBlocks.reduce((sum, block) => sum + block.Time_Required, 0);

    // Calculate average difficulty
    const difficulty = this.calculateAverageDifficulty(selectedBlocks);

    // Extract tags
    const tags = this.extractTags(selectedBlocks);

    return {
      id: questId,
      description,
      totalTime,
      difficulty,
      blocks: selectedBlocks,
      tags
    };
  }

  /**
   * Generate 5 quest options based on user input
   */
  public async generateQuests(input: QuestInput): Promise<QuestGenerationResponse> {
    try {
      // Fetch all quest blocks from database
      const allBlocks = await database.getQuestBlocks();

      // Filter blocks based on criteria
      const filteredBlocks = this.filterQuestBlocks(allBlocks, input);

      // Check if we have enough blocks
      if (filteredBlocks.length < 3) {
        return {
          success: false,
          quests: [],
          filteredBlocksCount: filteredBlocks.length,
          error: `Not enough quest blocks available. Found ${filteredBlocks.length}, need at least 3.`
        };
      }

      // Generate 5 quest options
      const quests: GeneratedQuest[] = [];
      const maxAttempts = 20; // Prevent infinite loops
      let attempts = 0;

      while (quests.length < 5 && attempts < maxAttempts) {
        const quest = this.generateSingleQuest(filteredBlocks, `quest_${Date.now()}_${quests.length + 1}`);
        if (quest) {
          quests.push(quest);
        }
        attempts++;
      }

      return {
        success: true,
        quests,
        filteredBlocksCount: filteredBlocks.length
      };

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
}

// Export singleton instance
export const questGenerator = QuestGenerator.getInstance();