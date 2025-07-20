import { NextRequest, NextResponse } from 'next/server';
import { questGenerator } from '@/lib/questGenerator';
import { QuestInput } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { timeframe, difficulty, transportation, theme, location } = body;
    
    if (!timeframe || !difficulty || !transportation) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: timeframe, difficulty, transportation' 
        },
        { status: 400 }
      );
    }

    // Validate field values
    const validTimeframes = ['quick', 'afternoon', 'day', 'epic'];
    const validDifficulties = ['easy', 'medium', 'hard', 'extreme'];
    const validTransportation = ['has_car', 'no_car'];
    const validThemes = ['journey', 'life_changing', 'playbook', 'virtuous'];

    if (!validTimeframes.includes(timeframe)) {
      return NextResponse.json(
        { success: false, error: `Invalid timeframe. Must be one of: ${validTimeframes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: `Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validTransportation.includes(transportation)) {
      return NextResponse.json(
        { success: false, error: `Invalid transportation. Must be one of: ${validTransportation.join(', ')}` },
        { status: 400 }
      );
    }

    if (theme && !validThemes.includes(theme)) {
      return NextResponse.json(
        { success: false, error: `Invalid theme. Must be one of: ${validThemes.join(', ')}` },
        { status: 400 }
      );
    }

    // Build quest input
    const questInput: QuestInput = {
      timeframe,
      difficulty,
      transportation,
      theme: theme || undefined,
      location: location || undefined
    };

    // Generate quests
    const result = await questGenerator.generateQuests(questInput);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in quest generation API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
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
    message: 'Quest generation API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: 'Generate quests based on user preferences',
      requiredFields: ['timeframe', 'difficulty', 'transportation'],
      optionalFields: ['theme', 'location']
    }
  });
}