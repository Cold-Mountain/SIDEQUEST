import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuestInput, GeneratedQuest, AtlasObscuraLocation, TrailLocation } from '@/types/database';
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SIDEQUEST_PROMPT = `
SIDEQUEST GENERATION PROMPT
You are a quest-giver for Sidequest. Take the provided quest sprout (1 activity + 1 location) and enhance it.

Your Task:
- Write a quest description that connects the activity to the EXACT location provided
- Sound like a mysterious quest-giver from a video game
- Use the EXACT location name from the data - do not make up location names
- Make sure the original activity is clearly stated

Input You'll Receive:
- Context (difficulty, time, transportation, theme, location)
- 1 quest sprout containing:
  * 1 activity from our database
  * 1 specific location (either Atlas Obscura cultural site or hiking trail) with exact name and details

CRITICAL REQUIREMENTS:
- Use the EXACT location name provided in the selected sprout
- Do NOT invent or substitute location names
- Do NOT use ** bold formatting or any markdown
- If a sprout says "at River Country" - use "River Country", if it says "at West Orange Trail" - use "West Orange Trail"
- The activity must take place AT the specified location

Output Format:
Write ONLY the quest description in plain text (no ** formatting) that mentions the exact activity at the exact Atlas Obscura location.

Tone Guide:
- Sound like an NPC giving a quest
- Be mysterious but direct  
- The activity and location must be clearly identifiable
- Connect them naturally but don't hide what they are

Example:
"Your path leads to Discovery Island, Disney's forgotten sanctuary. There, among the overgrown ruins, you must learn to solve a Rubik's cube while contemplating what was left behind."

Remember: Use the EXACT location name provided. No bold formatting. Make it clear what to do and where to go.
`;

export interface EnhancedQuest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeframe: string;
  expiresAt: Date;
  originalBlocks: string[];
  userInputs: QuestInput;
  atlasLocation?: AtlasObscuraLocation;
  trailLocation?: TrailLocation;
}

export async function enhanceQuestWithGemini(
  questOptions: GeneratedQuest[],
  userInputs: QuestInput
): Promise<EnhancedQuest> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Format the single quest for Gemini with location details
    const quest = questOptions[0]; // We only have 1 quest now
    let questDescription = quest.description;
    
    // Add location details if present
    if (quest.atlasLocation) {
      questDescription += ` (Atlas Obscura Location: "${quest.atlasLocation.title}" - ${quest.atlasLocation.description || quest.atlasLocation.location || 'Mysterious location'})`;
    } else if (quest.trailLocation) {
      questDescription += ` (Trail Location: "${quest.trailLocation.title}" - ${quest.trailLocation.description || quest.trailLocation.location || 'Hiking location'})`;
    }

    // Build context for Gemini
    const contextInfo = [
      `Difficulty: ${userInputs.difficulty}`,
      `Timeframe: ${userInputs.timeframe}`,
      `Transportation: ${userInputs.transportation}`,
      userInputs.theme ? `Theme: ${userInputs.theme}` : '',
      userInputs.location ? `Location: coordinates provided` : '',
    ].filter(Boolean).join('\n');

    const fullPrompt = `${SIDEQUEST_PROMPT}

Quest Sprout to Enhance:
${questDescription}

Context:
${contextInfo}

Create an enhanced quest:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const enhancedDescription = response.text().trim();

    // Generate quest ID and expiration
    const questId = `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now (extended)

    // Extract original block descriptions
    const originalBlocks = questOptions.flatMap(quest => 
      quest.blocks.map(block => block.Idea)
    );

    // Use the location from our single quest
    const atlasLocation = quest.atlasLocation || undefined;
    const trailLocation = quest.trailLocation || undefined;
    
    if (atlasLocation) {
      console.log(`Using Atlas location: ${atlasLocation.title}`);
    } else if (trailLocation) {
      console.log(`Using trail location: ${trailLocation.title}`);
    }

    // Generate a title from the first few words
    const titleWords = enhancedDescription.split(' ').slice(0, 6).join(' ');
    const title = titleWords.length > 50 ? titleWords.substring(0, 47) + '...' : titleWords;

    return {
      id: questId,
      title,
      description: enhancedDescription,
      difficulty: userInputs.difficulty,
      timeframe: userInputs.timeframe,
      expiresAt,
      originalBlocks,
      userInputs,
      atlasLocation,
      trailLocation
    };

  } catch (error) {
    console.error('Error enhancing quest with Gemini:', error);
    throw new Error('Failed to enhance quest with AI. Please try again.');
  }
}

// Simple file-based quest storage for development (will be replaced with database later)
const STORAGE_DIR = path.join(process.cwd(), '.quest-storage');
const questStorage = new Map<string, EnhancedQuest>();

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Load existing quests from files on startup
function loadQuestsFromDisk(): void {
  try {
    const files = fs.readdirSync(STORAGE_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const questId = file.replace('.json', '');
        const filePath = path.join(STORAGE_DIR, file);
        const questData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Check if quest has expired
        if (new Date(questData.expiresAt) > new Date()) {
          questStorage.set(questId, {
            ...questData,
            expiresAt: new Date(questData.expiresAt)
          });
        } else {
          // Delete expired quest file
          fs.unlinkSync(filePath);
        }
      }
    }
    console.log(`Loaded ${questStorage.size} active quests from disk`);
  } catch (error) {
    console.warn('Error loading quests from disk:', error);
  }
}

// Load quests on module initialization
loadQuestsFromDisk();

export function storeQuest(quest: EnhancedQuest): void {
  questStorage.set(quest.id, quest);
  
  // Also persist to disk
  try {
    const filePath = path.join(STORAGE_DIR, `${quest.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(quest, null, 2));
    console.log(`Stored quest ${quest.id}. Total quests in storage: ${questStorage.size}`);
  } catch (error) {
    console.error(`Error persisting quest ${quest.id} to disk:`, error);
  }
}

export function getQuest(questId: string): EnhancedQuest | null {
  console.log(`Looking for quest ${questId}. Total quests in storage: ${questStorage.size}`);
  let quest = questStorage.get(questId);
  
  // If not in memory, try loading from disk
  if (!quest) {
    try {
      const filePath = path.join(STORAGE_DIR, `${questId}.json`);
      if (fs.existsSync(filePath)) {
        const questData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        quest = {
          ...questData,
          expiresAt: new Date(questData.expiresAt)
        } as EnhancedQuest;
        questStorage.set(questId, quest);
        console.log(`Loaded quest ${questId} from disk`);
      }
    } catch (error) {
      console.error(`Error loading quest ${questId} from disk:`, error);
    }
  }
  
  if (!quest) {
    console.log(`Quest ${questId} not found in storage or disk`);
    return null;
  }
  
  // Check if quest has expired
  if (quest.expiresAt < new Date()) {
    console.log(`Quest ${questId} has expired`);
    questStorage.delete(questId);
    
    // Delete from disk too
    try {
      const filePath = path.join(STORAGE_DIR, `${questId}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error deleting expired quest ${questId} from disk:`, error);
    }
    
    return null;
  }
  
  console.log(`Found quest ${questId}`);
  return quest;
}

export function getAllActiveQuests(): EnhancedQuest[] {
  const now = new Date();
  const activeQuests: EnhancedQuest[] = [];
  
  for (const [questId, quest] of questStorage.entries()) {
    if (quest.expiresAt < now) {
      questStorage.delete(questId);
    } else {
      activeQuests.push(quest);
    }
  }
  
  return activeQuests;
}