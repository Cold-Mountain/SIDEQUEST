import { google } from 'googleapis';
import { QuestBlock, LocationSeed, UserSubmission } from '@/types/database';

// Google Sheets configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyBDEtZUCRa7J5YfWl-uGyVpAPTTD--7FLQ';
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID || '1-k8zUuzMiLh86BwFTOp1zcLPyQX1rLJ7yC665U_CZZs';

// Initialize Google Sheets API
const sheets = google.sheets({
  version: 'v4',
  auth: GOOGLE_API_KEY,
});

// Sheet names
export const SHEET_NAMES = {
  QUEST_BLOCKS: 'Quest Blocks',
  LOCATION_SEEDS: 'Location Seeds',
  USER_SUBMISSIONS: 'User Submissions',
} as const;

// Helper function to convert row data to typed objects
function parseQuestBlock(row: string[]): QuestBlock {
  return {
    Block_ID: row[0] || '',
    Block_Type: (row[1] as QuestBlock['Block_Type']) || 'physical',
    Idea: row[2] || '',
    Time_Required: parseInt(row[3]) || 0,
    Difficulty_Tag: (row[4] as QuestBlock['Difficulty_Tag']) || 'easy',
    Location_Dependent: (row[5] as 'YES' | 'NO') || 'NO',
    Transportation_Required: (row[6] as QuestBlock['Transportation_Required']) || 'no_car_needed',
    Weather_Modifier: (row[7] as QuestBlock['Weather_Modifier']) || 'all_weather',
    Theme_Tags: row[8] || 'general',
    Cost_Estimate: (row[9] as QuestBlock['Cost_Estimate']) || '0',
    Indoor_Outdoor: (row[10] as QuestBlock['Indoor_Outdoor']) || 'both',
    Social_Level: (row[11] as QuestBlock['Social_Level']) || 'solo',
    Equipment_Needed: row[12] || 'none',
    Time_of_Day: (row[13] as QuestBlock['Time_of_Day']) || 'anytime',
    Physical_Intensity: (row[14] as QuestBlock['Physical_Intensity']) || 'low',
    Combination_Priority: (row[15] as QuestBlock['Combination_Priority']) || 'medium',
    Special_Notes: row[16] || '',
  };
}

function parseLocationSeed(row: string[]): LocationSeed {
  return {
    Location_ID: row[0] || '',
    Location_Type: row[1] || '',
    Specific_Examples: row[2] || '',
    Weather_Sensitivity: (row[3] as LocationSeed['Weather_Sensitivity']) || 'medium',
    Public_Access: (row[4] as LocationSeed['Public_Access']) || 'varies',
    Theme_Compatibility: row[5] || 'general',
  };
}

function parseUserSubmission(row: string[]): UserSubmission {
  return {
    Submission_Date: row[0] || '',
    User_Email: row[1] || '',
    Block_Type: row[2] || '',
    Action_Idea: row[3] || '',
    Why_Meaningful: row[4] || '',
    Status: (row[5] as UserSubmission['Status']) || 'pending',
    Admin_Notes: row[6] || '',
  };
}

// Database access functions
export class SidequestDatabase {
  private static instance: SidequestDatabase;
  private questBlocksCache: QuestBlock[] = [];
  private locationSeedsCache: LocationSeed[] = [];
  private lastFetchTime = 0;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): SidequestDatabase {
    if (!SidequestDatabase.instance) {
      SidequestDatabase.instance = new SidequestDatabase();
    }
    return SidequestDatabase.instance;
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastFetchTime > this.cacheTimeout;
  }

  // Fetch Quest Blocks from Google Sheets
  public async getQuestBlocks(forceRefresh = false): Promise<QuestBlock[]> {
    if (!forceRefresh && !this.shouldRefreshCache() && this.questBlocksCache.length > 0) {
      return this.questBlocksCache;
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAMES.QUEST_BLOCKS}!A2:Q`, // Skip header row
      });

      const rows = response.data.values || [];
      this.questBlocksCache = rows.map(parseQuestBlock);
      this.lastFetchTime = Date.now();
      
      return this.questBlocksCache;
    } catch (error) {
      console.error('Error fetching quest blocks:', error);
      throw new Error('Failed to fetch quest blocks from database');
    }
  }

  // Fetch Location Seeds from Google Sheets
  public async getLocationSeeds(forceRefresh = false): Promise<LocationSeed[]> {
    if (!forceRefresh && !this.shouldRefreshCache() && this.locationSeedsCache.length > 0) {
      return this.locationSeedsCache;
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAMES.LOCATION_SEEDS}!A2:F`, // Skip header row
      });

      const rows = response.data.values || [];
      this.locationSeedsCache = rows.map(parseLocationSeed);
      this.lastFetchTime = Date.now();
      
      return this.locationSeedsCache;
    } catch (error) {
      console.error('Error fetching location seeds:', error);
      throw new Error('Failed to fetch location seeds from database');
    }
  }

  // Submit user suggestion
  public async submitUserSuggestion(submission: Omit<UserSubmission, 'Submission_Date' | 'Status' | 'Admin_Notes'>): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const values = [
        now,
        submission.User_Email,
        submission.Block_Type,
        submission.Action_Idea,
        submission.Why_Meaningful,
        'pending',
        ''
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAMES.USER_SUBMISSIONS}!A:G`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return true;
    } catch (error) {
      console.error('Error submitting user suggestion:', error);
      return false;
    }
  }

  // Filter quest blocks based on criteria
  public filterQuestBlocks(
    blocks: QuestBlock[],
    criteria: {
      difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
      timeRequired?: number; // max minutes
      transportation?: 'has_car' | 'no_car';
      theme?: string;
      weather?: string;
      timeOfDay?: string;
      indoor?: boolean;
      outdoor?: boolean;
    }
  ): QuestBlock[] {
    return blocks.filter(block => {
      // Difficulty filter
      if (criteria.difficulty && block.Difficulty_Tag !== criteria.difficulty) {
        return false;
      }

      // Time filter
      if (criteria.timeRequired && block.Time_Required > criteria.timeRequired) {
        return false;
      }

      // Transportation filter
      if (criteria.transportation === 'no_car' && block.Transportation_Required === 'car_required') {
        return false;
      }

      // Theme filter
      if (criteria.theme) {
        const blockThemes = block.Theme_Tags?.toLowerCase().split(',').map(t => t.trim()) || [];
        const hasMatchingTheme = blockThemes.includes(criteria.theme.toLowerCase());
        const hasNoTheme = !block.Theme_Tags || block.Theme_Tags.trim() === '';
        
        if (!hasMatchingTheme && !hasNoTheme) {
          return false;
        }
      }

      // Weather filter
      if (criteria.weather && block.Weather_Modifier !== 'all_weather' && block.Weather_Modifier !== criteria.weather) {
        return false;
      }

      // Time of day filter
      if (criteria.timeOfDay && block.Time_of_Day !== 'anytime' && block.Time_of_Day !== criteria.timeOfDay) {
        return false;
      }

      // Indoor/outdoor filter
      if (criteria.indoor !== undefined || criteria.outdoor !== undefined) {
        if (criteria.indoor && !['indoor', 'both'].includes(block.Indoor_Outdoor)) {
          return false;
        }
        if (criteria.outdoor && !['outdoor', 'both'].includes(block.Indoor_Outdoor)) {
          return false;
        }
      }

      return true;
    });
  }

  // Clear cache to force refresh
  public clearCache(): void {
    this.questBlocksCache = [];
    this.locationSeedsCache = [];
    this.lastFetchTime = 0;
  }
}

// Export singleton instance
export const database = SidequestDatabase.getInstance();