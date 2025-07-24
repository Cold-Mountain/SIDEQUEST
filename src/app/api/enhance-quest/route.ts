import { NextRequest, NextResponse } from 'next/server';
import { questGenerator } from '@/lib/questGenerator';
import { enhanceQuestWithGemini, storeQuest } from '@/lib/gemini';
import { QuestInput } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questInput } = body;
    
    // Validate request body
    if (!questInput || typeof questInput !== 'object') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing or invalid quest input data' 
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const { timeframe, difficulty, transportation, location } = questInput;
    if (!timeframe || !difficulty || !transportation || !location) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: timeframe, difficulty, transportation, and location are all required' 
        },
        { status: 400 }
      );
    }

    console.log('Enhancing quest with input:', questInput);

    // Step 1: Generate 1 quest option using existing logic
    console.log('About to call questGenerator.generateQuests...');
    const questOptions = await questGenerator.generateQuests(questInput as QuestInput);
    console.log('Quest generation completed:', questOptions);
    
    if (!questOptions.success || questOptions.quests.length === 0) {
      const errorMessage = questOptions.error || 'Failed to generate base quest options';
      console.error('Quest generation failed:', errorMessage, {
        filteredBlocksCount: questOptions.filteredBlocksCount,
        input: questInput
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          details: `Found ${questOptions.filteredBlocksCount} suitable quest blocks`
        },
        { status: 500 }
      );
    }

    console.log(`Generated ${questOptions.quests.length} quest options for Gemini enhancement`);

    // Step 2: Enhance a random quest option with Gemini AI
    try {
      // Select a random quest from the generated options
      const randomIndex = Math.floor(Math.random() * questOptions.quests.length);
      const selectedQuest = questOptions.quests[randomIndex];
      
      console.log(`Selected quest ${randomIndex + 1} of ${questOptions.quests.length} for enhancement`);
      
      const enhancedQuest = await enhanceQuestWithGemini(
        [selectedQuest], // Pass single quest for enhancement
        questInput as QuestInput
      );

      console.log('Quest enhanced by Gemini:', enhancedQuest.id);

      // Step 3: Store the quest
      storeQuest(enhancedQuest);

      // Return the quest ID for navigation
      return NextResponse.json({
        success: true,
        questId: enhancedQuest.id,
        redirectUrl: `/quest/${enhancedQuest.id}`
      });
    } catch (geminiError) {
      console.error('Gemini enhancement failed:', geminiError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to enhance quest with AI. The base quest was generated but could not be enhanced.',
          fallback: true
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in quest enhancement API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error occurred during quest generation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Quest enhancement API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: 'Enhance quest options with Gemini AI and return quest ID'
    }
  });
}