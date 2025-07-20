// Google Sheets Database Types

export interface QuestBlock {
  Block_ID: string;
  Block_Type: 'physical' | 'obtain' | 'create' | 'location' | 'learn' | 'perform' | 'costume';
  Idea: string;
  Time_Required: number; // minutes
  Difficulty_Tag: 'easy' | 'medium' | 'hard' | 'extreme';
  Location_Dependent: 'YES' | 'NO';
  Transportation_Required: 'car_required' | 'car_optional' | 'no_car_needed';
  Weather_Modifier: 'all_weather' | 'no_rain' | 'daylight_only' | 'clear_skies';
  Theme_Tags: string; // comma-separated: romantic, life_changing, journey, virtuous
  Cost_Estimate: '0' | '$' | '$$' | '$$$';
  Indoor_Outdoor: 'indoor' | 'outdoor' | 'both';
  Social_Level: 'solo' | 'optional_social' | 'requires_others';
  Equipment_Needed: string;
  Time_of_Day: 'anytime' | 'business_hours' | 'daylight' | 'night_only';
  Physical_Intensity: 'low' | 'moderate' | 'high';
  Combination_Priority: 'high' | 'medium' | 'low';
  Special_Notes: string;
}

export interface LocationSeed {
  Location_ID: string;
  Location_Type: string;
  Specific_Examples: string;
  Weather_Sensitivity: 'high' | 'medium' | 'low';
  Public_Access: 'always_open' | 'business_hours' | 'varies';
  Theme_Compatibility: string; // comma-separated themes
}

export interface UserSubmission {
  Submission_Date: string;
  User_Email: string;
  Block_Type: string;
  Action_Idea: string;
  Why_Meaningful: string;
  Status: 'pending' | 'approved' | 'rejected';
  Admin_Notes: string;
}

// User input types for quest generation
export interface QuestInput {
  timeframe: 'quick' | 'afternoon' | 'day' | 'epic'; // under hour, few hours, full day, multi-day
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  transportation: 'has_car' | 'no_car';
  theme?: 'journey' | 'life_changing' | 'playbook' | 'virtuous';
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
}

// Generated quest output types
export interface GeneratedQuest {
  id: string;
  description: string;
  totalTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  blocks: QuestBlock[];
  tags: string[];
}

export interface QuestGenerationResponse {
  success: boolean;
  quests: GeneratedQuest[];
  filteredBlocksCount: number;
  error?: string;
}