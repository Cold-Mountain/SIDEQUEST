export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
}

export interface Sidequest {
  id: string;
  title: string;
  description: string;
  category: SidequestCategory;
  difficulty: SidequestDifficulty;
  estimatedTime: number; // minutes
  createdBy: string;
  createdAt: Date;
  participants: string[];
  completions: string[];
  isActive: boolean;
}

export type SidequestCategory = 
  | 'adventure'
  | 'creative'
  | 'social'
  | 'learning'
  | 'wellness'
  | 'mystery';

export type SidequestDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface SidequestCompletion {
  id: string;
  sidequestId: string;
  userId: string;
  completedAt: Date;
  proof?: string; // image or text proof
  reflection?: string;
}

// Re-export database types
export type { QuestBlock, LocationSeed, UserSubmission, QuestInput } from './database';

// Re-export location types
export type { Location, LocationResult, LocationPermission, IPLocationResponse } from './location';